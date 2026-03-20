import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import * as icons from 'lucide-react'
import type { LucideProps } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fetchMenu } from '@/api/menu'
import type { MenuGroup, MenuItem } from '@/types/menu'

// ── Icon resolver ──────────────────────────────────────────────
type IconName = keyof typeof icons

function DynamicIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name as IconName] as React.FC<LucideProps> | undefined
  if (!Icon) return null
  return <Icon {...props} />
}

// 文字元素：收合時 opacity+寬度漸變，展開時延遲淡入
function Label({ collapsed, className, children }: {
  collapsed: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <span
      className={cn(
        'overflow-hidden whitespace-nowrap transition-all duration-300',
        collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100 delay-150',
        className
      )}
    >
      {children}
    </span>
  )
}

// ── Menu Item ──────────────────────────────────────────────────
function SidebarItem({ item, collapsed, depth = 0 }: {
  item: MenuItem
  collapsed: boolean
  depth?: number
}) {
  const location = useLocation()
  const hasChildren = item.children && item.children.length > 0
  const isActive = location.pathname === item.path
  const isParentActive = hasChildren && item.children!.some((c) => location.pathname === c.path)
  const [open, setOpen] = useState(isParentActive)

  const activeClass = 'bg-[#e8f5f0] font-medium text-[#1a7a5e]'
  const baseClass = 'text-gray-600 hover:bg-gray-100'

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={() => !collapsed && setOpen((v) => !v)}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isParentActive ? activeClass : baseClass,
              depth > 0 && !collapsed && 'pl-8'
            )}
          >
            <DynamicIcon name={item.icon} size={18} className="shrink-0" />
            <Label collapsed={collapsed} className="flex-1 text-left">{item.label}</Label>
            <span className={cn(
              'shrink-0 transition-all duration-300',
              collapsed ? 'max-w-0 opacity-0 overflow-hidden' : 'max-w-xs opacity-100 delay-150'
            )}>
              <DynamicIcon
                name="ChevronDown"
                size={14}
                className={cn('transition-transform', open && 'rotate-180')}
              />
            </span>
          </button>
          {open && !collapsed && (
            <ul className="mt-1 space-y-1">
              {item.children!.map((child) => (
                <SidebarItem key={child.key} item={child} collapsed={collapsed} depth={depth + 1} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <NavLink
          to={item.path}
          title={collapsed ? item.label : undefined}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
            isActive ? activeClass : baseClass,
            depth > 0 && !collapsed && 'pl-8'
          )}
        >
          <DynamicIcon name={item.icon} size={18} className="shrink-0" />
          <Label collapsed={collapsed}>{item.label}</Label>
        </NavLink>
      )}
    </li>
  )
}

// ── Menu Group ─────────────────────────────────────────────────
function SidebarGroup({ group, collapsed }: { group: MenuGroup; collapsed: boolean }) {
  return (
    <div className="mb-4">
      <div className="relative mb-1 h-4">
        {/* 收合：群組首字母 */}
        <p className={cn(
          'absolute inset-0 flex items-center justify-center text-[11px] font-bold text-gray-400 transition-all duration-300',
          collapsed ? 'opacity-100 delay-150' : 'opacity-0'
        )}>
          {group.label.charAt(0)}
        </p>
        {/* 展開：完整標籤 */}
        <p className={cn(
          'absolute inset-0 flex items-center px-3 text-[11px] font-semibold tracking-wider text-gray-400 transition-all duration-300',
          collapsed ? 'opacity-0' : 'opacity-100 delay-150'
        )}>
          {group.label}
        </p>
      </div>
      <ul className="space-y-1">
        {group.items.map((item) => (
          <SidebarItem key={item.key} item={item} collapsed={collapsed} />
        ))}
      </ul>
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────
export function Sidebar() {
  const [groups, setGroups] = useState<MenuGroup[]>([])
  const [darkMode, setDarkMode] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    fetchMenu()
      .then((data) => setGroups(data.groups))
      .catch(() => {})
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <aside
      className={cn(
        'relative flex h-screen flex-shrink-0 flex-col border-r border-gray-200 bg-white transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* 浮動收合按鈕 */}
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="absolute top-6 -right-3 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm hover:bg-gray-100 transition-colors"
      >
        <DynamicIcon name={collapsed ? 'ChevronRight' : 'ChevronLeft'} size={13} />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a7a5e]">
          <DynamicIcon name="Leaf" size={16} className="text-white" />
        </div>
        <Label collapsed={collapsed} className="text-lg font-semibold text-gray-800">
          十方資源科技
        </Label>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-2 py-2">
        {groups.map((group) => (
          <SidebarGroup key={group.label} group={group} collapsed={collapsed} />
        ))}
      </nav>

      {/* System */}
      <div className="border-t border-gray-200 px-2 py-3 space-y-1">
        <NavLink
          to="/settings"
          title={collapsed ? 'Settings' : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isActive ? 'bg-[#e8f5f0] font-medium text-[#1a7a5e]' : 'text-gray-600 hover:bg-gray-100'
            )
          }
        >
          <DynamicIcon name="Settings" size={18} className="shrink-0" />
          <Label collapsed={collapsed}>Settings</Label>
        </NavLink>

        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <DynamicIcon name="Moon" size={18} className="text-gray-600 shrink-0" />
          <Label collapsed={collapsed} className="flex-1 text-sm text-gray-600">Dark mode</Label>
          <span className={cn(
            'shrink-0 transition-all duration-300 overflow-hidden',
            collapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100 delay-150'
          )}>
            <button
              onClick={() => setDarkMode((v) => !v)}
              className={cn(
                'relative h-5 w-9 rounded-full transition-colors',
                darkMode ? 'bg-[#1a7a5e]' : 'bg-gray-300'
              )}
            >
              <span className={cn(
                'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                darkMode ? 'translate-x-4' : 'translate-x-0.5'
              )} />
            </button>
          </span>
        </div>
      </div>

      {/* User */}
      <div className="border-t border-gray-200 px-3 py-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-gray-300 flex items-center justify-center">
            <DynamicIcon name="User" size={18} className="text-gray-600" />
          </div>
          <Label collapsed={collapsed} className="flex-col">
            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">Harper Nelson</p>
            <p className="text-xs text-gray-500 whitespace-nowrap">Admin Manager</p>
          </Label>
        </div>
        <button
          title={collapsed ? 'Log out' : undefined}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <DynamicIcon name="LogOut" size={16} className="shrink-0" />
          <Label collapsed={collapsed}>Log out</Label>
        </button>
      </div>
    </aside>
  )
}
