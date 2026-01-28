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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <ChatSafeWrapper />
      </body>
    </html>
  )
}
