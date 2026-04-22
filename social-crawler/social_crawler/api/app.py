from __future__ import annotations

import uuid
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from social_crawler.adapters.registry import registered_platforms
from social_crawler.config.settings import Settings, load_settings
from social_crawler.models.schema import CrawlStrategy, CrawlTask, Platform
from social_crawler.scheduler.scheduler import CrawlScheduler
from social_crawler.storage.jsonl_store import JsonlStore
from social_crawler.storage.sqlite_store import SQLiteStore


class CrawlRequest(BaseModel):
    platform: str = Field(description="例如 demo（示範）；其餘平台需先實作適配器")
    query: str = "test"
    priority: int = 5
    append_jsonl: bool = False


def create_app(settings: Settings | None = None) -> FastAPI:
    settings = settings or load_settings()
    store = SQLiteStore(settings.db_path)
    store.init_db()
    jsonl = JsonlStore(settings.jsonl_path)
    scheduler = CrawlScheduler(
        max_concurrent=settings.max_concurrent,
        max_retries=settings.max_retries,
    )

    app = FastAPI(
        title="SocialCrawler API",
        version="0.1.0",
        description="SuperTrack 參考後端：統一調度 + 可插拔適配器",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/api/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "social-crawler"}

    @app.get("/api/platforms")
    def platforms() -> dict[str, Any]:
        return {"platforms": registered_platforms()}

    @app.get("/api/items")
    def items(limit: int = 50) -> dict[str, Any]:
        return {"items": store.list_items(limit=min(limit, 200))}

    @app.post("/api/crawl")
    async def crawl(body: CrawlRequest) -> dict[str, Any]:
        try:
            plat = Platform(body.platform)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"未知平台: {body.platform}") from e
        task = CrawlTask(
            task_id=str(uuid.uuid4()),
            platform=plat,
            query=body.query,
            priority=body.priority,
            strategy=CrawlStrategy.HTTP_API,
        )
        result = await scheduler.run_direct(task)
        if not result.ok:
            raise HTTPException(status_code=500, detail=result.error or "crawl failed")
        store.upsert_items(result.items)
        if body.append_jsonl:
            jsonl.append(result.items)
        return {
            "task_id": task.task_id,
            "count": len(result.items),
            "items": [it.to_json_dict() for it in result.items],
        }

    return app
