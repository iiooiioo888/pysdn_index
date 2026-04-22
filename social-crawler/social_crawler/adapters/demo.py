"""示範適配器：不需外網，驗證管線與儲存。"""

from __future__ import annotations

import uuid

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import Author, ContentItem, ContentType, CrawlTask, Platform


class DemoAdapter(BaseAdapter):
    platform = Platform.DEMO

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        sid = str(uuid.uuid4())[:8]
        return [
            ContentItem(
                platform=Platform.DEMO,
                content_type=ContentType.POST,
                source_id=f"demo-{sid}",
                title=f"示範內容：{task.query}",
                text="此筆資料由 DemoAdapter 產生，用於測試調度器、SQLite 與 API。",
                url=f"https://example.invalid/demo/{sid}",
                author=Author(handle="demo_bot", display_name="Demo Bot"),
                raw={"task_id": task.task_id, "query": task.query},
            )
        ]
