from fastapi import APIRouter, HTTPException

from app.models.user import ApiResponse, User, UserCreate
from app.services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=ApiResponse[list[User]])
async def list_users() -> ApiResponse[list[User]]:
    users = user_service.get_all_users()
    return ApiResponse(data=users, status=200, message="OK")


@router.get("/{user_id}", response_model=ApiResponse[User])
async def get_user(user_id: int) -> ApiResponse[User]:
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ApiResponse(data=user, status=200, message="OK")


@router.post("", response_model=ApiResponse[User], status_code=201)
async def create_user(body: UserCreate) -> ApiResponse[User]:
    user = user_service.create_user(body)
    return ApiResponse(data=user, status=201, message="Created")


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int) -> None:
    if not user_service.delete_user(user_id):
        raise HTTPException(status_code=404, detail="User not found")
