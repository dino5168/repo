# CLAUDE.md — 專案開發記錄

## 專案資訊

- **Repository**: https://github.com/dino5168/repo
- **架構**: Monorepo（app-front + app-back）
- **主分支**: master

---

## 2026-03-20 開發進度

### 專案建置

- 建立 Monorepo 結構於 `C:\repo`，包含 `app-front`、`app-back`、`Doc` 三個目錄
- 初始化 git，push 至 https://github.com/dino5168/repo
- 建立根目錄 `.gitignore`（排除 node_modules、.venv、.env、doc/）與 `.gitattributes`

---

### app-front（前端）

**技術棧：** Vite + React 18 + TypeScript + Tailwind CSS v4 + shadcn/ui + Electron

**完成項目：**
- 使用 `npm create vite@latest` 建立專案，安裝所有依賴
- 設定 `vite.config.ts`：加入 `@tailwindcss/vite` plugin、`@` 路徑別名
- 設定 `tsconfig.json` / `tsconfig.app.json`：加入 `baseUrl` 與 `paths`
- 初始化 shadcn/ui（`npx shadcn@latest init -t vite`，選 Radix + Nova）
- 安裝 `react-router-dom`，建立 BrowserRouter 路由架構

**Sidebar 元件（`src/components/sidebar/Sidebar.tsx`）：**
- 從後端 `GET /api/menu` 動態載入選單
- 支援群組分類、子選單展開/收合、Active 狀態高亮
- 收合按鈕浮動於 sidebar 右邊框（`absolute -right-3 z-50`）
- 收合動畫使用 `transition-[width]`，文字用 `max-w-0 opacity-0` 平滑過渡（無跳動）
- 支援 Dark mode toggle

**動態路由架構：**
- 建立 `src/hooks/useMenu.ts`：fetch `/api/menu`，回傳 `groups` / `allItems`
- `App.tsx` 使用 `useMenu()` 同時供 Sidebar 與 Routes 共用，Routes 動態產生
- 建立 `src/pages/pageRegistry.tsx`：路徑 → 元件對應表，未登記路徑 fallback 到 Placeholder

**後端設定整合：**
- `GET /api/config` 取得 `app_title`（設定 `document.title`）與 `web_title`（頁面顯示）
- `VITE_API_URL` 環境變數設定後端位址

---

### app-back（後端）

**技術棧：** Python 3.12 + FastAPI + uvicorn + pydantic-settings + uv

**完成項目：**
- 使用 `uv init` 建立專案，安裝 FastAPI、uvicorn、pydantic-settings
- 建立標準目錄結構：`app/api/`、`app/models/`、`app/services/`、`tests/`

**API 端點：**

| 端點 | 說明 |
|------|------|
| `GET /api/config` | 回傳 `app_title`、`web_title`（從 .env 讀取） |
| `GET /api/menu` | 讀取 `MENU_ADMIN` 指定的 JSON 檔，回傳動態選單 |
| `GET /api/users` | 取得所有用戶 |
| `GET /api/users/{id}` | 取得單一用戶 |
| `POST /api/users` | 新增用戶 |
| `DELETE /api/users/{id}` | 刪除用戶 |

**環境設定（`app/config.py` + pydantic-settings）：**

| 變數 | 說明 |
|------|------|
| `APP_TITLE` | 瀏覽器 tab 標題 |
| `WEB_TITLE` | 頁面顯示標題 |
| `ALLOW_ORIGINS` | CORS 允許來源（JSON 陣列） |
| `MENU_ADMIN` | 選單設定 JSON 檔路徑 |

**動態選單設計：**
- 選單設定獨立於程式碼，儲存於 `menu_admin.json`
- 修改 JSON 後立即生效，無需重啟後端
- 目前選單：行銷（儀表板、Marketplace、Orders、Tracking、Customers、Discounts）、付款（Ledger、Taxes）、系統（系統設定）

**測試：** 5 項 pytest 測試全部通過

---

### 文件（`Doc/`）

> `Doc/` 已加入 `.gitignore`，不進版本控制

| 檔案 | 說明 |
|------|------|
| `Doc/skills.md` | 專案建置步驟參考文件 |
| `Doc/programlist.md` | 前後端所有檔案清單與功能說明 |
| `Doc/system.html` | 系統流程與程式進入點說明（HTML 視覺化） |

---

## 常用指令

```bash
# 前端
cd app-front
npm run dev          # 啟動開發伺服器（port 5173）
npm run build        # 建置生產版本
npm run lint         # ESLint 檢查

# 後端
cd app-back
uv run uvicorn app.main:app --reload   # 啟動開發伺服器（port 8000）
uv run pytest                          # 執行測試
uv run ruff check .                    # Lint 檢查
uv run mypy app/                       # 型別檢查
```

---

## 注意事項

- `.env` 不進 git，複製 `.env.example` 後編輯
- 新增選單項目：只需修改 `app-back/menu_admin.json`
- 新增頁面元件：建立 `src/pages/NewPage.tsx`，在 `src/pages/pageRegistry.tsx` 登記路徑
- CORS 設定：修改 `app-back/.env` 的 `ALLOW_ORIGINS`
