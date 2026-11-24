import {useCurrentFrame} from 'remotion';
import {V3_CHROME_REGIONS, V3_CRITICAL_REGIONS, V3_FONT_SIZES, V3_THEME} from '../layout.mjs';

export type ChatHeaderProps = {
  groupName: string;
  memberCount?: number;
  typingName?: string | null;
  statusText?: string;
};

export function ChatHeader({groupName, memberCount, typingName, statusText}: ChatHeaderProps) {
  const frame = useCurrentFrame();
  const dotCount = (Math.floor(frame / 10) % 3) + 1;
  const dots = '.'.repeat(dotCount);

  const initials =
    groupName
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'AR';

  const subtitle = typingName
    ? `${typingName} mengetik${dots}`
    : statusText ?? (memberCount ? `${memberCount} anggota` : 'Arsip grup');

  return (
    <div
      data-v3="chat-header"
      style={{
        height: V3_CHROME_REGIONS.chatHeader.height,
        padding: `0 ${V3_CHROME_REGIONS.chatHeader.width - V3_CRITICAL_REGIONS.chatHeaderContent.x - V3_CRITICAL_REGIONS.chatHeaderContent.width}px 0 ${V3_CRITICAL_REGIONS.chatHeaderContent.x}px`,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        backgroundColor: V3_THEME.headerBg,
        borderBottom: `2px solid ${V3_THEME.headerBorder}`,
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          backgroundColor: '#252D40',
          border: `2px solid ${V3_THEME.accent}`,
          color: V3_THEME.textPrimary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: V3_FONT_SIZES.headerSubtitle,
          fontWeight: 800,
          flexShrink: 0,
        }}
      >
        {initials}
      </div>

      <div style={{minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 4}}>
        <div
          style={{
            color: V3_THEME.textPrimary,
            fontSize: V3_FONT_SIZES.headerGroupName,
            fontWeight: 700,
            lineHeight: 1.12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {groupName}
        </div>
        <div
          style={{
            color: typingName ? V3_THEME.accent : V3_THEME.textSecondary,
            fontSize: V3_FONT_SIZES.headerSubtitle,
            fontWeight: typingName ? 600 : 400,
            lineHeight: 1.12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}
