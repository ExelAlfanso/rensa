import type { Metadata } from "next";
import { Forum, Figtree } from "next/font/google";
import "./globals.css";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import { LoadingProvider } from "@/hooks/useLoading";
import QueryProvider from "@/providers/QueryProvider";
import { ToastProvider } from "@/providers/ToastProvider";
import Toast from "@/components/toast/Toast";
import { NotificationProvider } from "@/providers/NotificationProvider";
import SchemaMarkup from "@/components/SchemaMarkup";

const forum = Forum({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-forum",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "700"], // ambil beberapa weight
  variable: "--font-figtree",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rensa.site";

export const metadata: Metadata = {
  title: {
    default: "Rensa - Where Every Picture Tells Its Recipe",
    template: "%s | Rensa",
  },
  description:
    "Discover photography inspiration on Rensa. Explore creative photo recipes, share your vision, and learn techniques behind stunning photos.",
  keywords: [
    "photography",
    "photo sharing",
    "photo inspiration",
    "creative photos",
    "photo community",
  ],
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rensa.site",
    title: "Rensa - Where Every Picture Tells Its Recipe",
    description:
      "Discover photography inspiration on Rensa. Explore creative photo recipes and share your vision.",
    siteName: "Rensa",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Rensa - Where Every Picture Tells Its Recipe",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@rensaphoto",
  },
  alternates: {
    canonical: "https://rensa.site",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <SchemaMarkup />
      </head>
      <body className={`antialiased ${forum.variable} ${figtree.variable}`}>
        <ToastProvider>
          <QueryProvider>
            <SessionProviderWrapper>
              <NotificationProvider>
                <LoadingProvider>{children}</LoadingProvider>
              </NotificationProvider>
            </SessionProviderWrapper>
          </QueryProvider>
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
