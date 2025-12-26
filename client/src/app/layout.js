import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navigation from '@/components/Navigation';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">
        <AuthProvider>
          <Navigation />
          <main className="max-w-7xl mx-auto px-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
