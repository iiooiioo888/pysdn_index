from __future__ import annotations

from pathlib import Path

import yaml
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_YAML = """# SocialCrawler 設定（可複製為 config.yaml）
db_path: data/social_crawler.db
jsonl_path: data/export.jsonl
# 開發時與 Vite（port 3000）對齊；生產請改為實際來源
cors_origins:
  - http://localhost:3000
  - http://127.0.0.1:3000
  - http://localhost:5173
  - http://127.0.0.1:5173
max_concurrent: 4
max_retries: 3
"""


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="SC_", env_file=".env", extra="ignore")

    db_path: str = "data/social_crawler.db"
    jsonl_path: str = "data/export.jsonl"
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
        ]
    )
    max_concurrent: int = 4
    max_retries: int = 3


def write_config_template(path: str | Path = "config.yaml") -> Path:
    p = Path(path)
    if not p.exists():
        p.write_text(DEFAULT_YAML, encoding="utf-8")
    return p


def load_settings(yaml_path: str | Path | None = None) -> Settings:
    base = Settings()
    path = Path(yaml_path) if yaml_path is not None else Path("config.yaml")
    if path.exists():
        raw = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
        return Settings(**{**base.model_dump(), **raw})
    return base
