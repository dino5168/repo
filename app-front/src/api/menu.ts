import type { MenuResponse } from '@/types/menu'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export async function fetchMenu(): Promise<MenuResponse> {
  const res = await fetch(`${API_BASE}/api/menu`)
  if (!res.ok) throw new Error('Failed to fetch menu')
  return res.json()
}
