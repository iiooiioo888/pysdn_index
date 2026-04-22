# -*- coding: utf-8 -*-
"""從 bedrock_models_raw.json 產生 bedrockCatalog.ts（請在更新 Excel 後重跑）。"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_JSON = ROOT / "src" / "data" / "bedrock_models_raw.json"
OUT = ROOT / "src" / "data" / "bedrockCatalog.ts"

TYPE_EN = {
    "圖像生成": "Image generation",
    "圖像編輯": "Image editing",
    "多模態": "Multimodal",
    "安全護欄": "Safety guardrails",
    "嵌入": "Embeddings",
    "推理": "Inference",
    "文本生成": "Text generation",
    "編碼": "Code",
    "視頻嵌入": "Video embeddings",
    "視頻理解": "Video understanding",
    "視頻生成": "Video generation",
    "語音": "Speech",
    "語音轉文本": "Speech-to-text",
    "重排": "Rerank",
}

CAP = {
    "圖像生成": "image",
    "圖像編輯": "image",
    "多模態": "multimodal",
    "安全護欄": "text",
    "嵌入": "text",
    "推理": "text",
    "文本生成": "text",
    "編碼": "text",
    "視頻嵌入": "video",
    "視頻理解": "video",
    "視頻生成": "video",
    "語音": "audio",
    "語音轉文本": "audio",
    "重排": "text",
}


def slug(s: str) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "-", s.strip().lower()).strip("-")
    return s or "model"


def parse_ctx(raw) -> str | None:
    if raw is None:
        return None
    s = str(raw).strip()
    if s in ("—", "–", "-", "", "nan"):
        return None
    s = s.upper().replace(",", "")
    m = re.match(r"^([\d.]+)\s*M$", s)
    if m:
        return str(int(float(m.group(1)) * 1_000_000))
    m = re.match(r"^([\d.]+)\s*K$", s)
    if m:
        return str(int(float(m.group(1)) * 1000))
    m = re.match(r"^(\d+)$", s)
    if m:
        return m.group(1)
    return None


def fmt_price(inp, out, unit, note) -> str:
    u = str(unit or "").strip()
    ni = str(note or "").strip()
    parts = []
    if inp != "" and inp is not None and str(inp) != "nan":
        try:
            v = float(inp)
            parts.append(f"In: ${v:g}/M tok")
        except (TypeError, ValueError):
            pass
    if out != "" and out is not None and str(out) != "nan":
        try:
            v = float(out)
            parts.append(f"Out: ${v:g}/M tok")
        except (TypeError, ValueError):
            pass
    if parts:
        s = " · ".join(parts)
        if u and "per 1M" not in s.lower():
            s += f" ({u})"
        if ni:
            s += f" · {ni}"
        return s
    if u:
        base = u
        if ni:
            base += f" · {ni}"
        return base
    return ni or ""


def main():
    rows = json.loads(RAW_JSON.read_text(encoding="utf-8"))
    lines = [
        "/**",
        " * AWS Bedrock 模型目錄 — 由 `scripts/gen_bedrock_catalog.py` 自 `bedrock_models_raw.json` 產生。",
        " * 更新 Excel 後請重跑：",
        " *   python scripts/gen_bedrock_catalog.py",
        " */",
        "",
        "import type { CatalogModel } from './modelsCatalog'",
        "",
        "export const BEDROCK_MODELS: CatalogModel[] = [",
    ]

    seen: set[str] = set()
    for r in rows:
        prov = str(r["供應商\n(Provider)"]).strip()
        name = str(r["模型名稱\n(Model)"]).strip()
        mtype = str(r["模型類型"]).strip()
        feat = str(r["主要特點 / 用途"]).strip()
        ctx_raw = r["上下文窗口"]
        inp = r["輸入價格\n($/1M tokens)"]
        out = r["輸出價格\n($/1M tokens)"]
        unit = r["計價單位"]
        note = r["備註"]

        mid = f"br--{slug(prov)}--{slug(name)}"
        if mid in seen:
            i = 2
            while f"{mid}-{i}" in seen:
                i += 1
            mid = f"{mid}-{i}"
        seen.add(mid)

        cap = CAP.get(mtype, "text")
        type_en = TYPE_EN.get(mtype, mtype)
        ctx = parse_ctx(ctx_raw)
        price = fmt_price(inp, out, unit, note)

        desc_zhtw = f"AWS Bedrock（{prov}）｜{mtype}｜{feat}"
        desc_zhcn = desc_zhtw  # 表內為繁中為主；簡中先同條避免缺字
        desc_en = f"{prov} on AWS Bedrock — {type_en}. {feat}"
        desc_ja = f"AWS Bedrock（{prov}）— {type_en}. {feat}"
        desc_ko = f"AWS Bedrock({prov}) — {type_en}. {feat}"

        def j(s: str) -> str:
            return json.dumps(s, ensure_ascii=False)

        lines.append("  {")
        lines.append(f"    id: {j(mid)},")
        lines.append("    product: 'bedrock',")
        lines.append(f"    capability: '{cap}',")
        lines.append("    developer: 'aws',")
        lines.append("    badges: [],")
        lines.append(f"    price: {j(price)},")
        lines.append("    title: {")
        lines.append(f"      'zh-TW': {j(name)},")
        lines.append(f"      'zh-CN': {j(name)},")
        lines.append(f"      en: {j(name)},")
        lines.append(f"      ja: {j(name)},")
        lines.append(f"      ko: {j(name)},")
        lines.append("    },")
        lines.append("    desc: {")
        lines.append(f"      'zh-TW': {j(desc_zhtw)},")
        lines.append(f"      'zh-CN': {j(desc_zhcn)},")
        lines.append(f"      en: {j(desc_en)},")
        lines.append(f"      ja: {j(desc_ja)},")
        lines.append(f"      ko: {j(desc_ko)},")
        lines.append("    },")
        if ctx:
            lines.append(f"    contextLength: {ctx},")
        lines.append(f"    modalitiesLine: {j(mtype)},")
        lines.append("  },")

    lines.append("]")
    lines.append("")
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT} ({len(rows)} models)")


if __name__ == "__main__":
    main()
