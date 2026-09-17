export function QrisWordmark({ className }: { className?: string }) {
  return (
    <img
      src="/images/qris-logo.png"
      alt="QRIS — QR Code Standar Pembayaran Nasional"
      className={className}
    />
  );
}

export function GpnMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 44" className={className} aria-label="GPN" role="img">
      <path
        fill="#E31C23"
        d="M38 2c2.4 7.2.2 12.2-6.5 16.2 8.4.2 16.2 4.4 22.5 14.2-4.6-3.2-11-6.4-19.2-7.2 2.2 4.2-1.6 8.4-9.6 10.4 6.2-5.8 8.4-14.2 4.4-22.6 3.2 2.4 7.2 1.6 8.4-11z"
      />
      <text
        x="36"
        y="42"
        textAnchor="middle"
        fill="#E31C23"
        fontSize="9"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="700"
        letterSpacing="1.6"
      >
        GPN
      </text>
    </svg>
  );
}
