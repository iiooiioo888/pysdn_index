"""YouTube 適配器（骨架）：待接 Data API v3 搜尋 + yt-dlp 詳情。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class YoutubeAdapter(BaseAdapter):
    platform = Platform.YOUTUBE

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError(
            "YouTube：請實作 API key 搜尋與 yt-dlp 擷取詳情／字幕等流程。"
        )
