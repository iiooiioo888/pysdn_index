"""
統一資料模型（DTO／儲存與 API 共用序列化）。

設計目標
--------
- **Platform**：17 個業務平台列舉 + `demo`（管線測試）+ `unknown`（無法辨識時）。
- **ContentType**：帖文／影片／圖片／限時／評論／檔案／直播等，便於跨平台對齊。
- **CrawlStrategy**：標示預期擷取手段（HTTP、Playwright、CLI 包裝、混合），供調度器與監控使用。
- **ContentItem**：單一內容快照；`source_id` + `platform` 作為去重鍵；`raw` 保留平台原始片段。
- **Author / Engagement / MediaItem**：結構化子物件，避免各 adapter 欄位命名不一致。
- **CrawlTask**：調度單元（優先級、query、extra 參數）。
- **CrawlResult**：一次任務產出；`cursor` 預留斷點續爬（P1）。

與 SuperTrack 文件 §10.0、§10.5 對齊；實際欄位以程式碼與遷移腳本為準。
"""

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from enum import Enum
from typing import Any


class Platform(str, Enum):
    """平台列舉（17 個業務平台 + demo／unknown；與適配器註冊對齊）。"""

    # 示範／測試
    DEMO = "demo"
    # 大中華與短影音
    XHS = "xhs"
    DOUYIN = "douyin"
    TIKTOK = "tiktok"
    KUAISHOU = "kuaishou"
    BILIBILI = "bilibili"
    WEIBO = "weibo"
    WECHAT_CHANNELS = "wechat_channels"  # 影片號（多為半自動）
    WECHAT_MP = "wechat_mp"  # 公眾號（多為半自動）
    # 國際
    YOUTUBE = "youtube"
    INSTAGRAM = "instagram"
    X_TWITTER = "x_twitter"
    REDDIT = "reddit"
    TELEGRAM = "telegram"
    FACEBOOK = "facebook"
    THREADS = "threads"
    LINKEDIN = "linkedin"
    RSS = "rss"
    UNKNOWN = "unknown"


class ContentType(str, Enum):
    POST = "post"
    VIDEO = "video"
    IMAGE = "image"
    STORY = "story"
    COMMENT = "comment"
    PROFILE = "profile"
    LIVE = "live"
    OTHER = "other"


class CrawlStrategy(str, Enum):
    HTTP_API = "http_api"
    PLAYWRIGHT = "playwright"
    CLI_WRAPPER = "cli_wrapper"
    HYBRID = "hybrid"


@dataclass
class Author:
    platform_user_id: str | None = None
    handle: str | None = None
    display_name: str | None = None
    profile_url: str | None = None


@dataclass
class Engagement:
    likes: int | None = None
    comments: int | None = None
    shares: int | None = None
    views: int | None = None
    bookmarks: int | None = None


@dataclass
class MediaItem:
    url: str
    kind: str = "image"  # image | video | audio
    width: int | None = None
    height: int | None = None


@dataclass
class ContentItem:
    """核心內容單元（統一 Schema）。"""

    platform: Platform
    content_type: ContentType
    source_id: str
    title: str | None = None
    text: str | None = None
    url: str | None = None
    author: Author | None = None
    engagement: Engagement | None = None
    media: list[MediaItem] = field(default_factory=list)
    published_at: datetime | None = None
    raw: dict[str, Any] = field(default_factory=dict)
    fetched_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def to_json_dict(self) -> dict[str, Any]:
        d = asdict(self)
        d["platform"] = self.platform.value
        d["content_type"] = self.content_type.value
        if self.published_at:
            d["published_at"] = self.published_at.isoformat()
        d["fetched_at"] = self.fetched_at.isoformat()
        return d


@dataclass
class CrawlTask:
    task_id: str
    platform: Platform
    query: str
    priority: int = 5
    strategy: CrawlStrategy = CrawlStrategy.HTTP_API
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass
class CrawlResult:
    task: CrawlTask
    ok: bool
    items: list[ContentItem] = field(default_factory=list)
    error: str | None = None
    cursor: str | None = None
