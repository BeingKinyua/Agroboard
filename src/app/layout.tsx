import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agro-Deliveries Ke. BOS',
  description: 'Internal Business Operating System and enterprise command center for Agro-Deliveries Ke. fresh produce distribution operations.',
  openGraph: {
    title: 'Agro-Deliveries Ke. BOS',
    description: 'Internal Business Operating System and enterprise command center for Agro-Deliveries Ke. fresh produce distribution operations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
