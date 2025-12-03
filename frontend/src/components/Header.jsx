'use client'
import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Link from 'next/link'


export default function Header() {
    return (
        <AppBar position="static" elevation={2} sx={{ bgcolor: 'transparent', backdropFilter: 'blur(6px)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Typography variant="h6">Realtime Transcription</Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>CPU-only · Vosk</Typography>
                </Box>


                <Box>
                    <Button component={Link} href="/" variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.06)' }}>
                        Home
                    </Button>
                    <Button component={Link} href="/history" variant="outlined" size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.06)' }}>
                        Sessions
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    )
}