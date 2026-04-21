import { DocLayout } from '../../components/docs/DocLayout'
import { DocNavbar } from '../../components/docs/DocNavbar'
import { DocFooter } from '../../components/docs/DocFooter'
import { useDocBundle } from '../../hooks/useDocBundle'

export function SuperTuneDocPage() {
  const { t, ready, loadError, lang } = useDocBundle('supertune')

  if (!ready) {
    return (
      <DocLayout variant="tune">
        <main className="doc-main">
          <div className="doc-main-inner" style={{ paddingTop: 100 }}>
            <p className="doc-hero-lead" style={{ opacity: loadError ? 1 : 0.5 }}>
              {loadError ? '無法載入翻譯資料，請重新整理頁面。' : '…'}
            </p>
          </div>
        </main>
      </DocLayout>
    )
  }

  return (
    <DocLayout variant="tune">
      <DocNavbar t={t} lang={lang} />
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
                <span className="doc-hero-badge">OPTIMIZATION</span>
                <h1 id="doc-hero-title">SuperTune</h1>
                <p className="doc-hero-sub">{t('hero_sub')}</p>
                <p className="doc-hero-lead">{t('intro_p')}</p>
              </div>
            </div>
          </section>

          <article className="doc">
            {/* ── 快速上手 ── */}
            <h2>🚀 快速上手</h2>
            <p>SuperTune 不需要複雜設定。只要把你的內容丟進來，它就會自動分析、優化、給你建議。</p>
            <ol>
              <li><strong>匯入內容</strong>：把你的提示詞、劇本片段、行銷文案貼進 SuperTune，或直接從 SuperForge / SuperScript 匯入。</li>
              <li><strong>選擇優化模式</strong>：A/B 測試（比較兩個版本）、成本優化（省 token）、品質分析（節奏 / 張力 / 新鮮度）。</li>
              <li><strong>查看結果</strong>：系統自動跑分析，幾秒內出結果。左邊是原始版本，右邊是優化建議。</li>
              <li><strong>一鍵套用</strong>：覺得 B 版本比較好？按一下就套用，自動回寫到 SuperForge 或 SuperScript。</li>
            </ol>

            {/* ── A/B 測試 ── */}
            <h2>🔬 A/B 平行宇宙測試</h2>
            <p>同一個 prompt、同一個模型，同時跑出兩個版本。SuperTune 自動比較效果分數（E, Engagement）和回應品質（R, Response），用統計學告訴你哪個版本真的比較好——不是「看起來差不多」，而是有數據支撐的結論。</p>
            <p>系統會計算 effect size（效果差異有多大）、p-value（統計顯著性）和信心度（confidence）。只有當信心度超過 95% 時才會建議你套用，避免隨機波動誤導你。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例：行銷文案測試</div>
              <p>宇宙 A：「限時優惠，買一送一，立即搶購！」<br/>
              → E: 72% · R: 68%<br/><br/>
              宇宙 B：「你錯過上次了。這次，我們留了最好的給你。」<br/>
              → E: 88% · R: 79%<br/><br/>
              結果：B 版本效果分數高出 16%，effect size 0.38，信心度 99.7%。<br/>
              系統建議：「✅ 套用宇宙 B」，一鍵生效。</p>
            </div>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例：劇本對白測試</div>
              <p>宇宙 A：@Mei「我不相信你了。」<br/>
              → E: 68% · 情緒層次：flat<br/><br/>
              宇宙 B：@Mei「你說的每一個字，我現在都要重新聽一遍。」<br/>
              → E: 84% · 情緒層次：rich（含懷疑、痛苦、自嘲）<br/><br/>
              結果：B 版情緒層次更豐富，觀眾共鳴度更高。系統自動標註 B 版增加了「隱忍→爆發」的張力結構。</p>
            </div>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例：圖片提示詞測試</div>
              <p>宇宙 A：<code>portrait of a girl, neon lights, tokyo, night</code><br/>
              → 細節度 72%，風格一致性 81%<br/><br/>
              宇宙 B：<code>cinematic portrait of a young woman standing under neon signs in Shinjuku, rain-soaked streets reflecting pink and blue light, shallow depth of field, 85mm lens</code><br/>
              → 細節度 91%，風格一致性 94%<br/><br/>
              結果：B 版加入鏡頭語言和具體場景描述，出圖穩定度大幅提升。</p>
            </div>

            {/* ── 成本優化 ── */}
            <h2>💸 成本優化</h2>
            <p>SuperTune 自動幫你省 token，不是砍品質，是更聰明地用。系統會分析你的使用模式，找出可以優化的地方，然後給出具體省了多少錢。</p>
            <p>四種優化策略同時運作，每一種都在不同層面節省成本：</p>
            <ul>
              <li><strong>Prompt 壓縮</strong>：自動偵測冗餘描述（例如重複的風格修飾詞），精簡語句但保留語意。平均節省 15-25% 的 token。</li>
              <li><strong>Context Window 管理</strong>：只餵最相關的上下文，不把整個歷史記錄都塞進去。對於長對話尤其有效。</li>
              <li><strong>Batch 合併</strong>：多個小請求合併成一個大請求，減少 API 呼叫次數和網路開銷。</li>
              <li><strong>Model Tier 降級</strong>：簡單任務（格式轉換、摘要）自動用便宜的模型，複雜任務才用頂級模型。</li>
            </ul>
            <div className="doc-example">
              <div className="doc-example-label">💡 實際效果</div>
              <p>原本一個長劇本生成（20 個場景、約 8000 tokens）要花 $6.80。<br/>
              經過 SuperTune 優化後：<br/>
              ・Prompt 壓縮：省 $0.38（移除重複的角色描述）<br/>
              ・Context Window：省 $0.22（只傳最近 3 場的上下文）<br/>
              ・Batch 合併：省 $0.15（10 個場景一批次處理）<br/>
              總計降到 $4.12，省了 39%。品質分數只降了 1.2%，幾乎無感。</p>
            </div>

            {/* ── 節奏指數 ── */}
            <h2>⏱️ 節奏指數</h2>
            <p>幫你量每一幕的「呼吸節奏」。好的節奏就像好的音樂——有快有慢、有張有弛。節奏指數從四個維度來衡量：</p>
            <ul>
              <li><strong>Scene Length（場景長度）</strong>：每一幕長度是否適中？太長會讓觀眾走神，太短則來不及建立情緒。理想值 0.7-0.85。</li>
              <li><strong>Dialogue Dense（對白密度）</strong>：是不是一直在講話沒停？好的劇本需要「呼吸空間」——安靜的畫面、角色的沉默、環境描寫。理想值 0.6-0.8。</li>
              <li><strong>Action Rhythm（動作節拍）</strong>：動作場面的緊湊程度。追逐戲要快（0.9+），文戲要慢（0.5-0.7）。</li>
              <li><strong>Cuttability（剪接友善度）</strong>：後期剪輯容不容易？分鏡清晰、轉場自然的場景更容易剪。</li>
            </ul>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例</div>
              <p>S07 的 Scene Length 達到 0.95（太長了！），觀眾可能在這一幕走神。<br/>
              系統建議：「拆分為 S07a（追逐）+ S07b（對峙）」<br/>
              拆完後：S07a Scene Length 0.72、S07b Scene Length 0.68，整體節奏指數從 0.81 提升到 0.87。</p>
            </div>

            {/* ── 張力曲線 ── */}
            <h2>🔥 張力曲線</h2>
            <p>對照好萊塢經典三幕結構的張力曲線，看你的故事有沒有「該緊的時候緊、該鬆的時候鬆」。系統把你的劇本跟上千部成功電影的張力模式做比對，算出 match score。</p>
            <ul>
              <li><strong>Act1 Setup（建立世界觀）</strong>：張力低（0.2-0.4），讓觀眾進入故事。這時候你介紹角色、建立規則、埋下伏筆。</li>
              <li><strong>Act2 Rising（衝突升級）</strong>：張力持續爬升（0.5-0.8），障礙越來越大，角色面臨抉擇。這是觀眾最投入的階段。</li>
              <li><strong>Act3 Climax（高潮）</strong>：張力到達最高點（0.9+），所有衝突在這一刻爆發。觀眾的情緒被推到極限。</li>
              <li><strong>Resolution（收尾）</strong>：張力回落（0.2-0.3），新的平衡建立，留下餘韻。</li>
            </ul>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例</div>
              <p>你的 Act2 張力只有 0.52，遠低於好萊塢標準的 0.72。<br/>
              系統標註 S04-S06 為「張力低谷」，建議：<br/>
              ・S04：加入一個意想不到的角色背叛<br/>
              ・S05：增加時間壓力（倒數計時）<br/>
              ・S06：讓主角做出一個不可逆的決定<br/>
              Hollywood curve match: 87% → 目標提升到 93%+。</p>
            </div>

            {/* ── 新鮮度偵測 ── */}
            <h2>✨ 新鮮度偵測</h2>
            <p>自動掃描劇本，找出那些「觀眾看過一百遍」的老梗（trope）。系統內建超過 2000 個已知 trope 資料庫，涵蓋愛情、動作、科幻、恐怖等各種類型。每個 trope 都有風險評分：HIGH 代表觀眾很容易認出來、覺得老套；LOW 代表安全。</p>
            <p>新鮮度指數（Freshness Index）綜合考量：出現幾個 trope、每個 trope 的普遍程度、你有沒有做出新詮釋。0.8 以上算優秀，0.6 以下需要認真改。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例：偵測結果</div>
              <p>⚠️ <strong>Chosen One（天選之人）</strong>出現在 S02 — 命中率 94%<br/>
              → 建議：改成「主角是被隨機選中的普通人」，顛覆套路<br/><br/>
              ⚠️ <strong>Love Triangle（三角戀）</strong>出現在 S05 — 命中率 87%<br/>
              → 建議：改成職場 rival，保留競爭感但更現代<br/><br/>
              ✅ <strong>Training Montage（訓練蒙太奇）</strong>出現在 S03 — 風險低<br/>
              → 這段用得合理，因為有具體的技能成長線<br/><br/>
              ✅ <strong>Betrayal Twist（背叛反轉）</strong>出現在 S09 — 風險低<br/>
              → 前面有足夠的伏筆鋪墊，不算突兀</p>
            </div>

            {/* ── 風格遷移 ── */}
            <h2>🎨 神經風格遷移</h2>
            <p>選一個導演風格，AI 幫你把內容調成那個味道。不是抄襲台詞或畫面——而是學習敘事手法：節奏怎麼安排、衝突怎麼推進、情緒怎麼留白。系統會分析該導演的經典作品，提取敘事特徵，然後套用到你的內容上。</p>
            <p>忠誠度（Fidelity）代表風格套得有多像；Voice Preservation 代表你自己的聲音保留了多少。兩者要平衡——太高忠誠度可能變成抄襲，太低則風格不明顯。</p>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例：諾蘭敘事</div>
              <p>你的原始故事是線性結構：S01 → S02 → S03 → S04。<br/>
              套用「諾蘭敘事」後：<br/>
              ・打亂時間線：S04（未來）→ S01（過去）→ S03（現在）→ S02（回憶）<br/>
              ・加入平行剪輯：兩條時間線同時推進<br/>
              ・每幕結尾加「懸念鉤子」：讓觀眾忍不住看下一幕<br/>
              忠誠度 82%：風格到位，你自己的 voice 還在。</p>
            </div>
            <div className="doc-example">
              <div className="doc-example-label">💡 範例：是枝裕和</div>
              <p>套用「是枝裕和」後：<br/>
              ・放慢節奏：減少戲劇衝突，增加日常生活細節<br/>
              ・大量留白：角色沉默的時間變長，讓情緒自然發酵<br/>
              ・環境音強化：用環境聲音（煮飯、洗碗、窗外的雨）代替配樂<br/>
              忠誠度 79%：整體感覺變溫柔了，但核心衝突還在。</p>
            </div>
            <p>可選風格包括：諾蘭敘事、是枝裕和、王家衛、昆汀·塔倫提諾、新海誠，以及自定義風格（上傳你喜歡的作品讓系統學習）。</p>

            {/* ── 適用場景 ── */}
            <h2>📋 適用場景</h2>
            <ul>
              <li><strong>行銷團隊</strong>：同一則廣告文案跑 A/B 測試，用數據決定哪個版本上線，避免「我覺得這個比較好」的爭論。</li>
              <li><strong>劇本創作者</strong>：寫完初稿後用張力曲線和新鮮度偵測檢查品質，找出需要加強的場景和需要替換的老梗。</li>
              <li><strong>AI 繪圖重度用戶</strong>：同一個概念跑兩個提示詞版本，看哪個出圖穩定度更高，然後自動優化參數。</li>
              <li><strong>企業工作流</strong>：大量內容需要生成時，用成本優化把 API 費用壓到最低，同時用品質監控確保輸出品質不掉。</li>
            </ul>

            {/* ── 與其他模組的搭配 ── */}
            <h2>🔗 與其他模組的搭配</h2>
            <p>SuperTune 不是獨立運作的——它是整個 SuperCool 生態系的「優化中樞」：</p>
            <ul>
              <li><strong>SuperForge → SuperTune</strong>：從知識庫取出歷史提示詞，跑 A/B 測試找出最佳參數組合，結果回寫到版本樹。</li>
              <li><strong>SuperScript → SuperTune</strong>：劇本寫完後自動跑節奏分析、張力曲線和新鮮度偵測，給出具體修改建議。</li>
              <li><strong>SuperTrack → SuperTune</strong>：把追蹤到的熱門內容注入測試，看哪個 trend 方向最適合你的受眾。</li>
              <li><strong>SuperTune → 全部</strong>：成本優化的省錢效果回饋到整個平台，讓你在不增加預算的情況下產出更多內容。</li>
            </ul>

            {/* ── 模擬面板 ── */}
            <h2>🖥️ 操作面板預覽</h2>
            <p>打開 SuperTune，你會看到 A/B 測試、成本優化、節奏分析一目了然。以下是模擬畫面：</p>

            <div className="sim-panel">
              {/* Module Header */}
              <div className="sim-header">
                <div className="sim-header-left">
                  <span className="sim-icon">🧠</span>
                  <span className="sim-title">SuperTune</span>
                  <span className="sim-badge sim-badge--purple">OPTIMIZATION</span>
                  <span className="sim-live"><span className="sim-dot sim-dot--purple"></span> LIVE</span>
                </div>
                <div className="sim-header-right">
                  <button className="sim-btn sim-btn--primary">✅ 套用變體 B</button>
                  <button className="sim-btn sim-btn--outline">↩️ 復原</button>
                </div>
              </div>

              {/* 2-col: A/B Test + Cost */}
              <div className="sim-grid-2">
                <div className="sim-card">
                  <div className="sim-card-head">🔬 A/B 平行宇宙測試 <span style={{ fontSize: '0.6rem', opacity: 0.4, marginLeft: 8 }}>p=0.003 · n=1,247</span></div>
                  <p style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: 8 }}>左右兩個版本同時跑，E = 效果分數，R = 回應品質。紫色代表勝出的變體。</p>
                  <div className="sim-ab-universe">
                    <div className="sim-ab-label">宇宙 A (原始)</div>
                    <div className="sim-ab-row"><span className="sim-ab-dim">E</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '72%' }}></div></div><span className="sim-ab-score">72.0%</span></div>
                    <div className="sim-ab-row"><span className="sim-ab-dim">R</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '68%' }}></div></div><span className="sim-ab-score">68.1%</span></div>
                  </div>
                  <div className="sim-ab-universe" style={{ marginTop: 8 }}>
                    <div className="sim-ab-label" style={{ color: '#a78bfa' }}>宇宙 B (變體) ✓</div>
                    <div className="sim-ab-row"><span className="sim-ab-dim">E</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '88%' }}></div></div><span className="sim-ab-score">88.0%</span></div>
                    <div className="sim-ab-row"><span className="sim-ab-dim">R</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '79%' }}></div></div><span className="sim-ab-score">79.3%</span></div>
                  </div>
                  <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 6, marginTop: 8 }}>
                    <div className="sim-kpi"><div className="sim-kpi-label">effect size</div><div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>0.38</div></div>
                    <div className="sim-kpi"><div className="sim-kpi-label">confidence</div><div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>99.7%</div></div>
                    <div className="sim-kpi"><div className="sim-kpi-label">winner</div><div className="sim-kpi-val" style={{ fontSize: '0.8rem', color: '#a78bfa' }}>B ↑16%</div></div>
                  </div>
                </div>

                <div className="sim-card">
                  <div className="sim-card-head">💸 成本與快取 <span style={{ fontSize: '0.6rem', opacity: 0.4, marginLeft: 8 }}>saved $1.24 today</span></div>
                  <p style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: 8 }}>即時追蹤四種省錢策略的實際效果，綠色數字是已省下的金額。</p>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div style={{ fontSize: '0.55rem', color: 'rgba(148,163,184,0.4)' }}>Total Saved</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: "'JetBrains Mono', monospace" }}>$1.24</div>
                    <div style={{ fontSize: '0.55rem', color: '#22c55e' }}>↓ 18% vs baseline</div>
                  </div>
                  <div className="sim-strategy-list">
                    <div className="sim-strategy sim-strategy--active"><span>✅</span><span>Prompt 壓縮</span><span className="sim-strategy-saving">-$0.38</span></div>
                    <div className="sim-strategy sim-strategy--active"><span>✅</span><span>Context Window 管理</span><span className="sim-strategy-saving">-$0.22</span></div>
                    <div className="sim-strategy sim-strategy--active"><span>✅</span><span>Batch 合併請求</span><span className="sim-strategy-saving">-$0.15</span></div>
                    <div className="sim-strategy"><span>○</span><span>Model Tier 降級</span><span style={{ color: 'rgba(148,163,184,0.4)' }}>-$0.09 est.</span></div>
                  </div>
                </div>
              </div>

              {/* 3-col: Pacing + Tension + Freshness */}
              <p style={{ fontSize: '0.65rem', opacity: 0.5, marginTop: 12, marginBottom: 4 }}>以下三個面板分別分析你的內容品質：節奏是否舒服、張力是否到位、有沒有太老套的套路。</p>
              <div className="sim-grid-3">
                <div className="sim-card">
                  <div className="sim-card-head">⏱️ 節奏指數 <span className="sim-badge-inline">0.87</span></div>
                  <div className="sim-metric-list">
                    <div className="sim-metric-row"><span>Scene Length</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '82%' }}></div></div><span>0.82</span></div>
                    <div className="sim-metric-row"><span>Dialogue Dense</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '75%' }}></div></div><span>0.75</span></div>
                    <div className="sim-metric-row"><span>Action Rhythm</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '91%' }}></div></div><span>0.91</span></div>
                    <div className="sim-metric-row"><span>Cuttability</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '68%' }}></div></div><span>0.68</span></div>
                  </div>
                </div>

                <div className="sim-card">
                  <div className="sim-card-head">🔥 張力曲線 <span className="sim-badge-inline" style={{ color: '#ef4444' }}>0.83</span></div>
                  <div className="sim-metric-list">
                    <div className="sim-metric-row"><span>Act1 Setup</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--red" style={{ width: '35%' }}></div></div><span>0.35</span></div>
                    <div className="sim-metric-row"><span>Act2 Rising</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--amber" style={{ width: '72%' }}></div></div><span>0.72</span></div>
                    <div className="sim-metric-row"><span>Act3 Climax</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--red" style={{ width: '95%' }}></div></div><span>0.95</span></div>
                    <div className="sim-metric-row"><span>Resolution</span><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--cyan" style={{ width: '28%' }}></div></div><span>0.28</span></div>
                  </div>
                  <div style={{ marginTop: 6, fontSize: '0.5rem', color: 'rgba(148,163,184,0.4)', textAlign: 'center' }}>Hollywood curve match: <strong style={{ color: '#e2e8f0' }}>87%</strong></div>
                </div>

                <div className="sim-card">
                  <div className="sim-card-head">✨ 新鮮度 <span className="sim-badge-inline" style={{ color: '#a78bfa' }}>0.76</span></div>
                  <div className="sim-trope-list">
                    <div className="sim-trope sim-trope--warn"><span>⚠ HIGH</span><span>Chosen One (S02)</span></div>
                    <div className="sim-trope sim-trope--warn"><span>⚠ HIGH</span><span>Love Triangle (S05)</span></div>
                    <div className="sim-trope sim-trope--ok"><span>LOW</span><span>Training Montage (S03)</span></div>
                    <div className="sim-trope sim-trope--ok"><span>LOW</span><span>Betrayal Twist (S09)</span></div>
                  </div>
                  <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: 4, marginTop: 8 }}>
                    <div className="sim-kpi"><div className="sim-kpi-label">tropes</div><div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>4</div></div>
                    <div className="sim-kpi"><div className="sim-kpi-label">originality</div><div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>0.82</div></div>
                    <div className="sim-kpi"><div className="sim-kpi-label">surprise</div><div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>0.71</div></div>
                  </div>
                </div>
              </div>

              {/* Style Transfer */}
              <div className="sim-card" style={{ marginTop: 12 }}>
                <div className="sim-card-head">🎨 神經風格遷移 <span className="sim-badge-inline" style={{ color: '#a78bfa' }}>BETA</span></div>
                <p style={{ fontSize: '0.6rem', opacity: 0.5, marginBottom: 8 }}>選擇一個導演風格，系統會逐步把你的內容調成該風格。忠誠度越高越像，但也要保留你自己的 voice。</p>
                <div className="sim-kpis" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: 6 }}>
                  <div className="sim-kpi"><div className="sim-kpi-label">active style</div><div className="sim-kpi-val" style={{ fontSize: '0.75rem' }}>諾蘭敘事</div></div>
                  <div className="sim-kpi"><div className="sim-kpi-label">fidelity</div><div className="sim-kpi-val sim-kpi-val--highlight" style={{ fontSize: '0.8rem' }}>82.4%</div></div>
                  <div className="sim-kpi"><div className="sim-kpi-label">scene</div><div className="sim-kpi-val" style={{ fontSize: '0.75rem' }}>S05 ⟳</div></div>
                  <div className="sim-kpi"><div className="sim-kpi-label">忠诚度</div><div className="sim-kpi-val" style={{ fontSize: '0.8rem' }}>82%</div><div className="sim-bar"><div className="sim-bar-fill sim-bar-fill--purple" style={{ width: '82%' }}></div></div></div>
                </div>
                <div className="sim-style-tags" style={{ marginTop: 8 }}>
                  <span className="sim-style-tag sim-style-tag--active">諾蘭敘事</span>
                  <span className="sim-style-tag">是枝裕和</span>
                  <span className="sim-style-tag">王家衛</span>
                  <span className="sim-style-tag">昆汀</span>
                  <span className="sim-style-tag">新海誠</span>
                  <span className="sim-style-tag">+ 自定義</span>
                </div>
              </div>
            </div>

            <p style={{ marginTop: '2rem', opacity: 0.6 }}>© Pysdn SuperCool · MIT License</p>
          </article>

          <DocFooter t={t} lang={lang} />
        </div>
      </main>
    </DocLayout>
  )
}
