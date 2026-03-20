import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Sidebar } from '@/components/sidebar/Sidebar'
import { useMenu } from '@/hooks/useMenu'
import Home from '@/pages/Home'
import pageRegistry from '@/pages/pageRegistry'


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
  const { groups, allItems } = useMenu()

  useEffect(() => {
    fetch(`${API_BASE}/api/config`)
      .then((res) => res.json())
      .then((data: { title: string; web_title: string }) => {
        document.title = data.title
        setWebTitle(data.web_title)
      })
      .catch(() => {})
  }, [])

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50">
        <Sidebar groups={groups} />
        <main className="flex-1 overflow-y-auto p-8">
          <Routes>
            {/* 首頁固定對應 Home 元件 */}
            <Route path="/" element={<Home />} />
            {/* 其餘路由由選單動態產生 */}
            {allItems
              .filter((item) => item.path !== '/')
              .map((item) => {
                const Page = pageRegistry[item.path]
                return (
                  <Route
                    key={item.key}
                    path={item.path}
                    element={Page ? <Page /> : <Placeholder title={webTitle} />}
                  />
                )
              })}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
