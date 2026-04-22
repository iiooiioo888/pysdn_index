"""小紅書適配器（骨架）：簽名、搜尋、詳情、使用者、評論待接 xhshow／Spider_XHS 等。"""

from __future__ import annotations

from social_crawler.adapters.base import BaseAdapter
from social_crawler.models.schema import ContentItem, CrawlTask, Platform


class XhsAdapter(BaseAdapter):
    platform = Platform.XHS

    async def search(self, task: CrawlTask) -> list[ContentItem]:
        raise NotImplementedError(
            "XHS：請實作簽名（如 xhshow）、Cookie 與搜尋／詳情／評論 HTTP 流程。"
        )
