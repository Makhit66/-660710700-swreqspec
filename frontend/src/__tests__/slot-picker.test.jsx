import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'

import App from '../App.jsx'
import { api } from '../api/client.js'

vi.mock('../api/client.js', () => ({
  api: {
    getSlots: vi.fn(),
  },
}))

describe('SlotPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('loads available slots for the selected package and lets the user choose a time', async () => {
    api.getSlots.mockResolvedValue({
      slots: [
        { id: 1, slot_date: '2026-09-24', start_time: '09:00', remaining: 3 },
        { id: 2, slot_date: '2026-09-24', start_time: '10:00', remaining: 1 },
      ],
    })

    render(<App />)

    expect(screen.getByText('เลือกแพ็กเกจและช่วงเวลา')).toBeTruthy()

    fireEvent.change(screen.getByLabelText('แพ็กเกจ'), { target: { value: 'basic' } })

    await waitFor(() => {
      expect(api.getSlots).toHaveBeenCalledWith({
        dateFrom: expect.any(String),
        packageCode: 'basic',
      })
    })

    expect(await screen.findByText('09:00')).toBeTruthy()
    expect(screen.getByText('ที่ว่าง: 3')).toBeTruthy()
  })
})
