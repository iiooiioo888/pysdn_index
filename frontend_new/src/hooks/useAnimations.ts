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

export function useReveal() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all reveal elements
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => {
        observerRef.current?.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
  }, []);

  const observe = useCallback((el: Element | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  }, []);

  return observe;
}

export function useTypingAnimation(tiersInput: TypingTierPhrase[][]) {
  const [displayText, setDisplayText] = useState('');
  const [emoji, setEmoji] = useState('');
  const stateRef = useRef({
    tierIndex: 0,
    wordIndex: 0,
    charIndex: 0,
    isDeleting: false,
    lastTick: 0,
    pausedUntil: 0,
  });

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
    setDisplayText('')
    setEmoji('')

    if (prefersReducedMotion()) {
      const item = tiers[0][0]
      setDisplayText(item.text)
      setEmoji(item.emoji ?? '')
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
      rafId = requestAnimationFrame(tick);

      // paused period (after word completes or between words)
      if (now < s.pausedUntil) return;

      const speed = s.isDeleting ? DELETE_SPEED : TYPE_SPEED;
      if (now - s.lastTick < speed) return;
      s.lastTick = now;

      const tier = tiers[s.tierIndex % tiers.length];
      const item = tier[s.wordIndex % tier.length];
      const currentWord = item.text;

      if (!s.isDeleting) {
        s.charIndex++;
        setDisplayText(currentWord.substring(0, s.charIndex));
        setEmoji(item.emoji ?? '');
        if (s.charIndex >= currentWord.length) {
          s.pausedUntil = now + PAUSE_END;
          s.isDeleting = true;
        }
      } else {
        s.charIndex--;
        setDisplayText(currentWord.substring(0, s.charIndex));
        if (s.charIndex <= 0) {
          s.isDeleting = false;
          s.wordIndex++;
          if (s.wordIndex >= tier.length) {
            s.wordIndex = 0;
            s.tierIndex = (s.tierIndex + 1) % tiers.length;
          }
          s.pausedUntil = now + PAUSE_BETWEEN;
        }
      }
    };

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [tiersInput])

  return { displayText, emoji };
}

export function useCountUp(target: number, trigger: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    const duration = 1500;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [trigger, target]);

  return count;
}

export function useInView(options?: IntersectionObserverInit) {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, inView };
}
