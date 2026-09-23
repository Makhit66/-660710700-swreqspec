import SlotPicker from './pages/SlotPicker.jsx'

// รองรับ: FR-BKG-01, FR-BKG-06
export default function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-5">
          <h1 className="text-2xl font-bold text-teal-800">ระบบจองคิวตรวจสุขภาพ</h1>
        </div>
      </header>
      <SlotPicker />
    </div>
  )
}
