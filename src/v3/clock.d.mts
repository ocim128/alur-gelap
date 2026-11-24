export declare function parseInWorldClock(value: string): {seconds: number; hasSeconds: boolean} | null;
export declare function phoneSecondsAtFrame(startClock: string, frame: number, fps: number): number;
export declare function formatStatusClock(secondsOfDay: number): string;
export declare function formatHmsClock(secondsOfDay: number): string;
export declare function isEventClockConsistent(
  startClock: string,
  frame: number,
  fps: number,
  eventClockLabel: string,
): {ok: boolean; invalidFormat: boolean; deltaSec: number; phoneClock: string};
