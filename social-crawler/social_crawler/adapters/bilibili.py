"""B 站適配器（骨架）：可對接 MediaCrawler bilibili 模組或 B 站公開 API。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class BilibiliAdapter(BaseAdapter):
    platform = Platform.BILIBILI

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("B 站：請新建擷取邏輯或包裝 MediaCrawler。")
