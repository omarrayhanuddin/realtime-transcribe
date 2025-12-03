'use client'
import React, { useRef, useState, useEffect } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Header from '../src/components/Header'
import Link from 'next/link'


const BACKEND_WS = process.env.NEXT_PUBLIC_BACKEND_WS_URL || 'ws://localhost:8000/ws/transcribe'

function floatTo16BitPCM(input) {
  const buffer = new ArrayBuffer(input.length * 2)
  const view = new DataView(buffer)
  let offset = 0
  for (let i = 0; i < input.length; i++, offset += 2) {
    let s = Math.max(-1, Math.min(1, input[i]))
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return buffer
}

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [partial, setPartial] = useState('')
  const [finalText, setFinalText] = useState('')
  const [wordCount, setWordCount] = useState(null)
  const [duration, setDuration] = useState(null)
  const wsRef = useRef(null)
  const mediaRef = useRef(null)
  const audioCtxRef = useRef(null)
  const procRef = useRef(null)

  useEffect(() => {
    return () => stopEverything()
  }, [])

  function stopEverything() {
    if (procRef.current) {
      procRef.current.disconnect()
      procRef.current.onaudioprocess = null
      procRef.current = null
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close()
      audioCtxRef.current = null
    }
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach(t => t.stop())
      mediaRef.current = null
    }
    if (wsRef.current) {
      try { wsRef.current.close() } catch (e) { }
      wsRef.current = null
    }
    setIsRecording(false)
  }

  const start = async () => {
    if (isRecording) return
    setPartial('')
    setFinalText('')
    setWordCount(null)
    setDuration(null)

    const ws = new WebSocket(BACKEND_WS)
    wsRef.current = ws

    ws.onopen = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRef.current = stream
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 })
      audioCtxRef.current = audioCtx
      const source = audioCtx.createMediaStreamSource(stream)
      const processor = audioCtx.createScriptProcessor(4096, 1, 1)
      procRef.current = processor

      processor.onaudioprocess = e => {
        const input = e.inputBuffer.getChannelData(0)
        const pcm = floatTo16BitPCM(input)
        if (ws.readyState === WebSocket.OPEN) ws.send(pcm)
      }

      source.connect(processor)
      processor.connect(audioCtx.destination)
      setIsRecording(true)
    }

    ws.onmessage = e => {
      try {
        const data = JSON.parse(e.data)
        if (data.type === 'partial') setPartial(data.text)
        if (data.type === 'final') {
          setFinalText(data.text)
          setWordCount(data.word_count)
          setDuration(data.duration_seconds)
          setIsRecording(false)
          stopEverything()
        }
      } catch (err) {
        console.error('ws parse', err)
      }
    }

    ws.onclose = () => stopEverything()
    ws.onerror = () => stopEverything()
  }

  const stop = () => {
    if (!wsRef.current) return
    try { wsRef.current.send('stop') } catch (e) { }
  }

  return (
    <>
      <Header />
      <Container sx={{ py: 6 }} maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper className="card-glass" sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Button variant="contained" onClick={start} disabled={isRecording}>{isRecording ? 'Recording…' : 'Start'}</Button>
                <Button variant="outlined" onClick={stop} disabled={!isRecording}>Stop</Button>
              </Box>

              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>Live Partial</Typography>
              <Paper className="card-glass" sx={{ p: 2, minHeight: 120 }}>{partial || <Typography sx={{ opacity: 0.6 }}>Say something — partial text will appear here...</Typography>}</Paper>

              <Typography variant="subtitle2" sx={{ mt: 3, mb: 1, color: 'text.secondary' }}>Final Transcript</Typography>
              <Paper className="card-glass" sx={{ p: 2, minHeight: 120 }}>{finalText || <Typography sx={{ opacity: 0.6 }}>Press stop to finalize transcription.</Typography>}</Paper>

              <Box sx={{ mt: 2, color: 'text.secondary' }}>
                <Typography variant="caption">Words: {wordCount ?? '-'}</Typography>
                <Typography variant="caption" sx={{ ml: 2 }}>Duration: {duration ? `${duration.toFixed(2)}s` : '-'}</Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper className="card-glass" sx={{ p: 2 }}>
              <Typography variant="h6">Tips</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>Use a quality mic, speak clearly, and avoid noisy environments.</Typography>

              <Box sx={{ mt: 3 }}>
                <Link href="/history">
                  <Button variant="contained">Open Sessions</Button>
                </Link>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}