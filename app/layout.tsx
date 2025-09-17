import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Header from "./components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QRing Pro",
  description: "Control de accesos y gestión de visitantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0, background: "#f4f6fa", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
        <Header />
        <main style={{
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          // marginTop: 64, // <-- Quitá este margen, ya lo da el padding-top del body en globals.css
          marginBottom: 0,
          position: "relative",
          zIndex: 10,
          paddingBottom: 60,
          background: "#f4f6fa",
          overflowY: "auto"
        }}>
          <div style={{ width: "100%", maxWidth: 440, minHeight: "calc(100vh - 124px)", marginTop: 0 }}>{children}</div>
        </main>
        {typeof window !== 'undefined' && window.location.pathname !== '/' && <NavBar />}
      </body>
    </html>
  );
}
