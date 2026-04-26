import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import LoginPage from './page'
import { t } from '@shared/translations'

describe('LoginPage', () => {
  it('permite scriere email', () => {
    render(<LoginPage />)
    const input = screen.getByLabelText(t("emailLabel")) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'test@doctor.com' } })
    expect(input.value).toBe('test@doctor.com')
  })

  it('nu blocheaza tastele', () => {
    render(<LoginPage />)
    const input = screen.getByLabelText(t("emailLabel")) as HTMLInputElement
    const event = { key: 'a', preventDefault: vi.fn() }
    fireEvent.keyDown(input, event)
    expect(event.preventDefault).not.toHaveBeenCalled()
  })
})
