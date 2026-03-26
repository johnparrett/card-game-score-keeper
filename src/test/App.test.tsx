/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import App from '../App'
import { I18nProvider } from '../i18n'

function renderApp() {
  return render(
    <I18nProvider>
      <App />
    </I18nProvider>
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('App rendering', () => {
  it('renders the title', () => {
    renderApp()
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders default players with name inputs', () => {
    renderApp()
    const rows = screen.getAllByRole('row')
    // header + 2 data rows
    expect(rows.length).toBeGreaterThanOrEqual(3)
  })

  it('renders control buttons', () => {
    renderApp()
    expect(screen.getByText(/add player/i)).toBeInTheDocument()
    expect(screen.getByText(/add round/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /export/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
  })

  it('shows totals column', () => {
    renderApp()
    expect(screen.getByText(/total/i)).toBeInTheDocument()
  })
})

describe('App interactions', () => {
  it('adds a player when "Add player" is clicked', async () => {
    const user = userEvent.setup()
    renderApp()
    const rowsBefore = screen.getAllByRole('row').length
    await user.click(screen.getByText(/add player/i))
    const rowsAfter = screen.getAllByRole('row').length
    expect(rowsAfter).toBe(rowsBefore + 1)
  })

  it('adds a round column when "Add round" is clicked', async () => {
    const user = userEvent.setup()
    renderApp()
    const headerCells = within(screen.getAllByRole('row')[0]).getAllByRole('columnheader')
    const colsBefore = headerCells.length
    await user.click(screen.getByText(/add round/i))
    const headerCellsAfter = within(screen.getAllByRole('row')[0]).getAllByRole('columnheader')
    expect(headerCellsAfter.length).toBe(colsBefore + 1)
  })

  it('updates score when a number input is changed', async () => {
    const user = userEvent.setup()
    renderApp()
    const numberInputs = screen.getAllByRole('spinbutton')
    await user.clear(numberInputs[0])
    await user.type(numberInputs[0], '42')
    expect(numberInputs[0]).toHaveValue(42)
  })

  it('persists data to localStorage', async () => {
    const user = userEvent.setup()
    renderApp()
    const numberInputs = screen.getAllByRole('spinbutton')
    await user.clear(numberInputs[0])
    await user.type(numberInputs[0], '99')
    const stored = localStorage.getItem('scorekeeper:v1')
    expect(stored).toBeTruthy()
    expect(stored).toContain('99')
  })
})
