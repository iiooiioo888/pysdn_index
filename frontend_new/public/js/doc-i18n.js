/**
 * Static doc pages: language from ?lang= (zh-TW | zh-CN | en | ja | ko)
 */
(function (global) {
  var SUPPORTED = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko']
  var HTML_LANG = { 'zh-TW': 'zh-TW', 'zh-CN': 'zh-CN', en: 'en', ja: 'ja', ko: 'ko' }
  var NATIVE = { 'zh-TW': '繁中', 'zh-CN': '简中', en: 'EN', ja: '日本語', ko: '한국어' }

  function currentLang() {
    var q = new URLSearchParams(window.location.search).get('lang')
    if (q && SUPPORTED.indexOf(q) !== -1) return q
    return 'zh-TW'
  }

  function withLang(href) {
    var lang = currentLang()
    if (!href || href.indexOf('#') === 0) return href
    try {
      var u = new URL(href, window.location.href)
      u.searchParams.set('lang', lang)
      if (u.origin === window.location.origin) {
        return u.pathname + u.search + u.hash
      }
      return u.toString()
    } catch (e) {
      var join = href.indexOf('?') !== -1 ? '&' : '?'
      return href + join + 'lang=' + encodeURIComponent(lang)
    }
  }

  function renderSwitcher(container) {
    if (!container) return
    var cur = currentLang()
    var base = window.location.pathname
    container.innerHTML = SUPPORTED.map(function (code) {
      var active = code === cur ? ' is-active' : ''
      var url = base + '?lang=' + encodeURIComponent(code)
      return (
        '<a class="lang-pill' +
        active +
        '" href="' +
        url +
        '" hreflang="' +
        HTML_LANG[code] +
        '">' +
        NATIVE[code] +
        '</a>'
      )
    }).join('')
  }

  function applyFont(lang) {
    var map = {
      'zh-CN': "'Inter', 'Noto Sans SC', sans-serif",
      ja: "'Inter', 'Noto Sans JP', sans-serif",
      ko: "'Inter', 'Noto Sans KR', sans-serif",
    }
    if (map[lang]) document.body.style.fontFamily = map[lang]
    else document.body.style.fontFamily = "'Inter', 'Noto Sans TC', sans-serif"
  }

  function applyFlat(bundle, lang) {
    var t = bundle[lang] || bundle['zh-TW']
    if (!t) return
    document.documentElement.lang = HTML_LANG[lang] || 'zh-TW'
    applyFont(lang)

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n')
      if (!key || t[key] === undefined) return
      var val = t[key]
      if (el.tagName === 'TITLE') {
        el.textContent = val
        return
      }
      if (el.tagName === 'META' && el.getAttribute('name') === 'description') {
        el.setAttribute('content', val)
        return
      }
      if (el.tagName === 'PRE') {
        el.textContent = val
        return
      }
      el.textContent = val
    })

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html')
      if (!key || t[key] === undefined) return
      el.innerHTML = t[key]
    })

    document.querySelectorAll('a[data-doc-link]').forEach(function (a) {
      var base = a.getAttribute('data-doc-link') || ''
      a.setAttribute('href', withLang(base))
    })
  }

  global.DocI18n = {
    SUPPORTED: SUPPORTED,
    currentLang: currentLang,
    withLang: withLang,
    renderSwitcher: renderSwitcher,
    applyFlat: applyFlat,
    applyFont: applyFont,
  }
})(typeof window !== 'undefined' ? window : this)
