"""快手適配器（骨架）：可對接 MediaCrawler kuaishou 模組或自研 HTTP。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class KuaishouAdapter(BaseAdapter):
    platform = Platform.KUAISHOU

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("快手：請新建擷取邏輯或包裝 MediaCrawler。")
