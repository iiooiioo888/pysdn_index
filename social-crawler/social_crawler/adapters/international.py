"""snscrape 系通用適配器（骨架）：X／Reddit／Telegram／Facebook／微博等，待接 CLI 或 Python API。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class XTwitterSnscrapeAdapter(BaseAdapter):
    platform = Platform.X_TWITTER

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("X (Twitter)：請接 snscrape 並對應至 ContentItem。")


class RedditSnscrapeAdapter(BaseAdapter):
    platform = Platform.REDDIT

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("Reddit：請接 snscrape 並對應至 ContentItem。")


class TelegramSnscrapeAdapter(BaseAdapter):
    platform = Platform.TELEGRAM

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("Telegram 公開頻道：請接 snscrape 或 Telethon。")


class FacebookSnscrapeAdapter(BaseAdapter):
    platform = Platform.FACEBOOK

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("Facebook：僅公開內容；請接 snscrape 並注意 ToS。")


class WeiboSnscrapeAdapter(BaseAdapter):
    platform = Platform.WEIBO

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("微博：請接 snscrape 使用者主頁等。")
