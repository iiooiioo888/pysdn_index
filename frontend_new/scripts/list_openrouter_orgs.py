# -*- coding: utf-8 -*-
"""列出 OpenRouter API 目前所有模型 id 的 org 前綴，供與 src/data/openRouterProvider.ts 對照。"""
import json
import urllib.request

URL = "https://openrouter.ai/api/v1/models"


def main() -> None:
    with urllib.request.urlopen(URL, timeout=90) as res:
        data = json.loads(res.read().decode())
    rows = data.get("data") or []
    orgs = sorted(
        {
            (r.get("id") or "").split("/", 1)[0].strip().lower()
            for r in rows
            if r.get("id")
        }
    )
    for o in orgs:
        print(o)
    print(f"# total org prefixes: {len(orgs)}", file=__import__("sys").stderr)


if __name__ == "__main__":
    main()
