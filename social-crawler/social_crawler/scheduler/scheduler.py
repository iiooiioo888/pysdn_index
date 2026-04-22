from __future__ import annotations

import asyncio
import heapq
import time
from dataclasses import dataclass, field

from social_crawler.adapters.registry import get_adapter
from social_crawler.models.schema import CrawlResult, CrawlTask, Platform


@dataclass(order=True)
class _Queued:
    neg_priority: int
    seq: int
    task: CrawlTask = field(compare=False)


class TokenBucket:
    """簡易令牌桶：每平台獨立限速時可各持有一個實例。"""

    def __init__(self, rate_per_sec: float, capacity: float) -> None:
        self.rate = rate_per_sec
        self.capacity = capacity
        self.tokens = capacity
        self._last = time.monotonic()
        self._lock = asyncio.Lock()

    async def acquire(self, cost: float = 1.0) -> None:
        async with self._lock:
            while True:
                now = time.monotonic()
                elapsed = now - self._last
                self._last = now
                self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
                if self.tokens >= cost:
                    self.tokens -= cost
                    return
                wait = (cost - self.tokens) / self.rate if self.rate > 0 else 0.1
                await asyncio.sleep(wait)


class CrawlScheduler:
    """優先級佇列 + 並行上限 + 每平台令牌桶；run_direct 含失敗重試（指數退避）。"""

    def __init__(self, max_concurrent: int = 4, max_retries: int = 3) -> None:
        self._sem = asyncio.Semaphore(max_concurrent)
        self._queue: list[_Queued] = []
        self._seq = 0
        self._lock = asyncio.Lock()
        self._buckets: dict[str, TokenBucket] = {}
        self._max_retries = max(1, max_retries)

    def bucket_for(self, platform: Platform, rate: float = 2.0, capacity: float = 5.0) -> TokenBucket:
        key = platform.value
        if key not in self._buckets:
            self._buckets[key] = TokenBucket(rate, capacity)
        return self._buckets[key]

    async def submit(self, task: CrawlTask) -> None:
        async with self._lock:
            self._seq += 1
            heapq.heappush(self._queue, _Queued(-task.priority, self._seq, task))

    async def _pop(self) -> CrawlTask | None:
        async with self._lock:
            if not self._queue:
                return None
            return heapq.heappop(self._queue).task

    async def run_direct(self, task: CrawlTask) -> CrawlResult:
        """執行單一任務（CLI / API 共用）；可重試暫時性失敗。"""
        async with self._sem:
            bucket = self.bucket_for(task.platform)
            await bucket.acquire(1.0)
            adapter = get_adapter(task.platform)
            delay = 1.0
            last_err: str | None = None
            for attempt in range(self._max_retries):
                try:
                    items = await adapter.search(task)
                    return CrawlResult(task=task, ok=True, items=items)
                except NotImplementedError as e:
                    return CrawlResult(task=task, ok=False, items=[], error=str(e))
                except Exception as e:  # noqa: BLE001
                    last_err = str(e)
                    if attempt < self._max_retries - 1:
                        await asyncio.sleep(delay)
                        delay = min(delay * 2.0, 60.0)
            return CrawlResult(task=task, ok=False, items=[], error=last_err)

    async def run_one(self) -> CrawlResult | None:
        task = await self._pop()
        if task is None:
            return None
        return await self.run_direct(task)
