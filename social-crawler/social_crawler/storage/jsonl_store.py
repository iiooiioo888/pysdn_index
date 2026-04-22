from __future__ import annotations

import json
from pathlib import Path

from social_crawler.models.schema import ContentItem


class JsonlStore:
    """追加寫入 JSON Lines，便於匯出與離線分析（非完整 ContentStore）。"""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def init_db(self) -> None:
        """與 ContentStore 簽名相容；JSONL 無需建表。"""
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def append(self, items: list[ContentItem]) -> None:
        with self.path.open("a", encoding="utf-8") as f:
            for it in items:
                f.write(json.dumps(it.to_json_dict(), ensure_ascii=False) + "\n")
