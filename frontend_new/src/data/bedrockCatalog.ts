/**
 * AWS Bedrock 模型目錄 — 由 `scripts/gen_bedrock_catalog.py` 自 `bedrock_models_raw.json` 產生至 `bedrockCatalog.json`。
 * 更新來源表後請重跑：`python scripts/gen_bedrock_catalog.py`
 */

import type { CatalogModel } from './modelsCatalog'
import bedrockCatalogJson from './bedrockCatalog.json'

export const BEDROCK_MODELS: CatalogModel[] = bedrockCatalogJson as CatalogModel[]
