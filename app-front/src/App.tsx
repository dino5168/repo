import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Sidebar } from '@/components/sidebar/Sidebar'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-400">{title}</h1>
    </div>
  )
}

function App() {
  const [webTitle, setWebTitle] = useState('')

  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then((res) => res.json())
      .then((data: { title: string; web_title: string }) => {
        document.title = data.title
        setWebTitle(data.web_title)
      })
      .catch(() => {
        // fallback: keep existing title
      })
  }, [])

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            <Route path="/" element={"home"}/>
            <Route path="/marketplace" element={<Placeholder title={webTitle} />} />
            <Route path="/orders" element={<Placeholder title={webTitle} />} />
            <Route path="/tracking" element={<Placeholder title={webTitle} />} />
            <Route path="/tracking/overview" element={<Placeholder title={webTitle} />} />
            <Route path="/tracking/history" element={<Placeholder title={webTitle} />} />
            <Route path="/customers" element={<Placeholder title={webTitle} />} />
            <Route path="/discounts" element={<Placeholder title={webTitle} />} />
            <Route path="/ledger" element={<Placeholder title={webTitle} />} />
            <Route path="/taxes" element={<Placeholder title={webTitle} />} />
            <Route path="/settings" element={<Placeholder title={webTitle} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
