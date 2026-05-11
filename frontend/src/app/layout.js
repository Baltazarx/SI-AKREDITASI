import './globals.css';
import { ThemeProvider } from '../context/ThemeContext';

export const metadata = {
  title: "Panel Akreditasi STIKOM PGRI Banyuwangi",
  description: "Sistem Akreditasi - STIKOM PGRI Banyuwangi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
