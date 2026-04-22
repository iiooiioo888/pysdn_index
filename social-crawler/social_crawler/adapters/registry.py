from __future__ import annotations

from typing import TYPE_CHECKING, Type

from social_crawler.adapters.bilibili import BilibiliAdapter
from social_crawler.adapters.demo import DemoAdapter
from social_crawler.adapters.douyin import DouyinAdapter, TikTokAdapter
from social_crawler.adapters.instagram import InstagramAdapter
from social_crawler.adapters.international import (
    FacebookSnscrapeAdapter,
    RedditSnscrapeAdapter,
    TelegramSnscrapeAdapter,
    WeiboSnscrapeAdapter,
    XTwitterSnscrapeAdapter,
)
from social_crawler.adapters.kuaishou import KuaishouAdapter
from social_crawler.adapters.platform_gaps import (
    LinkedInAdapter,
    RssAdapter,
    ThreadsAdapter,
    WechatChannelsAdapter,
    WechatMpAdapter,
)
from social_crawler.adapters.xhs import XhsAdapter
from social_crawler.adapters.youtube import YoutubeAdapter
from social_crawler.models.schema import Platform

if TYPE_CHECKING:
    from social_crawler.adapters.base import BaseAdapter

_REGISTRY: dict[Platform, Type[BaseAdapter]] = {
    Platform.DEMO: DemoAdapter,
    Platform.XHS: XhsAdapter,
    Platform.YOUTUBE: YoutubeAdapter,
    Platform.DOUYIN: DouyinAdapter,
    Platform.TIKTOK: TikTokAdapter,
    Platform.BILIBILI: BilibiliAdapter,
    Platform.KUAISHOU: KuaishouAdapter,
    Platform.WEIBO: WeiboSnscrapeAdapter,
    Platform.WECHAT_CHANNELS: WechatChannelsAdapter,
    Platform.WECHAT_MP: WechatMpAdapter,
    Platform.INSTAGRAM: InstagramAdapter,
    Platform.X_TWITTER: XTwitterSnscrapeAdapter,
    Platform.REDDIT: RedditSnscrapeAdapter,
    Platform.TELEGRAM: TelegramSnscrapeAdapter,
    Platform.FACEBOOK: FacebookSnscrapeAdapter,
    Platform.THREADS: ThreadsAdapter,
    Platform.LINKEDIN: LinkedInAdapter,
    Platform.RSS: RssAdapter,
}


def register_adapter(platform: Platform, cls: Type[BaseAdapter]) -> None:
    _REGISTRY[platform] = cls


def get_adapter(platform: Platform) -> BaseAdapter:
    if platform not in _REGISTRY:
        raise KeyError(f"尚未註冊適配器：{platform.value}")
    return _REGISTRY[platform]()


def registered_platforms() -> list[str]:
    return sorted(p.value for p in _REGISTRY)
