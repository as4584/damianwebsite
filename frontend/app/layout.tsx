import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ChatSafeWrapper } from '@/chatbot'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Innovation Business Development Solutions | National Business Infrastructure',
  description: 'National business infrastructure firm. Formation, licensing, digital systems, AI tools, and compliance — coordinated as one integrated platform across all 50 states.',
  keywords: 'business infrastructure, business formation, custom websites, business applications, AI tools, email infrastructure, business compliance, complete business systems',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0, viewport-fit=cover" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatSafeWrapper />
      </body>
    </html>
  )
}
