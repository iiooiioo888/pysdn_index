import { ModulesVideoFlowCards } from './ModulesVideoFlowCards'

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
        <ModulesVideoFlowCards tm={tm} />
      </div>
    </section>
  )
}
