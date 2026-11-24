#!/usr/bin/env node
/**
 * Auto-generates a hash-bound, strict Cold-Read Gate input from an episode directory.
 *
 * Emits ONLY what a blind first-time viewer perceives:
 *   - chat-script.json SHA-256 (to make stale cold-reads immediately obvious)
 *   - on-screen chat header (groupName, memberCount)
 *   - archive metadata evidence labels (stripLine + evidence events)
 *   - chat texts, system lines, notification text, voice-note subtitles
 *   - PLAYBACK badges & CCTV timestamps
 *   - one-line literal still descriptions (from script.stillDescriptions or brief.md Visuals table)
 *
 * NEVER emits clueLedger, audio/sound-design notes, silenceDrops, tension layers,
 * character voice IDs, glitches, zoom hints, or brief narrative explanations.
 */
import {createHash} from "node:crypto";
import {existsSync, readFileSync, writeFileSync} from "node:fs";
import {join, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {isTanpaNamaCharacter, V3_TANPA_NAMA} from "../src/v3/layout.mjs";

export function sha256Buffer(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

/**
 * Parse ONLY the Visuals List markdown table from brief.md to extract literal one-line
 * still descriptions keyed by event ID and asset src. Ignores all other brief sections.
 */
export function parseBriefStillDescriptions(briefMarkdown) {
  const byKey = new Map();
  if (typeof briefMarkdown !== "string") return byKey;
  const lines = briefMarkdown.split(/\r?\n/);

  let inVisualsSection = false;
  let assetCol = -1;
  let eventCol = -1;
  let descCol = -1;

  for (const line of lines) {
    if (/^##\s+Visuals List\b/i.test(line)) {
      inVisualsSection = true;
      assetCol = -1;
      eventCol = -1;
      descCol = -1;
      continue;
    }
    if (inVisualsSection && /^##\s+/.test(line)) {
      break;
    }
    if (!inVisualsSection || !line.trim().startsWith("|")) continue;

    const cells = line
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());

    if (cells.every((c) => /^:?-+:?$/.test(c))) continue;

    if (descCol === -1) {
      cells.forEach((header, idx) => {
        if (/asset\s*path/i.test(header)) assetCol = idx;
        else if (/event\s*id/i.test(header)) eventCol = idx;
        else if (/literal|description|subject/i.test(header)) descCol = idx;
      });
      continue;
    }

    const desc = descCol >= 0 ? cells[descCol] : "";
    if (!desc) continue;
    const stripTicks = (s) => (s ?? "").replace(/^`+|`+$/g, "").trim();
    if (eventCol >= 0 && cells[eventCol]) {
      byKey.set(stripTicks(cells[eventCol]), desc);
    }
    if (assetCol >= 0 && cells[assetCol]) {
      byKey.set(stripTicks(cells[assetCol]), desc);
    }
  }
  return byKey;
}

function resolveDisplayName(characterMap, fromId) {
  const char = characterMap.get(fromId);
  if (isTanpaNamaCharacter(char, fromId)) return V3_TANPA_NAMA.displayName;
  return char?.name?.trim() || V3_TANPA_NAMA.displayName;
}

export function buildStrictColdReadInput({script, scriptSha256, briefMarkdown = ""}) {
  const briefDescs = parseBriefStillDescriptions(briefMarkdown);
  const inlineDescs = script.stillDescriptions && typeof script.stillDescriptions === "object"
    ? script.stillDescriptions
    : {};
  const lookupStillDesc = (event) => {
    const raw =
      inlineDescs[event.id] ??
      inlineDescs[event.src] ??
      briefDescs.get(event.id) ??
      briefDescs.get(event.src);
    if (!raw || !String(raw).trim()) {
      throw new Error(
        `Missing literal still description for event "${event.id}" (${event.src}); add it to script.stillDescriptions or the brief.md Visuals List table.`,
      );
    }
    return String(raw).trim();
  };

  const characterMap = new Map((script.characters ?? []).map((c) => [c.id, c]));
  const lines = [
    "# Strict Cold-Read Input",
    "",
    `- **Script ID:** \`${script.id}\``,
    `- **Script SHA-256:** \`${scriptSha256}\``,
    "",
    "This document contains ONLY the permitted on-screen/subtitle blind-review fields (no brief prose, no clue ledger, no audio/production notes). Answer Q1–Q4 based strictly on the material below.",
    "",
    `On-screen chat header: ${script.app.groupName}${script.app.memberCount ? ` · ${script.app.memberCount} anggota` : ""}`,
  ];

  if (script.archiveMetadata?.stripLine?.trim()) {
    lines.push(`Evidence label: ${script.archiveMetadata.stripLine.trim()}`);
  }
  lines.push("");

  for (const event of script.events ?? []) {
    if (event.type === "text") {
      const sender = resolveDisplayName(characterMap, event.from);
      const time = event.timeLabel ? `, ${event.timeLabel}` : "";
      const edited = event.edited ? " (diedit)" : "";
      lines.push(`${sender}${time}: ${event.text}${edited}`);
      continue;
    }

    if (event.type === "photo") {
      const sender = resolveDisplayName(characterMap, event.from);
      const time = event.timeLabel ? `, ${event.timeLabel}` : "";
      const desc = lookupStillDesc(event);
      if (event.caption && event.caption.trim()) {
        lines.push(`${sender}${time}: ${event.caption.trim()}`);
        lines.push(`Photo ${event.id}: ${desc}`);
      } else {
        lines.push(`${sender}${time}, photo ${event.id}: ${desc}`);
      }
      continue;
    }

    if (event.type === "voice") {
      const sender = resolveDisplayName(characterMap, event.from);
      const time = event.timeLabel ? `, ${event.timeLabel}` : "";
      lines.push(`${sender}${time}, voice-note subtitle: ${event.subtitle}`);
      continue;
    }

    if (event.type === "system") {
      lines.push(event.text);
      continue;
    }

    if (event.type === "cctv") {
      const desc = lookupStillDesc(event);
      const prefix = event.playback
        ? `PLAYBACK ${event.timestampLabel}`
        : `${event.cameraLabel} ${event.timestampLabel}`;
      lines.push(`${prefix}. Still ${event.id}: ${desc}`);
      continue;
    }

    if (event.type === "evidence") {
      lines.push(`Evidence label: ${event.text}`);
      continue;
    }

    if (event.type === "notification") {
      const app = event.appName ? `${event.appName} — ` : "";
      lines.push(`Notification: ${app}${event.title}: ${event.body}`);
      continue;
    }

    // Call screens are intentionally excluded from strict text/still cold-read scope
    // (missed-call system text in the chat thread carries the chat-visible record).
  }

  lines.push("");
  return lines.join("\n");
}

export function exportColdReadInput(episodeDir) {
  const dir = resolve(episodeDir);
  const scriptPath = join(dir, "chat-script.json");
  if (!existsSync(scriptPath)) {
    throw new Error(`chat-script.json not found in ${dir}`);
  }
  const scriptBytes = readFileSync(scriptPath);
  const scriptSha256 = sha256Buffer(scriptBytes);
  const script = JSON.parse(scriptBytes.toString("utf8"));

  const briefPath = join(dir, "brief.md");
  const briefMarkdown = existsSync(briefPath) ? readFileSync(briefPath, "utf8") : "";

  const markdown = buildStrictColdReadInput({script, scriptSha256, briefMarkdown});
  return {scriptPath, scriptSha256, markdown};
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const args = process.argv.slice(2);
  let episodeDir = null;
  let outPath = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--out" && args[i + 1]) {
      outPath = args[++i];
    } else if (!episodeDir) {
      episodeDir = args[i];
    }
  }
  if (!episodeDir) {
    console.error("Usage: node scripts/export-cold-read-input.mjs <episode-dir> [--out <file.md>]");
    process.exit(1);
  }
  const {markdown} = exportColdReadInput(episodeDir);
  if (outPath) {
    writeFileSync(resolve(outPath), markdown, "utf8");
  } else {
    process.stdout.write(markdown);
  }
}
