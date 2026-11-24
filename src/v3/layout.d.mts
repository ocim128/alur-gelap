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
  readonly fiksiTag: number;
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
  readonly threadBackdrop: LayoutBox;
  readonly inputBar: LayoutBox;
};

export declare const V3_CRITICAL_REGIONS: {
  readonly fiksiTag: LayoutBox;
  readonly chatContent: LayoutBox;
  readonly notificationBanner: LayoutBox;
  readonly photoLightboxContent: LayoutBox;
  readonly callContent: LayoutBox;
  readonly cctvContent: LayoutBox;
};

export declare const V3_THEME: {
  readonly canvasBg: string;
  readonly phoneBg: string;
  readonly phoneBorder: string;
  readonly statusBarBg: string;
  readonly headerBg: string;
  readonly headerBorder: string;
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
  readonly fiksiBg: string;
  readonly fiksiBorder: string;
  readonly fiksiText: string;
};

export declare const V3_LAYOUT: {
  readonly canvas: typeof V3_CANVAS;
  readonly safeZone: typeof V3_SAFE_ZONE;
  readonly minFontSize: number;
  readonly fontSizes: typeof V3_FONT_SIZES;
  readonly chromeRegions: typeof V3_CHROME_REGIONS;
  readonly criticalRegions: typeof V3_CRITICAL_REGIONS;
};
