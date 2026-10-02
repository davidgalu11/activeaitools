import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf9" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://activeaitools.com"),
  title: "Active AI Tools — Independent Studio by David G",
  description:
    "Active AI Tools is an independent studio by David G, building tools for short-form content creators and writing about creator marketing.",
  authors: [{ name: "David G", url: "https://activeaitools.com" }],
  creator: "David G",
  keywords: [
    "Active AI Tools",
    "David G",
    "Creafico",
    "short-form video",
    "creator tools",
    "creator marketing",
    "Munich founder",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://activeaitools.com",
    siteName: "Active AI Tools",
    title: "Active AI Tools — Independent Studio by David G",
    description:
      "Active AI Tools is an independent studio by David G, building tools for short-form content creators and writing about creator marketing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Active AI Tools — Independent Studio by David G",
    description:
      "Active AI Tools is an independent studio by David G, building tools for short-form content creators and writing about creator marketing.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-neutral-200 dark:selection:bg-neutral-800">
        {children}
      </body>
    </html>
  )
}
