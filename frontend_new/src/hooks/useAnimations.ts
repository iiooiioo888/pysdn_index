import { useEffect, useRef, useState, useCallback } from 'react'
import { prefersReducedMotion } from '../lib/motionPreference'

export type TypingTierPhrase = { text: string; emoji: string }

/** zh-TW 預設，供 i18n 尚未載入或結構異常時後備 */
export const DEFAULT_TYPING_TIERS: TypingTierPhrase[][] = [
  [
    { text: '可愛值跟質感都在線', emoji: 'ฅ^•ﻌ•^ฅ' },
    { text: '第一眼就超有記憶點', emoji: '(｡•̀ᴗ-)✧' },
    { text: '今天靈感，今天上線', emoji: 'ଘ(੭ˊ꒳ˋ)੭✧' },
  ],
  [
    { text: '今天也要帥氣出片', emoji: '(ง •̀_•́)ง' },
    { text: '這波直接封神', emoji: '(๑•̀ㅂ•́)و✧' },
    { text: '這支一上線直接刷屏', emoji: '(☞ﾟヮﾟ)☞' },
  ],
  [
    { text: '變成可投放的完整素材', emoji: '( •̀ ω •́ )✧' },
    { text: '氛圍感先到，轉換率跟上', emoji: '(•̀ᴗ•́)و ̑̑' },
    { text: '作品直接拿去當門面', emoji: '(๑˃̵ᴗ˂̵)و' },
  ],
]

function normalizeTypingTiers(tiers: TypingTierPhrase[][] | undefined): TypingTierPhrase[][] {
  if (!tiers?.length) return DEFAULT_TYPING_TIERS
  const ok = tiers.every(
    (tier) =>
      tier.length > 0 && tier.every((p) => typeof p?.text === 'string' && p.text.length > 0)
  )
  return ok ? tiers : DEFAULT_TYPING_TIERS
}

/** 全站共用一個 IntersectionObserver，避免多處 useReveal 各自 disconnect / 重複 observe */
let revealObserverSingleton: IntersectionObserver | null = null

function getRevealObserver(): IntersectionObserver {
  if (typeof window === 'undefined') {
    throw new Error('reveal observer is client-only')
  }
  if (!revealObserverSingleton) {
    revealObserverSingleton = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            revealObserverSingleton?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    )
  }
  return revealObserverSingleton
}

export function observeRevealElement(el: Element | null) {
  if (!el) return
  try {
    getRevealObserver().observe(el)
  } catch {
    // ignore
  }
}

/** 掃描容器內尚未顯示的 .reveal 並註冊觀察（懶載入／切換分頁後呼叫） */
export function scanRevealElements(root: ParentNode = document) {
  root.querySelectorAll('.reveal:not(.visible)').forEach((el) => observeRevealElement(el))
}

/**
 * 仍回傳 observe 函式供少數手動註冊使用；不再在 hook 內做全域 querySelectorAll，
 * 避免與頁面級掃描重複 observe。
 */
export function useReveal() {
  return useCallback((el: Element | null) => observeRevealElement(el), [])
}

/**
 * 在 App 根層掛載一次：初次掃描 + 延遲補掃（配合 lazy）+ 監聽 #root 子樹變化。
 */
export function useRevealPageScan() {
  useEffect(() => {
    const scan = () => scanRevealElements(document)
    scan()
    const t1 = window.setTimeout(scan, 120)
    const t2 = window.setTimeout(scan, 520)
    const root = document.getElementById('root')
    let moRaf = 0
    const mo =
      root &&
      new MutationObserver(() => {
        if (moRaf) return
        moRaf = requestAnimationFrame(() => {
          moRaf = 0
          scan()
        })
      })
    if (root && mo) {
      mo.observe(root, { childList: true, subtree: true })
    }
    return () => {
      window.clearTimeout(t1)
      window.clearTimeout(t2)
      if (moRaf) cancelAnimationFrame(moRaf)
      mo?.disconnect()
    }
  }, [])
}

export function useTypingAnimation(tiersInput: TypingTierPhrase[][]) {
  const textRef = useRef<HTMLSpanElement>(null)
  const emojiRef = useRef<HTMLSpanElement>(null)
  const stateRef = useRef({
    tierIndex: 0,
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    lastTick: 0,
    pausedUntil: 0,
  })

  useEffect(() => {
    const tiers = normalizeTypingTiers(tiersInput)

    stateRef.current = {
      tierIndex: 0,
      wordIndex: 0,
      charIndex: 0,
      isDeleting: false,
      lastTick: 0,
      pausedUntil: 0,
    }
    if (textRef.current) textRef.current.textContent = ''
    if (emojiRef.current) emojiRef.current.textContent = ''

    if (prefersReducedMotion()) {
      const item = tiers[0][0]
      if (textRef.current) textRef.current.textContent = item.text
      if (emojiRef.current) emojiRef.current.textContent = item.emoji ?? ''
      return
    }

    const TYPE_SPEED = 58
    const DELETE_SPEED = 34
    const PAUSE_END = 1200
    const PAUSE_BETWEEN = 320

    let rafId: number
    const s = stateRef.current
    s.lastTick = performance.now() + 900

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick)

      if (now < s.pausedUntil) return

      const speed = s.isDeleting ? DELETE_SPEED : TYPE_SPEED
      if (now - s.lastTick < speed) return
      s.lastTick = now

      const tier = tiers[s.tierIndex % tiers.length]
      const item = tier[s.wordIndex % tier.length]
      const currentWord = item.text
      const em = item.emoji ?? ''

      if (!s.isDeleting) {
        s.charIndex++
        const slice = currentWord.substring(0, s.charIndex)
        if (textRef.current) textRef.current.textContent = slice
        if (emojiRef.current) emojiRef.current.textContent = em
        if (s.charIndex >= currentWord.length) {
          s.pausedUntil = now + PAUSE_END
          s.isDeleting = true
        }
      } else {
        s.charIndex--
        const slice = currentWord.substring(0, s.charIndex)
        if (textRef.current) textRef.current.textContent = slice
        if (emojiRef.current) emojiRef.current.textContent = em
        if (s.charIndex <= 0) {
          s.isDeleting = false
          s.wordIndex++
          if (s.wordIndex >= tier.length) {
            s.wordIndex = 0
            s.tierIndex = (s.tierIndex + 1) % tiers.length
          }
          s.pausedUntil = now + PAUSE_BETWEEN
        }
      }
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [tiersInput])

  return { textRef, emojiRef }
}

export function useCountUp(target: number, trigger: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!trigger) return
    if (prefersReducedMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCount(target)
      return
    }
    const duration = 1500
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(target * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [trigger, target])

  return count
}


export function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      queueMicrotask(() => setInView(true))
      return
    }

    const merged: IntersectionObserverInit = { threshold: 0.1, ...options }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      merged,
    )

    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- options stabilized by caller (HOME_LAZY_IO)
  }, [])

  return { ref, inView }
}
