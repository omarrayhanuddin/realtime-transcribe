'use client'
import * as React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'


const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: { default: '#070712', paper: '#0b1020' },
        primary: { main: '#6c5ce7' },
        secondary: { main: '#10b981' }
    },
    shape: { borderRadius: 12 },
    components: {
        MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } }
    }
})


export default function ThemeRegistry({ children }) {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}