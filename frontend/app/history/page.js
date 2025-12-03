'use client'
import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Header from '../../src/components/Header'
import SessionCard from '../../src/components/SessionCard'

const API = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:8000'

export default function History() {
    const [sessions, setSessions] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(API + '/sessions')
                const json = await res.json()
                setSessions(json)
            } catch (e) {
                console.error(e)
            } finally { setLoading(false) }
        }
        load()
    }, [])

    return (
        <>
            <Header />
            <Container sx={{ py: 6 }} maxWidth="lg">
                <Grid container spacing={3}>
                    {loading ? <div>Loading…</div> : (
                        sessions.length === 0 ? <div>No sessions yet.</div> : sessions.map(s => (
                            <Grid item xs={12} md={6} key={s.id}><SessionCard s={s} /></Grid>
                        ))
                    )}
                </Grid>
            </Container>
        </>
    )
}