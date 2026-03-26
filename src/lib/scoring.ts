export type Player = {
  id: string
  name: string
  scores: number[]
}

export function totals(players: Player[]) {
  return players.map(p => p.scores.reduce((s, v) => s + (isFinite(v) ? v : 0), 0))
}

export function addRound(players: Player[], defaultValue = 0) {
  return players.map(p => ({ ...p, scores: [...p.scores, defaultValue] }))
}

export function removeRound(players: Player[], roundIndex: number) {
  return players.map(p => ({ ...p, scores: p.scores.filter((_, i) => i !== roundIndex) }))
}
