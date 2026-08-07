type Props = {
  className?: string;
};

export function WhatsAppGlyph({ className }: Props) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18.7 5.9 C 21.6 8.6 21.9 14.0 18.7 16.8 C 16.3 18.9 12.4 19.2 9.5 17.8 L 4.4 19.3 L 5.8 14.4 C 4.3 11.3 5.0 7.4 7.7 5.1 C 10.7 2.5 15.8 3.0 18.7 5.9 Z" />
      <path d="M9.6 8.8 C 9.4 11.4 11.0 13.7 13.6 14.6 C 14.4 14.9 15.6 14.8 15.9 14.0 C 16.1 13.5 15.9 13.0 15.4 12.8 L 14.0 12.1 C 13.6 11.9 13.2 12.0 12.8 12.3 C 12.0 11.8 11.4 11.2 10.9 10.4 C 11.2 10.0 11.3 9.6 11.1 9.2 L 10.4 7.7 C 10.2 7.3 9.7 7.1 9.3 7.3 C 8.6 7.7 8.4 8.4 9.6 8.8 Z" />
    </svg>
  );
}
