"""CLI：init / crawl / list / serve"""

from __future__ import annotations

import argparse
import asyncio
import json
import sys
import uuid
from pathlib import Path

from social_crawler.config.settings import load_settings, write_config_template
from social_crawler.models.schema import CrawlStrategy, CrawlTask, Platform
from social_crawler.scheduler.scheduler import CrawlScheduler
from social_crawler.storage.jsonl_store import JsonlStore
from social_crawler.storage.sqlite_store import SQLiteStore


def _cmd_init(_: argparse.Namespace) -> int:
    write_config_template("config.yaml")
    settings = load_settings("config.yaml")
    Path("data").mkdir(parents=True, exist_ok=True)
    store = SQLiteStore(settings.db_path)
    store.init_db()
    print("OK: config.yaml (if new), data/, SQLite tables ready.")
    return 0


def _cmd_list(args: argparse.Namespace) -> int:
    settings = load_settings(args.config)
    store = SQLiteStore(settings.db_path)
    store.init_db()
    rows = store.list_items(args.limit)
    print(json.dumps(rows, ensure_ascii=False, indent=2))
    return 0


async def _run_crawl(args: argparse.Namespace) -> int:
    settings = load_settings(args.config)
    store = SQLiteStore(settings.db_path)
    store.init_db()
    scheduler = CrawlScheduler(
        max_concurrent=settings.max_concurrent,
        max_retries=settings.max_retries,
    )
    try:
        plat = Platform(args.platform)
    except ValueError:
        print(f"未知平台: {args.platform}", file=sys.stderr)
        return 2
    task = CrawlTask(
        task_id=str(uuid.uuid4()),
        platform=plat,
        query=args.query,
        priority=args.priority,
        strategy=CrawlStrategy.HTTP_API,
    )
    result = await scheduler.run_direct(task)
    if not result.ok:
        print(result.error or "失敗", file=sys.stderr)
        return 1
    store.upsert_items(result.items)
    if args.jsonl:
        JsonlStore(settings.jsonl_path).append(result.items)
    print(json.dumps([it.to_json_dict() for it in result.items], ensure_ascii=False, indent=2))
    return 0


def _cmd_crawl(args: argparse.Namespace) -> int:
    return asyncio.run(_run_crawl(args))


def _cmd_serve(args: argparse.Namespace) -> int:
    import uvicorn

    from social_crawler.api.app import create_app

    settings = load_settings(args.config)
    app = create_app(settings)
    uvicorn.run(app, host=args.host, port=args.port, log_level="info")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(prog="social-crawler", description="SocialCrawler 後端 CLI")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p_init = sub.add_parser("init", help="產生 config.yaml 範本並初始化 SQLite")
    p_init.set_defaults(func=_cmd_init)

    p_crawl = sub.add_parser("crawl", help="執行單次擷取（需已註冊適配器）")
    p_crawl.add_argument("--config", default="config.yaml", help="YAML 設定路徑")
    p_crawl.add_argument("--platform", default="demo", help="平台代碼，預設 demo")
    p_crawl.add_argument("--query", default="hello", help="搜尋關鍵字／示範參數")
    p_crawl.add_argument("--priority", type=int, default=5)
    p_crawl.add_argument("--jsonl", action="store_true", help="另寫入 export jsonl")
    p_crawl.set_defaults(func=_cmd_crawl)

    p_list = sub.add_parser("list", help="列出 SQLite 中最近內容")
    p_list.add_argument("--config", default="config.yaml")
    p_list.add_argument("--limit", type=int, default=20)
    p_list.set_defaults(func=_cmd_list)

    p_serve = sub.add_parser("serve", help="啟動 FastAPI（預設 :8000，對齊前端 Vite /api 代理）")
    p_serve.add_argument("--config", default="config.yaml")
    p_serve.add_argument("--host", default="127.0.0.1")
    p_serve.add_argument("--port", type=int, default=8000)
    p_serve.set_defaults(func=_cmd_serve)

    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
