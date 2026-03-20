import type { ComponentType } from 'react'
import Orders from '@/pages/Orders'

// 在這裡登記 path → 元件
// 沒有登記的路徑會自動 fallback 到 Placeholder
const pageRegistry: Record<string, ComponentType> = {
  '/orders': Orders,
}

export default pageRegistry
