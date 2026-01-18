import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { SubdomainProvider } from "@/lib/subdomain-context";
import "../styles/globals.css";
import "../styles/theme-variables.css";

// Primary font with optimized configuration
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap", // Use system font while loading
  preload: true,
});

// Secondary font for headlines (optional)
const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Restaurant Menu & Ordering",
  description: "Order delicious food from your favorite restaurant",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SubdomainProvider>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </SubdomainProvider>
      </body>
    </html>
  );
}
