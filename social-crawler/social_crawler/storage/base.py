"""可抽換儲存抽象：SQLite 為主要內容庫；JSONL 為匯出／追加。"""

from __future__ import annotations

from typing import Any, Protocol, runtime_checkable

from social_crawler.models.schema import ContentItem


@runtime_checkable
class ContentStore(Protocol):
    """主儲存介面：建表、寫入／去重、列表查詢。"""

    def init_db(self) -> None: ...

    def upsert_items(self, items: list[ContentItem]) -> int: ...

    def list_items(self, limit: int = 50) -> list[dict[str, Any]]: ...
