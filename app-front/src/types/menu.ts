export interface MenuItem {
  key: string
  label: string
  icon: string
  path: string
  children?: MenuItem[]
}

export interface MenuGroup {
  label: string
  items: MenuItem[]
}

export interface MenuResponse {
  groups: MenuGroup[]
}
