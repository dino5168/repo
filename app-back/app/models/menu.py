from pydantic import BaseModel


class MenuItem(BaseModel):
    key: str
    label: str
    icon: str
    path: str
    children: list["MenuItem"] = []


class MenuGroup(BaseModel):
    label: str
    items: list[MenuItem]


class MenuResponse(BaseModel):
    groups: list[MenuGroup]
