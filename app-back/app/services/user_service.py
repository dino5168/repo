from app.models.user import User, UserCreate

# In-memory store (replace with DB later)
_users: list[User] = [
    User(id=1, name="Alice", email="alice@example.com"),
    User(id=2, name="Bob", email="bob@example.com"),
]
_next_id = 3


def get_all_users() -> list[User]:
    return _users


def get_user_by_id(user_id: int) -> User | None:
    return next((u for u in _users if u.id == user_id), None)


def create_user(data: UserCreate) -> User:
    global _next_id
    user = User(id=_next_id, name=data.name, email=data.email)
    _users.append(user)
    _next_id += 1
    return user


def delete_user(user_id: int) -> bool:
    global _users
    before = len(_users)
    _users = [u for u in _users if u.id != user_id]
    return len(_users) < before
