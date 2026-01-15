import './globals.css';
import Providers from './providers';
import Navigation from '@/components/Navigation';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <Providers>
          <Navigation />
          <main className="max-w-7xl mx-auto px-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
