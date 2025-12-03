'use client'
import { useEffect, useState } from 'react'

export default function ClientDate({ isoString }) {
  const [label, setLabel] = useState(isoString) // start deterministic

  useEffect(() => {
    try {
      setLabel(new Date(isoString).toLocaleString())
    } catch {
      setLabel(isoString)
    }
  }, [isoString])

  return <time dateTime={isoString}>{label}</time>
}
