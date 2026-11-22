export type SpeakerCaptionProps = {
  speaker?: string | null;
  text: string;
  words?: {text: string; color?: string}[];
};

export function SpeakerCaption({speaker, text, words}: SpeakerCaptionProps) {
  const label = speaker?.trim() ?? "";
  const narrator = label === "" || ["NARATOR", "NARRATOR"].includes(label.toUpperCase());
  const voiceColor = narrator ? "white" : "#ffe154";

  return <div style={{
    position: "absolute", top: "77%", left: "5%", width: "90%", textAlign: "center",
    fontFamily: "Arial, sans-serif", fontWeight: 900, color: voiceColor,
    textShadow: "-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000",
  }}>
    {!narrator && <div style={{fontSize: 29, letterSpacing: 2}}>{label}</div>}
    <div style={{fontSize: 59}}>{words ? words.map((word, index) => <span key={index} style={{color: word.color === 'red' || word.color === 'danger' ? '#f2544e' : word.color === 'yellow' || word.color === 'highlight' ? '#ffd052' : '#fff'}}>{index > 0 ? ' ' : ''}{word.text}</span>) : text}</div>
  </div>;
}
