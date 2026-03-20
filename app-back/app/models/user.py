from pydantic import BaseModel, EmailStr


class User(BaseModel):
    id: int
    name: str
    email: str


class UserCreate(BaseModel):
    name: str
    email: str


class ApiResponse[T](BaseModel):
    data: T
    status: int
    message: str
