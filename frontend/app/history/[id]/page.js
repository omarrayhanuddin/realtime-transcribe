'use client'
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Header from '../../../src/components/Header'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { usePathname } from 'next/navigation'
import ClientDate from '@/src/components/ClientDate'

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

export default function SessionDetail() {
  const pathname = usePathname()
  const id = pathname?.split('/')?.pop()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const res = await fetch(`${API}/sessions/${id}`)
        if (!res.ok) throw new Error('not found')
        const json = await res.json()
        setSession(json)
      } catch (e) {
        console.error(e)
      } finally { setLoading(false) }
    }
    load()
  }, [id])

  if (loading) return <div className="p-6">Loading…</div>
  if (!session) return <div className="p-6">Session not found</div>

  return (
    <>
      <Header />
      <Container sx={{ py: 6 }} maxWidth="md">
        <Paper className="card-glass" sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <div>
              <Typography variant="caption">Session #{session.id}</Typography>
              
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{<ClientDate isoString={session.created_at} />}</Typography>
            </div>
          </Box>

          <Typography variant="h6">Transcript</Typography>
          <Paper sx={{ p: 2, mt: 2 }} className="card-glass"><pre style={{ whiteSpace: 'pre-wrap' }}>{session.transcript_text || '(empty)'}</pre></Paper>

          <Box sx={{ mt: 2, color: 'text.secondary' }}>
            <Typography variant="caption">Words: {session.word_count}</Typography>
            <Typography variant="caption" sx={{ ml: 2 }}>Duration: {session.duration_seconds.toFixed(2)}s</Typography>
            <Typography variant="caption" sx={{ ml: 2 }}>Model: {session.model_name}</Typography>
          </Box>
        </Paper>
      </Container>
    </>
  )
}
