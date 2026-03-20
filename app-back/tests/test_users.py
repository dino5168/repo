import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
async def client():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.mark.asyncio
async def test_list_users(client: AsyncClient) -> None:
    res = await client.get("/api/users")
    assert res.status_code == 200
    body = res.json()
    assert body["status"] == 200
    assert isinstance(body["data"], list)


@pytest.mark.asyncio
async def test_get_user(client: AsyncClient) -> None:
    res = await client.get("/api/users/1")
    assert res.status_code == 200
    assert res.json()["data"]["id"] == 1


@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient) -> None:
    res = await client.get("/api/users/999")
    assert res.status_code == 404


@pytest.mark.asyncio
async def test_create_user(client: AsyncClient) -> None:
    res = await client.post(
        "/api/users", json={"name": "Charlie", "email": "charlie@example.com"}
    )
    assert res.status_code == 201
    data = res.json()["data"]
    assert data["name"] == "Charlie"


@pytest.mark.asyncio
async def test_delete_user(client: AsyncClient) -> None:
    res = await client.delete("/api/users/2")
    assert res.status_code == 204
