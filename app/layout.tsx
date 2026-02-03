import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ChatSafeWrapper } from '@/chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Innovation Business Development Solutions | Complete Business Infrastructure',
  description: 'National business infrastructure firm providing formation, websites, custom applications, AI tools, email systems, and compliance — all coordinated as one system.',
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
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatSafeWrapper />
      </body>
    </html>
  )
}
