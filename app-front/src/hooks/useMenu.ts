import { useEffect, useState } from 'react'
import { fetchMenu } from '@/api/menu'
import type { MenuGroup, MenuItem } from '@/types/menu'

// 遞迴展開所有選單項目（含子項目）
export function flattenItems(items: MenuItem[]): MenuItem[] {
  return items.flatMap((item) => [
    item,
    ...(item.children ? flattenItems(item.children) : []),
  ])
}

export function useMenu() {
  const [groups, setGroups] = useState<MenuGroup[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenu()
      .then((data) => setGroups(data.groups))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const allItems = flattenItems(groups.flatMap((g) => g.items))

  return { groups, allItems, loading }
}
