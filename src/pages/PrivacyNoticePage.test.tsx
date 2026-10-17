import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { PrivacyNoticePage } from './PrivacyNoticePage'

describe('PrivacyNoticePage', () => {
  it('shows the requested privacy topics and temporary contact details', () => {
    render(
      <MemoryRouter>
        <PrivacyNoticePage />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Notice' })).toBeInTheDocument()
    expect(screen.getByText('Last updated: October 17, 2026')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Who we are' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Personal information we collect' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Why we use information and lawful bases' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Sharing and service providers' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Retention and security' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Your rights under RA 10173' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Privacy contact' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'support@rallypointgensan.com' })).toHaveAttribute(
      'href',
      'mailto:support@rallypointgensan.com',
    )
    expect(screen.getByText(/temporary support contact/)).toBeInTheDocument()
  })
})
