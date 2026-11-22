import {staticFile} from 'remotion';
import type {StudioV2OverlayContext} from '../StudioV2Player';

/** Episode-specific moving details layered over, and clipped to, the selected plates. */
export const DeckGravityClues = ({frame, fps, scene}: StudioV2OverlayContext) => {
  if (scene.id === 'P13') {
    // Keep the painted entity upright. A feathered copy of the actual deck
    // rotates about the contact point below its feet, without inventing a figure.
    const roll = 2.4 * Math.sin(2 * Math.PI * frame / (fps * 5));
    return <svg viewBox="0 0 936 1664" preserveAspectRatio="none" style={{position:'absolute',width:'100%',height:'100%',pointerEvents:'none'}}>
      <defs><linearGradient id="p13-floor-fade" gradientUnits="userSpaceOnUse" x1="0" y1="1300" x2="0" y2="1340"><stop offset="0" stopColor="black" /><stop offset="1" stopColor="white" /></linearGradient><mask id="p13-floor-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="936" height="1664"><rect width="936" height="1664" fill="url(#p13-floor-fade)" /></mask></defs>
      <g mask="url(#p13-floor-mask)"><image href={staticFile(scene.plate)} x="0" y="0" width="936" height="1664" transform={`rotate(${roll} 400 1280)`} /></g>
    </svg>;
  }
  if (scene.id === 'P16' && frame >= Math.round(103.54*fps) && frame < Math.round(107.6*fps)) {
    // Directional reflected streaks remain inside the existing wet-deck area;
    // horizontal travel makes the stated flow legible without arrows or text.
    const shift=((frame-Math.round(103.54*fps))*7)%270;
    return <svg viewBox="0 0 936 1664" preserveAspectRatio="none" style={{position:'absolute',width:'100%',height:'100%',pointerEvents:'none'}}>
      <defs><clipPath id="p16-wet-floor"><path d="M 168 1108 L 476 1108 L 507 1164 L 489 1207 L 156 1207 Z M 130 1270 L 481 1270 L 507 1316 L 491 1380 L 136 1380 Z" /></clipPath></defs>
      <g clipPath="url(#p16-wet-floor)" opacity=".68" fill="none" stroke="#b7d9e5" strokeWidth="5.5" strokeLinecap="round">
        {Array.from({length:5},(_,i)=><g key={i} transform={`translate(${shift+i*105-300} 0)`}><path d="M 0 1140 q 22 -3 44 0 M 25 1173 q 20 -3 42 0 M 0 1305 q 25 -3 58 0 M 32 1346 q 25 -3 51 0" /></g>)}
      </g>
    </svg>;
  }
  return null;
};
