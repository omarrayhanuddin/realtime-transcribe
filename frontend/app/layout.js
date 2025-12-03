import React from 'react'
import './globals.css'
import ThemeRegistry from '../src/ThemeRegistry'


export const metadata = {
  title: 'Realtime Transcription',
  description: 'Realtime microphone transcription with FastAPI + Vosk'
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  )
}