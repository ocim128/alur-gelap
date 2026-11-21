export type SpeakerCaptionProps = {
  speaker?: string | null;
  text: string;
};

export function SpeakerCaption({speaker, text}: SpeakerCaptionProps) {
  const label = speaker?.trim() ?? "";
  const narrator = label === "" || ["NARATOR", "NARRATOR"].includes(label.toUpperCase());
  const voiceColor = narrator ? "white" : "#ffe154";

  return <div style={{
    position: "absolute", top: "72%", width: "100%", textAlign: "center",
    fontFamily: "Arial, sans-serif", fontWeight: 900, color: voiceColor,
    textShadow: "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000",
  }}>
    {!narrator && <div style={{fontSize: 29, letterSpacing: 2}}>{label}</div>}
    <div style={{fontSize: 59}}>{text}</div>
  </div>;
}
