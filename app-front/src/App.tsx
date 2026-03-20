import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

function App() {
  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then((res) => res.json())
      .then((data: { title: string }) => {
        document.title = data.title
      })
      .catch(() => {
        // fallback: keep existing title
      })
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Button>Hello shadcn!</Button>
    </div>
  )
}

export default App
