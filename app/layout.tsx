import type React from "react"
import type { Metadata } from "next"
import { Montserrat, Open_Sans } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"], // Including Black (900) for headings
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  title: "AI Career Assistant - Hyper-Personalized Career Guidance",
  description:
    "Transform your career with AI-powered resume optimization, job matching, skill development, and interview preparation.",
  generator: "AI Career Assistant",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${openSans.variable} antialiased`}>
      <head>
        <style>{`
html {
  font-family: ${openSans.style.fontFamily};
  --font-heading: ${montserrat.variable};
  --font-body: ${openSans.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
