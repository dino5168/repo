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

// ── Menu Item ──────────────────────────────────────────────────
function SidebarItem({
  item,
  collapsed,
  depth = 0,
}: {
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

  if (collapsed) {
    return (
      <li>
        <NavLink
          to={item.path}
          title={item.label}
          className={cn(
            'flex items-center justify-center rounded-lg p-2 transition-colors',
            isActive || isParentActive ? activeClass : baseClass
          )}
        >
          <DynamicIcon name={item.icon} size={18} />
        </NavLink>
      </li>
    )
  }

  return (
    <li>
      {hasChildren ? (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              isParentActive ? activeClass : baseClass,
              depth > 0 && 'pl-8'
            )}
          >
            <DynamicIcon name={item.icon} size={18} />
            <span className="flex-1 text-left">{item.label}</span>
            <DynamicIcon
              name="ChevronDown"
              size={14}
              className={cn('transition-transform', open && 'rotate-180')}
            />
          </button>
          {open && (
            <ul className="mt-1 space-y-1">
              {item.children!.map((child) => (
                <SidebarItem key={child.key} item={child} collapsed={false} depth={depth + 1} />
              ))}
            </ul>
          )}
        </>
      ) : (
        <NavLink
          to={item.path}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
            isActive ? activeClass : baseClass,
            depth > 0 && 'pl-8'
          )}
        >
          <DynamicIcon name={item.icon} size={18} />
          <span>{item.label}</span>
        </NavLink>
      )}
    </li>
  )
}

// ── Menu Group ─────────────────────────────────────────────────
function SidebarGroup({ group, collapsed }: { group: MenuGroup; collapsed: boolean }) {
  return (
    <div className="mb-4">
      {collapsed ? (
        <p className="mb-1 text-center text-[11px] font-bold text-gray-400">
          {group.label.charAt(0)}
        </p>
      ) : (
        <p className="mb-1 px-3 text-[11px] font-semibold tracking-wider text-gray-400">
          {group.label}
        </p>
      )}
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
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1a7a5e]">
          <DynamicIcon name="Leaf" size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="whitespace-nowrap text-lg font-semibold text-gray-800">十方資源科技</span>
        )}
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
          title="Settings"
          className={({ isActive }) =>
            cn(
              'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
              collapsed ? 'justify-center' : 'gap-3',
              isActive
                ? 'bg-[#e8f5f0] font-medium text-[#1a7a5e]'
                : 'text-gray-600 hover:bg-gray-100'
            )
          }
        >
          <DynamicIcon name="Settings" size={18} />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        <div
          className={cn(
            'flex items-center rounded-lg px-3 py-2',
            collapsed ? 'justify-center' : 'gap-3'
          )}
        >
          <DynamicIcon name="Moon" size={18} className="text-gray-600 shrink-0" />
          {!collapsed && (
            <>
              <span className="flex-1 text-sm text-gray-600">Dark mode</span>
              <button
                onClick={() => setDarkMode((v) => !v)}
                className={cn(
                  'relative h-5 w-9 rounded-full transition-colors',
                  darkMode ? 'bg-[#1a7a5e]' : 'bg-gray-300'
                )}
              >
                <span
                  className={cn(
                    'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform',
                    darkMode ? 'translate-x-4' : 'translate-x-0.5'
                  )}
                />
              </button>
            </>
          )}
        </div>
      </div>

      {/* User */}
      <div className="border-t border-gray-200 px-3 py-4">
        {collapsed ? (
          <div className="flex flex-col items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center">
              <DynamicIcon name="User" size={18} className="text-gray-600" />
            </div>
            <button title="Log out" className="text-gray-500 hover:text-gray-800 transition-colors">
              <DynamicIcon name="LogOut" size={16} />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-gray-300 shrink-0 flex items-center justify-center">
                <DynamicIcon name="User" size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">Harper Nelson</p>
                <p className="text-xs text-gray-500">Admin Manager</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
              <DynamicIcon name="LogOut" size={16} />
              Log out
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
