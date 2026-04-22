from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Any

from social_crawler.models.schema import ContentItem


class SQLiteStore:
    """SQLite：content_items 去重以 (platform, source_id) 為鍵；實作 ContentStore 介面。"""

    def __init__(self, path: str | Path) -> None:
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def _conn(self) -> sqlite3.Connection:
        return sqlite3.connect(self.path)

    def init_db(self) -> None:
        with self._conn() as cx:
            cx.execute(
                """
                CREATE TABLE IF NOT EXISTS content_items (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    platform TEXT NOT NULL,
                    source_id TEXT NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL DEFAULT (datetime('now')),
                    UNIQUE(platform, source_id)
                )
                """
            )
            cx.execute(
                """
                CREATE TABLE IF NOT EXISTS crawl_tasks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    task_id TEXT NOT NULL UNIQUE,
                    platform TEXT NOT NULL,
                    query TEXT NOT NULL,
                    status TEXT NOT NULL,
                    error TEXT,
                    created_at TEXT NOT NULL DEFAULT (datetime('now'))
                )
                """
            )

    def upsert_items(self, items: list[ContentItem]) -> int:
        with self._conn() as cx:
            for it in items:
                payload = json.dumps(it.to_json_dict(), ensure_ascii=False)
                cx.execute(
                    """
                    INSERT INTO content_items (platform, source_id, payload)
                    VALUES (?, ?, ?)
                    ON CONFLICT(platform, source_id) DO UPDATE SET payload = excluded.payload
                    """,
                    (it.platform.value, it.source_id, payload),
                )
        return len(items)

    def list_items(self, limit: int = 50) -> list[dict[str, Any]]:
        with self._conn() as cx:
            cx.row_factory = sqlite3.Row
            rows = cx.execute(
                "SELECT platform, source_id, payload, created_at FROM content_items ORDER BY id DESC LIMIT ?",
                (limit,),
            ).fetchall()
        return [dict(r) for r in rows]
