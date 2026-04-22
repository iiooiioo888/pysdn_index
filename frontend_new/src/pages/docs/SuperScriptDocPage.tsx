import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { DocReadingSummary } from '../../components/docs/DocReadingSummary'
import { DocMermaid } from '../../components/docs/DocMermaid'
import { SUPERSCRIPT_MINDMAP, SUPERSCRIPT_NARRATIVE_ARC } from '../../components/docs/mermaidCharts'
import { useDocBundle } from '../../hooks/useDocBundle'
import { PATHS } from '../../routes/paths'
import { toLangSearch } from '../../routes/langQuery'

export function SuperScriptDocPage() {
  const { t: tUi } = useTranslation()
  const { t, ready, loadError, lang } = useDocBundle('superscript')

  if (!ready) {
    return (
      <DocLayout variant="script">
        <main className="doc-main">
          <div className="doc-main-inner" style={{ paddingTop: 100 }}>
            <p className="doc-hero-lead" style={{ opacity: loadError ? 1 : 0.5 }}>
              {loadError ? tUi('doc_page_load_error') : tUi('doc_page_loading')}
            </p>
          </div>
        </main>
      </DocLayout>
    )
  }

  return (
    <DocLayout variant="script">
      <DocNavbar t={t} lang={lang} moduleNav={{ mode: 'docs', current: 'superscript' }} />
      <main className="doc-main">
        <div className="doc-main-inner">
          <section className="doc-hero" aria-labelledby="doc-hero-title">
            <div className="doc-hero-card">
              <div className="doc-hero-fx" aria-hidden="true">
                <span className="doc-hero-grid" />
                <span className="doc-hero-orb doc-hero-orb--1" />
                <span className="doc-hero-orb doc-hero-orb--2" />
              </div>
              <div className="doc-hero-body">
                <span className="doc-hero-badge">SCRIPT ENGINE</span>
                <h1 id="doc-hero-title">SuperScript</h1>
                <p className="doc-hero-lead">{t('hero_lead')}</p>
              </div>
            </div>
          </section>

          <article className="doc">
            <DocReadingSummary t={t} variant="superscript" />
            <h2>{t('h_intro')}</h2>
            <p>SuperScript 是一套 AI 劇本引擎，專門幫你從零開始產出結構完整的劇本。它不是「一個 AI 寫全部」，而是由四個專業 AI Agent 組成的協作團隊——Architect（架構師）先畫骨架、Continuity（一致性檢查）確保邏輯無破綻、Writer（寫手）填充對白與場景描寫、Format（排版師）最後收尾整理。</p>
            <p>你只需要提供基本方向（類型、角色、核心衝突），SuperScript 就能自動產出一集完整的劇本，從 Hook 到 Resolution 每一幕都有明確的結構定位。以下是它的核心能力：</p>

            <h3>結構化敘事引擎：每一幕都有定位</h3>
            <p>SuperScript 不會隨機產出一段段文字，而是按照經典敘事結構來組織內容。每一幕都有明確的結構定位：開頭的鉤子（Hook）負責抓住觀眾注意力、中段的衝突升級（Rising Action）逐步推高張力、高潮轉折（Climax）是全劇最緊張的時刻、收尾（Resolution）建立新的平衡。</p>
            <p>你不用自己數節拍，系統自動幫你標注每一幕的敘事功能，確保整體節奏符合觀眾的心理預期。如果某一幕的結構定位偏離了（例如本該是 Rising 的場景卻太平淡），系統會主動提醒你。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 結構範例</div>
              <p>
                EP1 · S01「日常」 → Hook: @Mei 發現異常信號，建立懸念<br/>
                EP1 · S02「裂痕」 → Rising: 信任開始動搖，衝突醞釀<br/>
                EP1 · S03「爆發」 → Climax: 衝突正面交鋒，情感最高點<br/>
                EP1 · S04「餘波」 → Resolution: 新的平衡建立，埋下伏筆
              </p>
            </div>

            <div className="doc-diagram-block">
              <h3>敘事弧示意（一集內節點）</h3>
              <p className="doc-diagram-lead">典型四段：鉤子 → 升溫 → 高潮 → 收尾，對應一集內的節奏安排。</p>
              <DocMermaid chart={SUPERSCRIPT_NARRATIVE_ARC} />
            </div>

            <h3>版本控制：改壞了？一鍵回來</h3>
            <p>每次 AI 修改劇本內容，SuperScript 都會自動建立一個新版本。你可以隨時回溯到任何歷史版本，也可以左右並排比較兩個版本的差異——系統會用顏色高亮標注出新增、刪除、修改的部分。</p>
            <p>這不只是「存了多個檔案」，而是真正的結構化版本管理。每次改動都附帶 AI 的修改理由：為什麼改、改了什麼、預期效果是什麼。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 版本差異範例</div>
              <p>
                v3: 「@Kai 沉默地轉身離開」<br/>
                v4: 「@Kai 咬緊牙關，轉身時撞倒了桌上的咖啡杯」<br/>
                → 系統標註：增加了肢體動作細節，情緒強度 ↑15%<br/>
                → 修改理由：純粹的「轉身離開」缺乏視覺衝擊力，加入具體動作讓畫面更生動
              </p>
            </div>

            <h3>四 AI 協作：不是一個模型硬寫</h3>
            <p>SuperScript 的核心設計理念是「專業分工」。一個 AI 要同時處理結構、文筆、一致性和格式，就像讓一個人同時當導演、編劇、剪接師——品質不可能好。所以 SuperScript 把工作拆成四步，每步由一個專業 Agent 處理：</p>
            <p><strong>Architect（架構師）</strong>負責分析你的需求，產出劇本骨架：分幾集、每集幾幕、每幕的敘事功能是什麼、角色弧線怎麼走。它產出的不是成品，而是一張「施工藍圖」。</p>
            <p><strong>Continuity（一致性守護者）</strong>拿到藍圖後，先檢查邏輯：角色的行為是否符合人設？時間線有沒有矛盾？世界觀規則是否一致？如果有問題，它會在 Writer 動筆前就標注出來。</p>
            <p><strong>Writer（寫手）</strong>在通過一致性檢查的藍圖上填充對白和場景描寫。它會參考角色的語音模型（Voice Profile），確保每個角色的說話風格在整部劇中保持一致。</p>
            <p><strong>Format（排版師）</strong>最後收尾：統一格式、補充場景標頭（INT./EXT.、時間、地點）、檢查字數和時長估算，輸出可以直接給導演看的標準劇本格式。</p>

            <h3>語音匹配：每個角色都有自己的嘴</h3>
            <p>SuperScript 為每個角色建立「語音模型」（Voice Profile），記錄該角色的說話習慣：用詞偏好、句式長度、語氣節奏、常用口頭禪。不管劇本寫到第幾集，@Mei 還是那個簡潔冷靜的 @Mei，@Kai 還是那個愛用反問句的 @Kai。</p>
            <p>系統會檢查對白是否符合各角色的說話習慣；若落差較大會提醒你再調整。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 語音匹配範例</div>
              <p>
                @Mei: 「看到了。不需要解釋。」（簡短、果斷 → voice_match: 97%）<br/>
                @Kai: 「所以你的意思是……我搞砸了？」（反問、自嘲 → voice_match: 95%）<br/>
                @Lin: 「行吧，反正每次都是我收拾殘局～」（輕鬆、吐槽 → voice_match: 93%）<br/>
                @Mei: 「嗯，我覺得這件事情可能需要再考慮一下，你說呢？」（太長太客氣 → voice_match: 62% ⚠️）
              </p>
            </div>

            <h2>{t('h_char')}</h2>
            <div dangerouslySetInnerHTML={{ __html: t('doc_ss_characters_html') }} />

            <h3>模組串接：一個生態系打通</h3>
            <p>SuperScript 不是孤島。SuperTrack 幫你抓熱門話題注入大綱——例如「短劇」最近在社群爆了，SuperTrack 會建議你在下一集加入短劇元素。SuperForge 把場景描述自動轉換成畫面提示詞——你寫了「雨夜的東京街頭」，它直接幫你生出 <code>rainy Tokyo street at night, neon reflections</code>，一鍵送進 Midjourney。SuperTune 進行 A/B 測試優化對白——同一場戲用兩種寫法，看哪個觀眾反應更好。</p>

            <div className="doc-diagram-block">
              <h3>四 Agent 職責（思維導圖）</h3>
              <p className="doc-diagram-lead">
                Architect → Continuity → Writer → Format
                的分工與產出重點，對照下方分工表與流水線圖。
              </p>
              <DocMermaid chart={SUPERSCRIPT_MINDMAP} />
            </div>

            {/* ── AI 分工表 ── */}
            <h2>{t('h_agents')}</h2>
            <p>以下是四個 AI Agent 的詳細職責分工：</p>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>{t('th_agent')}</th>
                    <th>{t('th_duty')}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Architect</strong></td>
                    <td>{t('ag_d1')}</td>
                  </tr>
                  <tr>
                    <td><strong>Continuity</strong></td>
                    <td>{t('ag_d2')}</td>
                  </tr>
                  <tr>
                    <td><strong>Writer</strong></td>
                    <td>{t('ag_d3')}</td>
                  </tr>
                  <tr>
                    <td><strong>Format</strong></td>
                    <td>{t('ag_d4')}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* ── 快速上手 ── */}
            <h2>🚀 快速上手</h2>
            <p>從零到產出第一集劇本，只需要四個步驟：</p>

            <h3>第一步：設定專案基本資訊</h3>
            <p>打開 SuperScript，建立一個新專案。填入基本資訊：劇本類型（短劇、長劇、廣告腳本等）、集數、每集預估時長、核心角色列表（名稱 + 簡要人設）、核心衝突描述。這些資訊會成為 Architect 產出藍圖的基礎。</p>

            <h3>第二步：讓 Architect 產出骨架</h3>
            <p>點擊「生成骨架」，Architect 會根據你的需求產出一份結構化大綱。大綱包含每集的分幕結構、每幕的敘事功能、角色出場安排、衝突升級節奏。你可以逐幕審查，如果不滿意可以要求 Architect 重新產出或局部調整。</p>

            <h3>第三步：啟動四 Agent 協作流程</h3>
            <p>骨架確認後，點擊「開始生成」。系統會自動依序執行：Continuity 檢查 → Writer 填充 → Format 收尾。你可以在面板上即時看到 Writer 的進度條，以及每個 Agent 的工作狀態（排隊中、執行中、已完成）。</p>

            <h3>第四步：審閱、修改、匯出</h3>
            <p>生成完成後，仔細審閱劇本。如果某段對白不符合預期，可以直接選取文字要求 AI 重寫（會保留版本記錄）。確認無誤後，匯出為標準劇本格式（Final Draft、Fountain、PDF 等）。</p>

            {/* ── 適用場景 ── */}
            <h2>🎯 適用場景</h2>

            <h3>場景一：短劇團隊的快速產出</h3>
            <p>你是短劇團隊的編劇，每週要產出 3-5 集劇本，每集 3-5 分鐘。以前從零寫一集要半天，現在用 SuperScript，你提供基本方向（角色、衝突、類型），30 分鐘內就能拿到一集結構完整的初稿。你只需要花時間精修對白和細節，而不是從空白頁開始掙扎。</p>

            <h3>場景二：品牌方的廣告腳本</h3>
            <p>你要為客戶產出一系列品牌故事影片的腳本。SuperScript 的語音匹配功能確保品牌代言人（無論是真人還是虛擬角色）在每一支影片中的說話風格一致。版本控制讓你可以同時產出 A/B 兩種腳本版本，讓客戶選擇喜歡的方向。</p>

            <h3>場景三：獨立創作者的連載小說</h3>
            <p>你在寫一部連載小說，每週更新兩章。SuperScript 的 Continuity Agent 會幫你檢查角色在第十章的行為是否跟第一章的人設一致——這種跨越幾萬字的一致性檢查，人類很容易遺漏，AI 不會。</p>

            <h3>場景四：YouTube 頻道的內容腳本</h3>
            <p>你是 YouTube 創作者，需要為每支影片寫腳本。SuperScript 可以根據你的影片類型（教學、開箱、Vlog）自動產出結構化的腳本，包含開場 Hook、重點段落、收尾 CTA。你還可以訓練它的 Voice Profile 匹配你的口語風格。</p>

            {/* ── 與其他模組的搭配 ── */}
            <h2>🔗 與其他模組的搭配</h2>

            <h3>SuperTrack → SuperScript：熱點注入劇本</h3>
            <p>SuperTrack 追蹤社群平台的熱門話題和趨勢，當它發現跟你劇本類型相關的熱點時，會主動推送建議給 SuperScript。例如，SuperTrack 偵測到「AI 取代編劇」的話題正在升溫，它會建議你在下一集中加入相關元素，提升內容的時效性和話題性。</p>

            <h3>SuperScript → SuperForge：場景描述變畫面</h3>
            <p>SuperScript 中每個場景的視覺描述（如「夕陽下的廢墟城市」），會自動推送給 SuperForge 轉換成 Midjourney/Stable Diffusion 可用的畫面提示詞。你不需要自己把文字劇本翻譯成 AI 圖片的 prompt——SuperForge 幫你做好了。</p>

            <h3>SuperScript → SuperTune：對白優化與 A/B 測試</h3>
            <p>SuperScript 產出的對白，可以送進 SuperTune 做進一步優化。SuperTune 會分析每句對白的張力指數、新鮮度評分，並建議修改方向。你也可以用 SuperTune 的 A/B 測試功能，讓兩種不同的對白寫法同時接受觀眾測試，用數據決定哪個版本更好。</p>

            <h2>🖥️ 操作面板預覽</h2>
            <p>打開 SuperScript 時可檢視流水線、Writer 進度、一致性分數與建議；完整大螢幕示範（含佇列表與 Writer 摘錄）已獨立成頁。</p>
            <p>
              <Link className="doc-lab-cta" to={{ pathname: PATHS.labs.superscript, search: toLangSearch(lang) }}>
                開啟 SuperScript 儀表板（示範資料）→
              </Link>
            </p>

            <p style={{ marginTop: '2rem', opacity: 0.6 }}>{t('license_p')}</p>
          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
