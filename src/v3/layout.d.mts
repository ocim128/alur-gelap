export type LayoutBox = {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
};

export declare const V3_CANVAS: {
  readonly width: number;
  readonly height: number;
};

export declare const V3_SERIES_HANDLE: string;

export declare function formatArchiveIdentity(archiveNumber: number): string;

export declare const V3_TANPA_NAMA: {
  readonly id: string;
  readonly displayName: string;
  readonly color: string;
  readonly avatarBg: string;
  readonly avatarFg: string;
  readonly avatarBorder: string;
  readonly signatureSfx: string;
};

export declare function isTanpaNamaCharacter(
  character?: {readonly id?: string; readonly name?: string},
  senderId?: string,
): boolean;

export declare const V3_UNPLAYED_PREPLAY_FRAMES: number;

export declare const V3_OVERLAY_FADE_FRAMES: {
  readonly maxAllowed: number;
  readonly photoZoomIn: number;
  readonly photoZoomOut: number;
  readonly cctvIn: number;
  readonly cctvOut: number;
  readonly callIn: number;
  readonly callOut: number;
  readonly evidenceIn: number;
  readonly evidenceOut: number;
  readonly notificationIn: number;
  readonly notificationOut: number;
};

export declare const V3_SAFE_ZONE: {
  readonly avoidTopRatio: number;
  readonly avoidRightRatio: number;
  readonly avoidBottomRatio: number;
  readonly minCriticalY: number;
  readonly maxX: number;
  readonly maxY: number;
};

export declare const V3_MIN_FONT_SIZE: number;

export declare const V3_FONT_SIZES: {
  readonly statusBar: number;
  readonly identityStrip: number;
  readonly archiveMetadata: number;
  readonly evidenceTag: number;
  readonly headerGroupName: number;
  readonly headerSubtitle: number;
  readonly senderName: number;
  readonly messageText: number;
  readonly messageTime: number;
  readonly photoCaption: number;
  readonly voiceSubtitle: number;
  readonly voiceDuration: number;
  readonly systemText: number;
  readonly notificationTitle: number;
  readonly notificationBody: number;
  readonly callCaller: number;
  readonly callSubtitle: number;
  readonly cctvLabel: number;
  readonly cctvTimestamp: number;
  readonly inputPlaceholder: number;
};

export declare const V3_CHROME_REGIONS: {
  readonly canvas: LayoutBox;
  readonly statusBar: LayoutBox;
  readonly chatHeader: LayoutBox;
  readonly identityStrip: LayoutBox;
  readonly threadBackdrop: LayoutBox;
  readonly inputBar: LayoutBox;
};

export declare const V3_CRITICAL_REGIONS: {
  readonly identityStripContent: LayoutBox;
  readonly chatContent: LayoutBox;
  readonly notificationBanner: LayoutBox;
  readonly photoLightboxContent: LayoutBox;
  readonly callContent: LayoutBox;
  readonly cctvContent: LayoutBox;
  readonly evidenceTagContent: LayoutBox;
};

export declare const V3_THEME: {
  readonly canvasBg: string;
  readonly phoneBg: string;
  readonly phoneBorder: string;
  readonly statusBarBg: string;
  readonly headerBg: string;
  readonly headerBorder: string;
  readonly identityStripBg: string;
  readonly identityStripText: string;
  readonly identityStripHandle: string;
  readonly threadBg: string;
  readonly incomingBubbleBg: string;
  readonly incomingBubbleBorder: string;
  readonly outgoingBubbleBg: string;
  readonly outgoingBubbleBorder: string;
  readonly systemPillBg: string;
  readonly inputBarBg: string;
  readonly textPrimary: string;
  readonly textSecondary: string;
  readonly textMuted: string;
  readonly accent: string;
  readonly warning: string;
  readonly danger: string;
};

export declare const V3_LAYOUT: {
  readonly canvas: typeof V3_CANVAS;
  readonly seriesHandle: string;
  readonly tanpaNama: typeof V3_TANPA_NAMA;
  readonly unplayedPreplayFrames: number;
  readonly overlayFadeFrames: typeof V3_OVERLAY_FADE_FRAMES;
  readonly safeZone: typeof V3_SAFE_ZONE;
  readonly minFontSize: number;
  readonly fontSizes: typeof V3_FONT_SIZES;
  readonly chromeRegions: typeof V3_CHROME_REGIONS;
  readonly criticalRegions: typeof V3_CRITICAL_REGIONS;
};
