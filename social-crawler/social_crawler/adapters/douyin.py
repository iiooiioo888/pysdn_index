"""抖音／TikTok 適配器（骨架）：待填 X-Bogus 或呼叫 Douyin_TikTok_Download_API。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class DouyinAdapter(BaseAdapter):
    platform = Platform.DOUYIN

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError(
            "抖音：請實作 crawl_*（X-Bogus／官方或第三方 API）。資料對應欄位可沿用 ContentItem。"
        )


class TikTokAdapter(BaseAdapter):
    platform = Platform.TIKTOK

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError(
            "TikTok：與抖音類似，調整端點與簽名參數後實作 search／fetch。"
        )
