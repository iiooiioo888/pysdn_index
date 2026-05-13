/** ISO / YAML 時間字串（例如 `2025-11-13T12:28:53.768254`）轉繁中地區常見顯示格式。 */
export function formatZhDate(isoLike: string | undefined): string {
  if (!isoLike) return ''
  const t = Date.parse(isoLike)
  if (Number.isNaN(t)) return isoLike.slice(0, 19).replace('T', ' ')
  try {
    return new Intl.DateTimeFormat('zh-Hant', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(t))
  }
  catch {
    return isoLike.slice(0, 19).replace('T', ' ')
  }
}

/** 相對時間，例如「3 天前」（使用瀏覽器 `Intl.RelativeTimeFormat` zh-Hant）。 */
export function relativeZhFromIso(isoLike: string | undefined): string | null {
  if (!isoLike) return null
  const past = Date.parse(isoLike)
  if (Number.isNaN(past)) return null
  const now = Date.now()
  const diffSec = Math.round((past - now) / 1000)

  try {
    const rtf = new Intl.RelativeTimeFormat('zh-Hant', { numeric: 'auto' })
    const sign = Math.sign(diffSec)
    const sec = Math.abs(diffSec)

    let unit: Intl.RelativeTimeFormatUnit = 'second'
    let value = diffSec

    if (sec >= 31536000) {
      unit = 'year'
      value = Math.round((diffSec / 31536000) * sign) || sign * 1
    }
    else if (sec >= 86400 * 28) {
      unit = 'month'
      value = Math.round((diffSec / (86400 * 30)) * sign) || sign * 1
    }
    else if (sec >= 86400) {
      unit = 'day'
      value = Math.round((diffSec / 86400) * sign) || sign * 1
    }
    else if (sec >= 3600) {
      unit = 'hour'
      value = Math.round((diffSec / 3600) * sign) || sign * 1
    }
    else if (sec >= 60) {
      unit = 'minute'
      value = Math.round((diffSec / 60) * sign) || sign * 1
    }
    else {
      unit = 'second'
      value = diffSec === 0 ? 0 : diffSec
    }

    return rtf.format(value, unit)
  }
  catch {
    return null
  }
}
