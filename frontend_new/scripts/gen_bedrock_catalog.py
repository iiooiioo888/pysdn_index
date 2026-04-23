# -*- coding: utf-8 -*-
"""從 bedrock_models_raw.json 產生 bedrockCatalog.json（請在更新 Excel 後重跑）。"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW_JSON = ROOT / "src" / "data" / "bedrock_models_raw.json"
OUT = ROOT / "src" / "data" / "bedrockCatalog.json"

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


def _parse_token_price(x) -> float | None:
    if x is None or x == "" or str(x) == "nan":
        return None
    try:
        return float(x)
    except (TypeError, ValueError):
        return None


def normalize_note(ni: str) -> str:
    """英文化／混寫備註 → 與前綴格式一致的繁中（便於全站顯示統一）。"""
    s = (ni or "").strip()
    if not s:
        return ""
    # 完整片語優先
    full = {
        "Cache read 90% off; Batch 50% off": "快取讀取 9 折、批次 5 折",
        "Gated research preview": "受控研究預覽",
        "Fastest in Claude family": "Claude 系列中速度最快",
        "Speech-to-speech; text token pricing": "語音對語音；同採文字 tokens 計價",
        "Global cross-region": "全球跨區",
        "Speech-to-text": "語音轉文字",
        "Output: 不適用 (嵌入模型)": "輸出：不適用（嵌入）",
        "Output: 不適用": "輸出：不適用",
        "US East; 推理模型溢價": "美東 · 推理加價",
        "+ $0.00006/張圖像": "圖像每張＋$0.00006",
        "未公開定價": "定價未公開",
        "按視頻時長計費": "依影片時長計費",
    }
    if s in full:
        return full[s]
    s = s.replace("US East 區域", "美東")
    s = s.replace("Sydney 區域", "雪梨")
    return s


def normalize_unit(u: str) -> str:
    t = (u or "").strip()
    m = {
        "per 1M tokens": "每百萬 tokens",
        "per 1K queries": "每千次查詢",
        "per min video": "每分鐘影片",
    }
    return m.get(t, t)


def fmt_price(inp, out, unit, note) -> str:
    u = str(unit or "").strip()
    u_low = u.lower()
    ni = str(note or "").strip()
    ni_n = normalize_note(ni)
    pin = _parse_token_price(inp)
    pout = _parse_token_price(out)

    # 僅依「計價單位＋備註」的列（無 $/1M 數字）
    if pin is None and pout is None:
        if u_low == "per 1m tokens" and "未公開" in ni:
            return "每百萬 tokens · 定價未公開"
        if u_low in ("per 1k queries",):
            m = re.search(r"\$?\s*([\d.]+)", ni)
            if m:
                return f"每千次查詢 ${m.group(1)}"
            return f"每千次查詢 · {ni_n}" if ni_n else "每千次查詢"
        if u_low in ("per min video",):
            tail = ni_n or "依影片時長計費"
            return f"每分鐘影片 · {tail}"
        if u in ("依張", "依秒") and ni:
            return ni
        if u and ni:
            return f"{normalize_unit(u)} · {ni_n}" if ni_n else f"{normalize_unit(u)}"
        return normalize_unit(u) or ni_n or ""

    # 百萬 tokens：僅輸入（嵌入等）
    if pin is not None and pout is None:
        head = f"輸入 ${pin:g}／百萬 tokens"
        if "不適用" in ni or "嵌入" in ni:
            if "嵌入" in ni:
                return f"{head} · 輸出：不適用（嵌入）"
            return f"{head} · 輸出：不適用"
        if ni:
            if ni.strip().startswith("+"):
                return f"{head} · {ni_n}"
            return f"{head} · {ni_n}"
        return head

    # 百萬 tokens：輸入＋輸出
    if pin is not None and pout is not None:
        s = f"輸入 ${pin:g}／百萬 tokens · 輸出 ${pout:g}／百萬 tokens"
        if ni:
            s += f" · {ni_n}"
        return s

    # 僅有輸出價格（理論上少見）
    if pout is not None and pin is None:
        s = f"輸出 ${pout:g}／百萬 tokens"
        if ni:
            s += f" · {ni_n}"
        return s
    return ni_n or ""


def main():
    rows = json.loads(RAW_JSON.read_text(encoding="utf-8"))
    models: list[dict] = []

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

        item: dict = {
            "id": mid,
            "product": "bedrock",
            "capability": cap,
            "developer": "aws",
            "badges": [],
            "price": price,
            "title": {
                "zh-TW": name,
                "zh-CN": name,
                "en": name,
                "ja": name,
                "ko": name,
            },
            "desc": {
                "zh-TW": desc_zhtw,
                "zh-CN": desc_zhcn,
                "en": desc_en,
                "ja": desc_ja,
                "ko": desc_ko,
            },
            "modalitiesLine": mtype,
            "providerName": prov,
        }
        if ctx:
            item["contextLength"] = int(ctx)
        models.append(item)

    OUT.write_text(json.dumps(models, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT} ({len(rows)} models)")


if __name__ == "__main__":
    main()
