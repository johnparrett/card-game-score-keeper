import React, { useEffect, useState } from 'react'
import { Player, totals, addRound, removeRound } from './lib/scoring'
import Settings from './components/Settings'
import { useI18n } from './i18n'

const STORAGE_KEY = 'scorekeeper:v1'

function uid() {
  return Math.random().toString(36).slice(2, 9)
}

export default function App() {
  const { t } = useI18n()
  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return [
      { id: uid(), name: 'Alice', scores: [0] },
      { id: uid(), name: 'Bob', scores: [0] }
    ]
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(players))
  }, [players])

  const addPlayer = (name = 'Player') => {
    setPlayers(p => [...p, { id: uid(), name: `${name} ${p.length + 1}`, scores: Array(p[0]?.scores.length || 1).fill(0) }])
  }

  const addNewRound = () => setPlayers(p => addRound(p, 0))

  const removeRoundAt = (index: number) => setPlayers(p => removeRound(p, index))

  const removePlayer = (playerId: string) => setPlayers(p => p.filter(pl => pl.id !== playerId))

  const setScore = (playerId: string, roundIndex: number, value: number) => {
    setPlayers(p => p.map(pl => pl.id === playerId ? { ...pl, scores: pl.scores.map((s, i) => i === roundIndex ? value : s) } : pl))
  }

  const totalsArr = totals(players)

  const exportJson = () => {
    const data = JSON.stringify(players, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scorekeeper-export.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File | null) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result))
        if (Array.isArray(imported)) setPlayers(imported)
      } catch (e) {
        alert('Invalid file')
      }
    }
    reader.readAsText(file)
  }

  const resetAll = () => {
    if (!confirm('Reset all data?')) return
    setPlayers([
      { id: uid(), name: 'Alice', scores: [0] },
      { id: uid(), name: 'Bob', scores: [0] }
    ])
  }

  const [theme, setTheme] = useState<'light'|'dark'>('light')

  return (
    <div className={"container " + (theme === 'dark' ? 'theme-dark' : '')}>
      <header className="app-header">
        <h1>{t('title')}</h1>
        <Settings theme={theme} setTheme={setTheme} />
      </header>

      <section className="controls">
        <button onClick={() => addPlayer()}>{t('add_player')}</button>
        <button onClick={addNewRound}>{t('add_round')}</button>
        <button onClick={exportJson}>{t('export')}</button>
        <label className="import">
          {t('import')}
          <input type="file" accept="application/json" onChange={e => importJson(e.target.files?.[0] || null)} />
        </label>
        <button onClick={resetAll}>{t('reset')}</button>
      </section>

      <section className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>{t('player')}</th>
              {players[0]?.scores.map((_, i) => (
                <th key={i}>R{i + 1} <button className="small" onClick={() => removeRoundAt(i)}>✕</button></th>
              ))}
              <th>{t('total')}</th>
            </tr>
          </thead>
          <tbody>
            {players.map((pl, pi) => (
              <tr key={pl.id}>
                <td>
                  <input value={pl.name} onChange={e => setPlayers(ps => ps.map(pp => pp.id === pl.id ? { ...pp, name: e.target.value } : pp))} onFocus={e => e.currentTarget.select()} />
                  <button className="small" onClick={() => removePlayer(pl.id)} aria-label="Remove player">✕</button>
                </td>
                {pl.scores.map((s, ri) => (
                  <td key={ri}>
                    <input type="number" value={String(s)} onChange={e => setScore(pl.id, ri, Number(e.target.value || 0))} onFocus={e => e.currentTarget.select()} />
                  </td>
                ))}
                <td><strong>{totalsArr[pi]}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer>
        <small>{t('data_notice')}</small>
      </footer>
    </div>
  )
}
