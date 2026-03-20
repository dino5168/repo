from fastapi import APIRouter

from app.config import settings

router = APIRouter(prefix="/config", tags=["config"])


@router.get("")
async def get_config() -> dict[str, str]:
    return {"title": settings.app_title, "web_title": settings.web_title}
