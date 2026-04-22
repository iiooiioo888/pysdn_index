/**
 * SuperTrack：訊號／採集領域第三方開源連結（僅供調研參考）。
 */
const RESEARCH_REPOS: { label: string; href: string }[] = [
  { label: 'Spider_XHS', href: 'https://github.com/cv-cat/Spider_XHS' },
  { label: 'MediaCrawler', href: 'https://github.com/NanmiCoder/MediaCrawler' },
  { label: 'yt-dlp', href: 'https://github.com/yt-dlp/yt-dlp' },
  { label: 'snscrape', href: 'https://github.com/JustAnotherArchivist/snscrape' },
  { label: 'Crawl4AI', href: 'https://github.com/unclecode/crawl4ai' },
  { label: 'instaloader', href: 'https://github.com/instaloader/instaloader' },
]

export function DocGithubSection() {
  return (
    <section className="doc-github-section" id="github-projects" aria-labelledby="github-projects-title">
      <h2 id="github-projects-title">相關 GitHub 專案（調研參考）</h2>
      <p className="doc-diagram-lead">
        與公開訊號、社群資料相關之<strong>第三方開源</strong>（僅供技術調研，<strong>非</strong>本產品內建模組；使用須遵守各平台條款與法規）。
      </p>
      <ul className="doc-github-list">
        {RESEARCH_REPOS.map((item) => (
          <li key={item.href}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <p className="doc-diagram-lead">
        工具分類表、架構樹與後端說明見本頁〈工程架構與調研參考〉（<code>#engineering</code>）。
      </p>
    </section>
  )
}
