import {Audio} from '@remotion/media';
import {AbsoluteFill, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ArchiveIdentityStrip} from './components/ArchiveIdentityStrip';
import {CallScreen} from './components/CallScreen';
import {CctvFrame} from './components/CctvFrame';
import {ChatHeader} from './components/ChatHeader';
import {EvidenceTagOverlay} from './components/EvidenceTagOverlay';
import {MessageBubble} from './components/MessageBubble';
import {Notification} from './components/Notification';
import {PhoneFrame} from './components/PhoneFrame';
import {PhotoMessage, PhotoZoomOverlay} from './components/PhotoMessage';
import {SystemMessage} from './components/SystemMessage';
import {VoiceNoteBubble} from './components/VoiceNoteBubble';
import {
  isTanpaNamaCharacter,
  V3_CHROME_REGIONS,
  V3_CRITICAL_REGIONS,
  V3_FONT_SIZES,
  V3_TANPA_NAMA,
  V3_THEME,
} from './layout.mjs';
import type {
  CallEventV3,
  CctvEventV3,
  CharacterV3,
  ChatEventV3,
  ChatScriptV3,
  EvidenceEventV3,
  NotificationEventV3,
  PhotoEventV3,
  SystemEventV3,
  TextEventV3,
  VoiceEventV3,
} from './types';

export type ArsipPlayerProps = {
  script: ChatScriptV3;
};

type ThreadEvent = TextEventV3 | PhotoEventV3 | VoiceEventV3 | SystemEventV3;

const THREAD_GAP = 24;
const THREAD_TOP_PAD = 18;
const THREAD_BOTTOM_PAD = 36;
const TYPING_BUBBLE_HEIGHT = 100;

function isThreadEvent(event: ChatEventV3): event is ThreadEvent {
  return event.type === 'text' || event.type === 'photo' || event.type === 'voice' || event.type === 'system';
}

function estimateEventHeight(event: ThreadEvent): number {
  if (event.type === 'text') {
    const lines = Math.max(1, Math.ceil((event.text.length + (event.edited ? 9 : 0)) / 30));
    return 94 + lines * 58;
  }
  if (event.type === 'photo') {
    const captionLines = event.caption ? Math.max(1, Math.ceil(event.caption.length / 30)) : 0;
    return 534 + (captionLines > 0 ? 12 + captionLines * 56 : 0);
  }
  if (event.type === 'voice') {
    const subLines = Math.max(1, Math.ceil((event.subtitle.length + 2) / 30));
    return 214 + 34 + subLines * 56;
  }
  const sysLines = Math.max(1, Math.ceil(event.text.length / 34));
  return 34 + sysLines * 52;
}

function computeScrollOffset(
  threadEvents: ThreadEvent[],
  frame: number,
  safeViewportHeight: number,
  showTypingBubble: boolean,
): number {
  let contentHeight = THREAD_TOP_PAD;
  let prevOffset = 0;
  let currentOffset = 0;

  for (const event of threadEvents) {
    if (frame < event.at) break;
    const itemHeight = estimateEventHeight(event);
    contentHeight += itemHeight + THREAD_GAP;
    const targetOffset = Math.max(0, contentHeight + THREAD_BOTTOM_PAD - safeViewportHeight);
    const local = frame - event.at;
    const t = interpolate(local, [0, 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.out(Easing.cubic),
    });
    currentOffset = prevOffset + (targetOffset - prevOffset) * t;
    prevOffset = targetOffset;
  }

  if (showTypingBubble) {
    const withTyping = Math.max(0, contentHeight + TYPING_BUBBLE_HEIGHT + THREAD_BOTTOM_PAD - safeViewportHeight);
    return Math.max(currentOffset, withTyping);
  }

  return currentOffset;
}

function TypingIndicatorBubble({sender}: {sender?: CharacterV3}) {
  const frame = useCurrentFrame();
  const displayName = sender?.name?.trim() ? sender.name : 'Seseorang';
  const nameColor = sender?.color ?? V3_THEME.textSecondary;

  return (
    <div data-v3="typing-bubble" style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
      <div
        style={{
          padding: '18px 26px',
          borderRadius: '26px 26px 26px 8px',
          backgroundColor: V3_THEME.incomingBubbleBg,
          border: `1.5px solid ${V3_THEME.incomingBubbleBorder}`,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}
      >
        <span style={{color: nameColor, fontSize: V3_FONT_SIZES.senderName, fontWeight: 700}}>{displayName}</span>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          {[0, 1, 2].map((i) => {
            const wave = Math.sin(frame * 0.28 - i * 0.9);
            const lift = Math.max(0, wave) * -8;
            const opacity = 0.4 + Math.max(0, wave) * 0.6;
            return (
              <div
                key={i}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  backgroundColor: V3_THEME.textSecondary,
                  opacity,
                  transform: `translateY(${lift.toFixed(1)}px)`,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function ArsipPlayer({script}: ArsipPlayerProps) {
  const frame = useCurrentFrame();
  const characterMap = new Map(script.characters.map((c) => [c.id, c]));
  const threadEvents = script.events.filter(isThreadEvent);
  const photoEvents = script.events.filter((e): e is PhotoEventV3 => e.type === 'photo');
  const notificationEvents = script.events.filter((e): e is NotificationEventV3 => e.type === 'notification');
  const callEvents = script.events.filter((e): e is CallEventV3 => e.type === 'call');
  const cctvEvents = script.events.filter((e): e is CctvEventV3 => e.type === 'cctv');
  const evidenceEvents = script.events.filter((e): e is EvidenceEventV3 => e.type === 'evidence');
  const silenceDrops = script.audio?.silenceDrops ?? [];
  const isSilenceDropAt = (f: number) => silenceDrops.some((d) => f >= d.startFrame && f < d.endFrame);

  const typingEvent = threadEvents.find((event) => {
    if (event.type === 'system' || !event.typingFrames || event.typingFrames <= 0) return false;
    if (event.from === script.app.selfId) return false;
    return frame >= event.at - event.typingFrames && frame < event.at;
  });
  const typingSender =
    typingEvent && typingEvent.type !== 'system' ? characterMap.get(typingEvent.from) : undefined;
  const typingName = typingSender ? (typingSender.name.trim() || 'Seseorang') : null;

  const chatSafeBox = V3_CRITICAL_REGIONS.chatContent;
  const threadBackdropHeight = V3_CHROME_REGIONS.threadBackdrop.height;
  const scrollY = computeScrollOffset(threadEvents, frame, chatSafeBox.height, Boolean(typingEvent));

  const uiSfx = script.audio?.uiSfx;

  return (
    <AbsoluteFill style={{backgroundColor: V3_THEME.canvasBg, overflow: 'hidden'}}>
      {/* Location ambience bed — drops hard to near-silence during scripted silenceDrops */}
      {script.audio?.ambience && (
        <Audio
          src={staticFile(script.audio.ambience.src)}
          volume={(f) => {
            const base = script.audio?.ambience?.gain ?? 0.35;
            return isSilenceDropAt(f) ? 0.015 : base;
          }}
          loop
        />
      )}

      {/* Non-melodic tension layer (sub rumble/drone rising from odd detail through escalation) */}
      {script.audio?.tension && script.audio.tension.endFrame > script.audio.tension.startFrame && (
        <Sequence
          from={script.audio.tension.startFrame}
          durationInFrames={script.audio.tension.endFrame - script.audio.tension.startFrame}
          layout="none"
        >
          <Audio
            src={staticFile(script.audio.tension.src)}
            volume={(localF) => {
              const t = script.audio!.tension!;
              const absF = t.startFrame + localF;
              if (isSilenceDropAt(absF)) return 0;
              const span = Math.max(1, t.endFrame - t.startFrame);
              const startGain = t.startGain ?? 0.08;
              const peakGain = t.peakGain ?? 0.45;
              const ramp = interpolate(localF, [0, span], [startGain, peakGain], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              const tailOut = interpolate(localF, [Math.max(0, span - 6), span], [1, 0], {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
              });
              return ramp * tailOut;
            }}
            loop
          />
        </Sequence>
      )}

      {/* Per-event UI sound cues: Tanpa Nama signature ping plays ONLY on Tanpa Nama events */}
      {script.events.map((event) => {
        if (event.at <= 0) return null;
        if (event.type === 'notification' && uiSfx?.notification) {
          return (
            <Sequence key={`sfx-${event.id}`} from={event.at} durationInFrames={30} layout="none">
              <Audio src={staticFile(uiSfx.notification)} volume={0.65} />
            </Sequence>
          );
        }
        if (event.type === 'text' || event.type === 'photo' || event.type === 'voice') {
          const sender = characterMap.get(event.from);
          if (isTanpaNamaCharacter(sender, event.from)) {
            return (
              <Sequence key={`sfx-${event.id}`} from={event.at} durationInFrames={18} layout="none">
                <Audio src={staticFile(V3_TANPA_NAMA.signatureSfx)} volume={0.75} />
              </Sequence>
            );
          }
          if (!uiSfx) return null;
          const isSelf = event.from === script.app.selfId;
          const sfxPath = isSelf ? uiSfx.messageOut : uiSfx.messageIn;
          if (!sfxPath) return null;
          return (
            <Sequence key={`sfx-${event.id}`} from={event.at} durationInFrames={24} layout="none">
              <Audio src={staticFile(sfxPath)} volume={0.55} />
            </Sequence>
          );
        }
        return null;
      })}

      {/* Full-bleed 1080x1920 phone interface */}
      <PhoneFrame
        startClock={script.startClock}
        startBattery={script.startBattery}
        endBattery={script.endBattery}
        glitches={script.glitches}
      >
        <ChatHeader
          groupName={script.app.groupName}
          memberCount={script.app.memberCount}
          typingName={typingName}
          statusText={script.app.statusText}
        />

        {/* Reserve solid space matching the full-width identity strip so the chat thread starts and clips strictly below y = 282 */}
        <div style={{height: V3_CHROME_REGIONS.identityStrip.height, backgroundColor: V3_THEME.identityStripBg}} />

        {/* Full-bleed chat thread canvas; active readable content stays inside V3_CRITICAL_REGIONS.chatContent */}
        <div
          data-v3="chat-viewport"
          style={{
            position: 'relative',
            width: '100%',
            height: threadBackdropHeight,
            backgroundColor: V3_THEME.threadBg,
            backgroundImage: 'radial-gradient(ellipse at 40% 25%, #121724 0%, #0B0E15 78%)',
            overflow: 'hidden',
          }}
        >
          {/* Clipped critical safe-zone column so bubbles never bleed into right 12% or pass behind the identity strip */}
          <div
            style={{
              position: 'absolute',
              left: chatSafeBox.x,
              top: 0,
              width: chatSafeBox.width,
              height: chatSafeBox.height,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: `${THREAD_TOP_PAD}px 0 ${THREAD_BOTTOM_PAD}px`,
                display: 'flex',
                flexDirection: 'column',
                gap: THREAD_GAP,
                transform: `translateY(${(-scrollY).toFixed(1)}px)`,
              }}
            >
              {threadEvents.map((event) => {
                if (frame < event.at) return null;
                if (event.type === 'system') {
                  return <SystemMessage key={event.id} event={event} />;
                }
                const sender = characterMap.get(event.from);
                const isSelf = event.from === script.app.selfId;
                if (event.type === 'text') {
                  return <MessageBubble key={event.id} event={event} sender={sender} isSelf={isSelf} />;
                }
                if (event.type === 'photo') {
                  return <PhotoMessage key={event.id} event={event} sender={sender} isSelf={isSelf} />;
                }
                return <VoiceNoteBubble key={event.id} event={event} sender={sender} isSelf={isSelf} />;
              })}

              {typingEvent && <TypingIndicatorBubble sender={typingSender} />}
            </div>
          </div>

          {/* Subtle ambient fade over bottom chrome area */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 310,
              background: 'linear-gradient(180deg, rgba(11,14,21,0) 0%, rgba(11,14,21,0.85) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* Full-bleed decorative composer bar extending cleanly to the bottom edge */}
        <div
          data-v3="input-bar"
          style={{
            height: V3_CHROME_REGIONS.inputBar.height,
            padding: '16px 32px 28px',
            backgroundColor: V3_THEME.inputBarBg,
            borderTop: `1px solid ${V3_THEME.headerBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 18,
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              flex: 1,
              height: 74,
              borderRadius: 24,
              backgroundColor: '#1B2232',
              border: `1px solid ${V3_THEME.headerBorder}`,
              padding: '0 26px',
              display: 'flex',
              alignItems: 'center',
              color: V3_THEME.textMuted,
              fontSize: V3_FONT_SIZES.inputPlaceholder,
            }}
          >
            Tulis pesan…
          </div>
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: 24,
              backgroundColor: '#252E42',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="30" height="30" viewBox="0 0 28 28" aria-hidden="true">
              <polygon points="5,4 24,14 5,24 9,14" fill={V3_THEME.textSecondary} />
            </svg>
          </div>
        </div>

        {/* Full-bleed overlays with critical content inside safe zone */}
        {photoEvents.map((event) => (
          <PhotoZoomOverlay key={`zoom-${event.id}`} event={event} sender={characterMap.get(event.from)} />
        ))}
        {cctvEvents.map((event) => (
          <CctvFrame key={`cctv-${event.id}`} event={event} />
        ))}
        {callEvents.map((event) => (
          <CallScreen key={`call-${event.id}`} event={event} />
        ))}
        {evidenceEvents.map((event) => (
          <EvidenceTagOverlay key={`evidence-${event.id}`} event={event} />
        ))}
        {notificationEvents.map((event) => (
          <Notification key={`notif-${event.id}`} event={event} />
        ))}
      </PhoneFrame>

      {/* Always-visible series identity strip ("ARSIP #NNN · @skenarium") + optional factual metadata line */}
      <ArchiveIdentityStrip
        archiveNumber={script.archiveNumber}
        metadataLine={script.archiveMetadata?.stripLine}
      />
    </AbsoluteFill>
  );
}
