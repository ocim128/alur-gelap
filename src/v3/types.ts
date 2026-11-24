/** Outgoing read-receipt states (allowed only on messages sent by app.selfId). */
export type MessageTicks = 'sent' | 'delivered' | 'read';

export type ZoomSpec = {
  /** Normalized focal X inside the image (0..1). */
  x: number;
  /** Normalized focal Y inside the image (0..1). */
  y: number;
  /** Target zoom scale (> 1). */
  scale: number;
  /** Frame offset from the parent event's `at` frame. */
  atOffset: number;
  /** Duration of the expanded zoom hold in frames. Defaults to 90. */
  durationFrames?: number;
};

export type CharacterV3 = {
  id: string;
  name: string;
  color: string;
  voice?: string;
  lastSeen?: string;
};

export type TextEventV3 = {
  id: string;
  at: number;
  type: 'text';
  from: string;
  text: string;
  typingFrames?: number;
  timeLabel?: string;
  anomaly?: boolean;
  ticks?: MessageTicks;
  edited?: boolean;
  deletedAt?: number;
};

export type PhotoEventV3 = {
  id: string;
  at: number;
  type: 'photo';
  from: string;
  src: string;
  caption?: string;
  typingFrames?: number;
  timeLabel?: string;
  anomaly?: boolean;
  ticks?: MessageTicks;
  zoom?: ZoomSpec;
};

export type VoiceEventV3 = {
  id: string;
  at: number;
  type: 'voice';
  from: string;
  src: string;
  subtitle: string;
  typingFrames?: number;
  timeLabel?: string;
  anomaly?: boolean;
  /** Outgoing receipt only (when from === app.selfId). */
  ticks?: MessageTicks;
  /** Incoming unplayed voice-note indicator (distinct from read receipts). */
  unplayed?: boolean;
};

export type SystemEventV3 = {
  id: string;
  at: number;
  type: 'system';
  text: string;
};

export type NotificationEventV3 = {
  id: string;
  at: number;
  type: 'notification';
  durationFrames: number;
  appName?: string;
  title: string;
  body: string;
};

export type CallEventV3 = {
  id: string;
  at: number;
  type: 'call';
  durationFrames: number;
  caller: string;
  status: 'incoming' | 'missed' | 'ended';
  subtitle?: string;
};

export type CctvEventV3 = {
  id: string;
  at: number;
  type: 'cctv';
  durationFrames: number;
  src: string;
  cameraLabel: string;
  timestampLabel: string;
  /** True when viewing a recorded CCTV clip (renders visible PLAYBACK badge; timestamp may precede live phone clock). */
  playback?: boolean;
  anomaly?: boolean;
  zoom?: ZoomSpec;
};

/** Factual evidence-label card (e.g. "ditemukan: portal barat · 05.12") before final Tanpa Nama artifact. */
export type EvidenceEventV3 = {
  id: string;
  at: number;
  type: 'evidence';
  durationFrames: number;
  text: string;
};

export type ChatEventV3 =
  | TextEventV3
  | PhotoEventV3
  | VoiceEventV3
  | SystemEventV3
  | NotificationEventV3
  | CallEventV3
  | CctvEventV3
  | EvidenceEventV3;

export type GlitchSpecV3 = {
  at: number;
  durationFrames: number;
  intensity?: number;
};

export type ClueLedgerEntryV3 = {
  clue: string;
  plantedIn: string;
  paidOffIn: string;
  note?: string;
};

export type SilenceDropSpecV3 = {
  startFrame: number;
  endFrame: number;
  reason?: string;
};

export type TensionLayerSpecV3 = {
  src: string;
  startFrame: number;
  endFrame: number;
  startGain?: number;
  peakGain?: number;
};

export type ChatScriptV3 = {
  pipelineVersion: 3;
  /** Public archive sequence number (e.g. 1 -> "ARSIP #001 · @skenarium"). */
  archiveNumber: number;
  /** Optional factual evidence metadata (max 2 lines total including any `evidence` event). */
  archiveMetadata?: {
    /** Short factual line inside the identity strip area, e.g. "HP milik: Bayu". */
    stripLine?: string;
  };
  id: string;
  compositionId?: string;
  fps: number;
  durationInFrames: number;
  app: {
    name?: string;
    groupName: string;
    memberCount?: number;
    theme?: 'dark';
    selfId?: string;
    statusText?: string;
  };
  startClock: string;
  startBattery?: number;
  endBattery?: number;
  characters: CharacterV3[];
  audio?: {
    ambience?: {src: string; gain?: number};
    tension?: TensionLayerSpecV3;
    silenceDrops?: SilenceDropSpecV3[];
    uiSfx?: {
      messageIn?: string;
      messageOut?: string;
      typing?: string;
      notification?: string;
    };
  };
  /** Optional map of event ID or asset src -> one-line literal still description for automated strict cold-read export. */
  stillDescriptions?: Record<string, string>;
  events: ChatEventV3[];
  glitches?: GlitchSpecV3[];
  clueLedger: ClueLedgerEntryV3[];
};
