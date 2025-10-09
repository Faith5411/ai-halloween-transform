
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const UploadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export const WandIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" /><path d="M17.8 11.8 19 13" /><path d="M15 9h.01" /><path d="M17.8 6.2 19 5" /><path d="m3 21 9-9" /><path d="M12.2 6.2 11 5" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);

export const AlertTriangleIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
    </svg>
);

// New Icons
export const SkullIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 20v2h8v-2" /><path d="M6.2 14.8a2.5 2.5 0 0 0-.2 3.2l.2.2c1.1 1.1 2.8 1.1 3.8 0" /><path d="M17.8 14.8a2.5 2.5 0 0 1 .2 3.2l-.2.2c-1.1 1.1-2.8 1.1-3.8 0" /><path d="M12 4c-4.4 0-8 3.6-8 8v0c0 4.4 3.6 8 8 8h0c4.4 0 8-3.6 8-8v0c0-4.4-3.6-8-8-8Z" /><path d="M9 12v.01" /><path d="M15 12v.01" />
    </svg>
);

export const PixelMonsterIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M8 4h8v4H8V4Z" /><path d="M12 8v4" /><path d="M10 12h4" /><path d="M8 16H4v4h4v-4Z" /><path d="M12 16v4" /><path d="M20 16h-4v4h4v-4Z" />
    </svg>
);

export const GhostIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 10h.01" /><path d="M15 10h.01" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 18l3 3V10a8 8 0 0 0-8-8z" />
    </svg>
);

export const NightmareIcon: React.FC<IconProps> = SkullIcon;

export const LightningIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M13 3v7h6l-8 11v-7H5l8-11z" />
    </svg>
);

export const RobotIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 8V4H8v4" /><path d="M16 8V4h-4" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M9 16v-2.5" /><path d="M15 16v-2.5" />
    </svg>
);

export const BrainIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v0A2.5 2.5 0 0 1 9.5 7h0A2.5 2.5 0 0 1 7 4.5v0A2.5 2.5 0 0 1 9.5 2Z" /><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v0A2.5 2.5 0 0 0 14.5 7h0A2.5 2.5 0 0 0 17 4.5v0A2.5 2.5 0 0 0 14.5 2Z" /><path d="M12 15a2.5 2.5 0 0 0 2.5-2.5v0A2.5 2.5 0 0 0 12 10h0a2.5 2.5 0 0 0-2.5 2.5v0A2.5 2.5 0 0 0 12 15Z" /><path d="M4.5 10A2.5 2.5 0 0 1 7 12.5v0A2.5 2.5 0 0 1 4.5 15h0A2.5 2.5 0 0 1 2 12.5v0A2.5 2.5 0 0 1 4.5 10Z" /><path d="M19.5 10a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0 2.5 2.5h0a2.5 2.5 0 0 0 2.5-2.5v0a2.5 2.5 0 0 0-2.5-2.5Z" /><path d="M12 22a2.5 2.5 0 0 1-2.5-2.5v0A2.5 2.5 0 0 1 12 17h0a2.5 2.5 0 0 1 2.5 2.5v0A2.5 2.5 0 0 1 12 22Z" /><path d="M19.2 17.8a2.5 2.5 0 0 0-2.2-2.2" /><path d="M4.8 17.8a2.5 2.5 0 0 1 2.2-2.2" /><path d="M4.8 6.2a2.5 2.5 0 0 1 2.2 2.2" /><path d="M19.2 6.2a2.5 2.5 0 0 0-2.2 2.2" />
    </svg>
);

export const PaletteIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <circle cx="12" cy="12" r="10" /><path d="M6 12c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z" /><path d="M15 12c0-1.7 1.3-3 3-3s3 1.3 3 3-1.3 3-3 3-3-1.3-3-3z" /><path d="M12 6c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" /><path d="M12 18c1.7 0 3 1.3 3 3s-1.3 3-3 3-3-1.3-3-3 1.3-3 3-3z" />
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const XIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
);

export const PumpkinIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M11 2h2v2h-2V2zM5.12 6.95l1.42-1.42C7.35 4.72 8.61 4 10 4h4c1.39 0 2.65.72 3.46 1.54l1.42 1.41c.97 1.15 1.46 2.58 1.46 4.05v2c0 1.47-.49 2.9-1.46 4.05l-1.42 1.41C16.65 20.28 15.39 21 14 21h-4c-1.39 0-2.65-.72-3.46-1.54l-1.42-1.41C4.15 17.1 3.66 15.67 3.66 14.2v-2c0-1.47.49-2.9 1.46-4.05zM9 15c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 .55.45 1 1 1zm6 0c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1v2c0 .55.45 1 1 1z"/>
  </svg>
);

export const FloatingGhostIcon: React.FC<IconProps> = (props) => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <path d="M16,4C9.9,4,5,8.9,5,15v10.5c0,0,0.5,1.5,2.5,1.5S10,25.5,10,25.5l1-1.5l2,1.5l2-1.5l2,1.5l2-1.5l1,1.5 c0,0,0.5,1.5,2.5,1.5s2.5-1.5,2.5-1.5V15C27,8.9,22.1,4,16,4z M12.5,15c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S13.6,15,12.5,15z M19.5,15c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S20.6,15,19.5,15z"/>
  </svg>
);
