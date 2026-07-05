import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/themes.css'
import '@/styles/reset.css'
import '@/styles/fonts.css'
import '@/styles/animations.css'
import { ClientLayout } from './ClientLayout'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Pomodoro',
  description: 'Simple Pomodoro Timer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
