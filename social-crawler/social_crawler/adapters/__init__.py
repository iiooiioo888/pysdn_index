from social_crawler.adapters.base import BaseAdapter
from social_crawler.adapters.demo import DemoAdapter
from social_crawler.adapters.registry import get_adapter, register_adapter, registered_platforms

__all__ = [
    "BaseAdapter",
    "DemoAdapter",
    "get_adapter",
    "register_adapter",
    "registered_platforms",
]
