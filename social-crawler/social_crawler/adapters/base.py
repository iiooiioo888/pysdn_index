from __future__ import annotations

from abc import ABC, abstractmethod

from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class BaseAdapter(ABC):
    """平台適配器統一介面：實作類負責呼叫平台 API／Playwright／CLI 並轉成 ContentItem。"""

    platform: Platform

    @abstractmethod
    async def search(self, task: CrawlTask) -> list[ContentItem]:
        """關鍵字／話題搜尋（或平台對應能力）。"""

    async def fetch_user_posts(self, task: CrawlTask) -> list[ContentItem]:
        """可選：使用者主頁時間軸（預設未實作則回傳空）。"""
        return []
