import type { Metadata } from 'next'
import '.globals.css'

export const metadata: Metadata = {
  title : 'Neo-Tetris',
  description : 'A Neomorphic design for the classic Tetris Game',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}