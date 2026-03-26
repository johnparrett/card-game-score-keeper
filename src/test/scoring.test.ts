/// <reference types="vitest" />
import { describe, it, expect } from 'vitest'
import { Player, totals, addRound, removeRound } from '../lib/scoring'

function makePlayers(...scores: number[][]): Player[] {
  return scores.map((s, i) => ({ id: String(i), name: `P${i}`, scores: s }))
}

describe('totals', () => {
  it('sums each player score array', () => {
    const players = makePlayers([10, 20, 30], [5, -5, 0])
    expect(totals(players)).toEqual([60, 0])
  })

  it('returns 0 for empty scores', () => {
    const players = makePlayers([], [])
    expect(totals(players)).toEqual([0, 0])
  })

  it('ignores non-finite values', () => {
    const players = makePlayers([NaN, 10, Infinity])
    expect(totals(players)).toEqual([10])
  })
})

describe('addRound', () => {
  it('appends a default-value round to every player', () => {
    const players = makePlayers([1], [2])
    const result = addRound(players, 0)
    expect(result[0].scores).toEqual([1, 0])
    expect(result[1].scores).toEqual([2, 0])
  })

  it('does not mutate the original array', () => {
    const players = makePlayers([1])
    const result = addRound(players, 0)
    expect(players[0].scores).toEqual([1])
    expect(result[0].scores).toEqual([1, 0])
  })
})

describe('removeRound', () => {
  it('removes round at the given index from every player', () => {
    const players = makePlayers([10, 20, 30], [5, 15, 25])
    const result = removeRound(players, 1)
    expect(result[0].scores).toEqual([10, 30])
    expect(result[1].scores).toEqual([5, 25])
  })

  it('does not mutate the original array', () => {
    const players = makePlayers([10, 20])
    const result = removeRound(players, 0)
    expect(players[0].scores).toEqual([10, 20])
    expect(result[0].scores).toEqual([20])
  })
})
