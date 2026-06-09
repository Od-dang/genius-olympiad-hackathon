import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DisasterWatch — Natural Disaster Risk Monitor',
  description:
    'Real-time natural disaster risk assessment and preparedness guidance for any US location',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-slate-100 antialiased">{children}</body>
    </html>
  );
}
