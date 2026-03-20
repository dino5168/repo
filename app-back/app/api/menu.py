import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.config import settings
from app.models.menu import MenuResponse

router = APIRouter(prefix="/menu", tags=["menu"])


def _load_menu() -> MenuResponse:
    path = Path(settings.menu_admin)
    if not path.is_file():
        raise HTTPException(status_code=500, detail=f"Menu file not found: {path}")
    data = json.loads(path.read_text(encoding="utf-8"))
    return MenuResponse.model_validate(data)


@router.get("", response_model=MenuResponse)
async def get_menu() -> MenuResponse:
    return _load_menu()
