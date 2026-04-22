"""缺口平台（骨架）：影片號、公眾號、Threads、LinkedIn、RSS；多依半自動或通用爬取兜底。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class WechatChannelsAdapter(BaseAdapter):
    platform = Platform.WECHAT_CHANNELS

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("微信影片號：半自動／擷包方案，請自行評估合規。")


class WechatMpAdapter(BaseAdapter):
    platform = Platform.WECHAT_MP

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("微信公眾號：半自動／Cookie 維護，請自行評估合規。")


class ThreadsAdapter(BaseAdapter):
    platform = Platform.THREADS

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("Threads：成熟開源缺口大，可評估 Crawl4AI 等兜底。")


class LinkedInAdapter(BaseAdapter):
    platform = Platform.LINKEDIN

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("LinkedIn：法遵與反爬嚴格，請謹慎評估。")


class RssAdapter(BaseAdapter):
    platform = Platform.RSS

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError("RSS：請實作 feed 拉取並對應為 ContentItem。")
