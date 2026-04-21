import { useRevealPageScan } from '../hooks/useAnimations'

/** 在根層掛載一次：統一掃描 .reveal，避免各區塊重複 observe / 多個 IntersectionObserver */
export function RevealScanBridge() {
  useRevealPageScan()
  return null
}
