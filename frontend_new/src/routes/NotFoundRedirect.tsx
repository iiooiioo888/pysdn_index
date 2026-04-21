import { Navigate, useLocation } from 'react-router-dom'
import { PATHS } from './paths'

/** Sends unknown paths home while preserving query (e.g. `?lang=`). */
export function NotFoundRedirect() {
  const { search } = useLocation()
  return <Navigate to={{ pathname: PATHS.home, search }} replace />
}
