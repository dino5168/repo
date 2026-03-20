# Monorepo — app-front + app-back

全端專案，前端使用 React + Vite，後端使用 FastAPI + uv。

## 專案結構

```
repo/
├── app-front/   # React + TypeScript + Tailwind v4 + shadcn/ui + Electron
└── app-back/    # FastAPI + uv + pydantic-settings
```

---

## 前置需求

| 工具 | 版本 |
|------|------|
| Node.js | >= 20 LTS |
| npm | >= 9 |
| Python | >= 3.12 |
| uv | >= 0.5 |
| Git | >= 2.x |

---

## 快速開始

### 1. Clone 專案

```bash
git clone https://github.com/dino5168/repo.git
cd repo
```

### 2. 安裝前端依賴

```bash
cd app-front
npm install
```

### 3. 安裝後端依賴

```bash
cd app-back
uv sync
```

### 4. 設定後端環境變數

```bash
cp app-back/.env.example app-back/.env
# 編輯 app-back/.env 設定所需的值
```

---

## 啟動開發伺服器

### 前端（port 5173）

```bash
cd app-front
npm run dev
```

### 後端（port 8000）

```bash
cd app-back
uv run uvicorn app.main:app --reload
```

---

## app-front

Vite + React + TypeScript 前端應用程式。

**技術棧：**
- React 18 + TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui
- Zustand
- Electron

**常用指令：**

```bash
npm run dev        # 啟動開發伺服器
npm run build      # 建置生產版本
npm run lint       # ESLint 檢查
```

**環境變數（`app-front/.env`）：**

建立 `app-front/.env`（不進 git）：

```env
VITE_API_URL=http://localhost:8000
```

| 變數 | 預設值 | 必填 | 說明 |
|------|--------|:----:|------|
| `VITE_API_URL` | `http://localhost:8000` | | 後端 API 位址，Vite 開發伺服器使用 |

> **注意：** Vite 只會將 `VITE_` 開頭的變數注入至瀏覽器端，請勿將機密資訊放入此處。

---

## app-back

FastAPI 後端 API。

**技術棧：**
- Python 3.12
- FastAPI
- uvicorn
- pydantic-settings
- uv

**API 端點：**

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/config` | 取得應用程式設定（title） |
| GET | `/api/users` | 取得所有用戶 |
| GET | `/api/users/{id}` | 取得單一用戶 |
| POST | `/api/users` | 新增用戶 |
| DELETE | `/api/users/{id}` | 刪除用戶 |

Swagger UI：`http://localhost:8000/docs`

**常用指令：**

```bash
uv run uvicorn app.main:app --reload   # 啟動開發伺服器
uv run pytest                          # 執行測試
uv run ruff check .                    # Lint 檢查
uv run mypy app/                       # 型別檢查
```

**環境變數（`app-back/.env`）：**

複製範本後編輯：

```bash
cp app-back/.env.example app-back/.env
```

```env
APP_TITLE=app-front
ALLOW_ORIGINS=["http://localhost:5173","http://localhost:5174"]
```

| 變數 | 預設值 | 必填 | 說明 |
|------|--------|:----:|------|
| `APP_TITLE` | `app-front` | | 前端網頁的 `<title>` 標題，由 `/api/config` 回傳 |
| `ALLOW_ORIGINS` | `["http://localhost:5173"]` | ✓ | CORS 允許的來源清單（JSON 陣列格式），多個來源以逗號分隔 |

> **注意：** `.env` 已加入 `.gitignore`，請勿提交至版本控制。正式環境部署時請依實際 domain 調整 `ALLOW_ORIGINS`。
