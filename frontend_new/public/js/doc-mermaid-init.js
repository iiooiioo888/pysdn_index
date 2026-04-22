/**
 * 靜態文件頁：依 [data-doc-diagram] 從 doc-diagrams.json 載入並渲染 Mermaid
 */
const MERMAID_CDN = 'https://cdn.jsdelivr.net/npm/mermaid@11.14.0/dist/mermaid.esm.min.mjs'
const SCRIPT_BASE = new URL('.', import.meta.url)

async function loadDiagrams() {
  const res = await fetch(new URL('doc-diagrams.json', SCRIPT_BASE))
  if (!res.ok) throw new Error('doc-diagrams.json ' + res.status)
  return res.json()
}

async function main() {
  const hosts = document.querySelectorAll('[data-doc-diagram]')
  if (!hosts.length) return

  let diagrams
  try {
    diagrams = await loadDiagrams()
  } catch (e) {
    hosts.forEach(function (el) {
      el.innerHTML =
        '<p class="doc-mermaid-error">無法載入圖表定義：' +
        (e && e.message ? e.message : String(e)) +
        '</p>'
    })
    return
  }

  const mermaid = (await import(MERMAID_CDN)).default
  mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    securityLevel: 'strict',
    themeVariables: {
      darkMode: true,
      background: '#0c0c14',
      primaryColor: '#1e293b',
      primaryTextColor: '#e8edf5',
      secondaryColor: '#334155',
      tertiaryColor: '#0f172a',
      lineColor: '#64748b',
      fontFamily: "'Plus Jakarta Sans', 'Noto Sans TC', system-ui, sans-serif",
    },
  })

  var i = 0
  for (var h = 0; h < hosts.length; h++) {
    var el = hosts[h]
    var key = el.getAttribute('data-doc-diagram')
    var chart = key && diagrams[key]
    if (!chart) continue
    var id = 'doc-static-mmd-' + String(key).replace(/\W+/g, '-').slice(0, 48) + '-' + i++
    try {
      var out = await mermaid.render(id, String(chart).trim())
      el.innerHTML = out.svg
      el.removeAttribute('aria-busy')
    } catch (err) {
      el.innerHTML =
        '<p class="doc-mermaid-error">圖表無法顯示：' +
        (err && err.message ? err.message : String(err)) +
        '</p>'
      el.removeAttribute('aria-busy')
    }
  }
}

main()
