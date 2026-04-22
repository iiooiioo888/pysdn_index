"""Instagram 適配器（骨架）：待封裝 instaloader。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class InstagramAdapter(BaseAdapter):
    platform = Platform.INSTAGRAM

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("Instagram：請封裝 instaloader（profile／hashtag 等）。")
