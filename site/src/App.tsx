import { HashRouter, NavLink, Route, Routes } from 'react-router-dom'
import Architecture from './views/Architecture.tsx'
import Guide from './views/Guide.tsx'

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <header className="site-header">
          <p className="site-title">Senior frontend interview</p>
          <nav className="site-nav" aria-label="Pages">
            <NavLink to="/" end>
              Guide
            </NavLink>
            <NavLink to="/architecture">Architecture</NavLink>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Guide />} />
            <Route path="/architecture" element={<Architecture />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  )
}
