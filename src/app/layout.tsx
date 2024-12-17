import type { Metadata } from 'next';
import '../../public/scss/main.scss';
import { Nunito } from 'next/font/google';
import { AppLayout } from '@/components/shared/layout';
import Provider from '@/state/provider';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const nunito = Nunito({
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  // 👇 Add variable to our object
  variable: '--font-family-nunito',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable}`}>
      <Provider>
        <body>
          <AppLayout>{children}</AppLayout>
        </body>
      </Provider>
    </html>
  );
}
