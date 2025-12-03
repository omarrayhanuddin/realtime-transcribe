'use client'
import React from 'react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from 'next/link'
import Button from '@mui/material/Button'
import ClientDate from './ClientDate'


export default function SessionCard({ s }) {
    return (
        <Paper className="card-glass" sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>Session #{s.id}</Typography>
                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 600 }}>{s.transcript_text ? (s.transcript_text.slice(0, 140)) : '(empty)'}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>{<ClientDate isoString={s.created_at} />}</Typography>
                    <Box sx={{ mt: 1 }}>
                        <Button component={Link} href={`/history/${s.id}`} size="small" variant="contained">View</Button>

                    </Box>
                </Box>
            </Box>


            <Box sx={{ display: 'flex', gap: 2, mt: 2, color: 'text.secondary' }}>
                <Typography variant="caption">Words: {s.word_count}</Typography>
                <Typography variant="caption">Duration: {s.duration_seconds.toFixed(2)}s</Typography>
            </Box>
        </Paper>
    )
}