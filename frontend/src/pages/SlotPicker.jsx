import { useEffect, useState } from 'react'

import { api } from '../api/client.js'

// รองรับ: FR-BKG-01, FR-BKG-06
const PACKAGE_OPTIONS = [
  { value: 'basic', label: 'แพ็กเกจทั่วไป' },
  { value: 'standard', label: 'แพ็กเกจมาตรฐาน' },
  { value: 'premium', label: 'แพ็กเกจพรีเมียม' },
]

function formatDateLabel(dateText) {
  if (!dateText) return 'วันนี้'

  const date = new Date(`${dateText}T00:00:00`)
  return new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export default function SlotPicker() {
  const [packageCode, setPackageCode] = useState('basic')
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedSlotId, setSelectedSlotId] = useState(null)

  useEffect(() => {
    let isMounted = true

    async function loadSlots() {
      setLoading(true)
      try {
        const dateFrom = new Date().toISOString().slice(0, 10)
        const response = await api.getSlots({ dateFrom, packageCode })

        if (!isMounted) {
          return
        }

        const nextSlots = response?.slots ?? []
        setSlots(nextSlots)
        setSelectedSlotId((current) =>
          nextSlots.some((slot) => slot.id === current) ? current : nextSlots[0]?.id ?? null,
        )
      } catch (error) {
        if (isMounted) {
          setSlots([])
          setSelectedSlotId(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadSlots()

    return () => {
      isMounted = false
    }
  }, [packageCode])

  return (
    <main className="mx-auto max-w-3xl p-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-teal-800">เลือกแพ็กเกจและช่วงเวลา</h1>
        <p className="mt-2 text-sm text-slate-600">
          เลือกแพ็กเกจเพื่อดูช่วงเวลาว่างภายใน 30 วันข้างหน้า
        </p>

        <div className="mt-6">
          <label htmlFor="package-select" className="mb-2 block text-sm font-medium text-slate-700">
            แพ็กเกจ
          </label>
          <select
            id="package-select"
            aria-label="แพ็กเกจ"
            value={packageCode}
            onChange={(event) => setPackageCode(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-base text-slate-800 focus:border-teal-500 focus:outline-none"
          >
            {PACKAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold text-slate-800">ช่วงเวลาว่าง</h2>

          {loading ? (
            <p className="mt-3 text-sm text-slate-500">กำลังโหลดช่วงเวลา...</p>
          ) : slots.length === 0 ? (
            <p className="mt-3 text-sm text-amber-700">ไม่มีช่วงเวลาว่างสำหรับแพ็กเกจนี้</p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {slots.map((slot) => {
                const isSelected = selectedSlotId === slot.id

                return (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedSlotId(slot.id)}
                    className={[
                      'rounded-xl border p-4 text-left transition',
                      isSelected
                        ? 'border-teal-600 bg-teal-50 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-teal-50/40',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xl font-bold text-slate-800">{slot.start_time}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                        ที่ว่าง: {slot.remaining}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{formatDateLabel(slot.slot_date)}</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
