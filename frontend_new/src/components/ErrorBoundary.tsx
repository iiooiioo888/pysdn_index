import { Component, type ErrorInfo, type ReactNode } from 'react'
import i18n from '../lib/i18n'

type Props = { children: ReactNode }

type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-card">
            <h1 className="error-boundary-title">{i18n.t('error_boundary_title')}</h1>
            <p className="error-boundary-hint">{i18n.t('error_boundary_hint')}</p>
            <button
              type="button"
              className="btn btn-primary error-boundary-reload"
              onClick={() => window.location.reload()}
            >
              {i18n.t('error_boundary_reload')}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
