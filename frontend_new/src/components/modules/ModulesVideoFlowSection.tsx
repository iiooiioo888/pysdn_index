type T = (key: string) => string

const STEP_KEYS = [1, 2, 3, 4] as const

export function ModulesVideoFlowSection({ tm }: { tm: T }) {
  return (
    <section id="mod-videoflow" className="mod-videoflow">
      <h2 className="mod-vidflow-page-title">{tm('mod_vidflow_title')}</h2>

      <div className="mod-vidflow-core">
        <div className="mod-vidflow-kicker">{tm('mod_vidflow_core_label')}</div>
        <h3 className="mod-vidflow-core-title">{tm('mod_vidflow_core_title')}</h3>
        <blockquote className="mod-vidflow-quote">{tm('mod_vidflow_core_quote')}</blockquote>
        <ul className="mod-vidflow-checks">
          <li>{tm('mod_vidflow_core_f1')}</li>
          <li>{tm('mod_vidflow_core_f2')}</li>
          <li>{tm('mod_vidflow_core_f3')}</li>
        </ul>
      </div>

      <div className="mod-section-heading mod-vidflow-path-heading">
        <div className="mod-section-label">{tm('mod_vidflow_path_label')}</div>
      </div>

      <div className="mod-vidflow-steps">
        {STEP_KEYS.map((n) => (
          <article key={n} className={`mod-vidflow-step mod-vidflow-step--s${n}`}>
            <h3 className="mod-vidflow-step-title">{tm(`mod_vidflow_s${n}_title`)}</h3>
            <pre className="mod-vidflow-code">{tm(`mod_vidflow_s${n}_code`)}</pre>
            <ul className="mod-vidflow-step-bullets">
              <li>{tm(`mod_vidflow_s${n}_b1`)}</li>
              <li>{tm(`mod_vidflow_s${n}_b2`)}</li>
              <li>{tm(`mod_vidflow_s${n}_b3`)}</li>
            </ul>
            <p className="mod-vidflow-out">
              <strong>{tm('mod_vidflow_out_label')}</strong> {tm(`mod_vidflow_s${n}_out`)}
            </p>
          </article>
        ))}
      </div>

      <div className="mod-vidflow-chart-block">
        <h3 className="mod-vidflow-subtitle">{tm('mod_vidflow_chart_title')}</h3>
        <pre className="mod-vidflow-pre mod-vidflow-pre--chart" aria-label={tm('mod_vidflow_chart_title')}>
          {tm('mod_vidflow_chart')}
        </pre>
      </div>

      <div className="mod-vidflow-table-wrap">
        <h3 className="mod-vidflow-subtitle">{tm('mod_vidflow_use_title')}</h3>
        <table className="mod-vidflow-table">
          <thead>
            <tr>
              <th>{tm('mod_vidflow_th_scene')}</th>
              <th>{tm('mod_vidflow_th_modules')}</th>
              <th>{tm('mod_vidflow_th_out')}</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4].map((r) => (
              <tr key={r}>
                <td>{tm(`mod_vidflow_u${r}_scene`)}</td>
                <td>
                  <code className="mod-vidflow-mono">{tm(`mod_vidflow_u${r}_mod`)}</code>
                </td>
                <td>{tm(`mod_vidflow_u${r}_out`)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mod-vidflow-cli-block">
        <h3 className="mod-vidflow-subtitle">{tm('mod_vidflow_cli_title')}</h3>
        <pre className="mod-vidflow-pre mod-vidflow-pre--cli">{tm('mod_vidflow_cli')}</pre>
      </div>

      <div className="mod-vidflow-spec-block">
        <h3 className="mod-vidflow-subtitle">{tm('mod_vidflow_spec_title')}</h3>
        <ul className="mod-vidflow-spec-list">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>{tm(`mod_vidflow_spec_${i}`)}</li>
          ))}
        </ul>
      </div>

      <details className="mod-vidflow-compact">
        <summary className="mod-vidflow-compact-summary">{tm('mod_vidflow_compact_summary')}</summary>
        <div className="mod-vidflow-compact-body">
          <h4 className="mod-vidflow-compact-h">{tm('mod_vidflow_compact_h_in')}</h4>
          <p className="mod-vidflow-compact-p">{tm('mod_vidflow_compact_in')}</p>
          <h4 className="mod-vidflow-compact-h">{tm('mod_vidflow_compact_h_proc')}</h4>
          <ol className="mod-vidflow-compact-ol">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>{tm(`mod_vidflow_compact_p${i}`)}</li>
            ))}
          </ol>
          <h4 className="mod-vidflow-compact-h">{tm('mod_vidflow_compact_h_core')}</h4>
          <p className="mod-vidflow-compact-strong">{tm('mod_vidflow_compact_core_title')}</p>
          <ul className="mod-vidflow-compact-ul">
            {[1, 2, 3].map((i) => (
              <li key={i}>{tm(`mod_vidflow_compact_core_b${i}`)}</li>
            ))}
          </ul>
          <h4 className="mod-vidflow-compact-h">{tm('mod_vidflow_compact_h_out')}</h4>
          <p className="mod-vidflow-compact-p">{tm('mod_vidflow_compact_out')}</p>
        </div>
      </details>
    </section>
  )
}
