import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./context/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: ReactNode }) => children,
}))

vi.mock('./context/AuthContext', () => ({
  useAuth: () => ({ user: null, loading: false }),
}))

describe('public routes', () => {
  it('renders the privacy notice without an authenticated user', () => {
    render(
      <MemoryRouter initialEntries={['/privacy']}>
        <App />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Notice' })).toBeInTheDocument()
  })
})
