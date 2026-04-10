import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? 'active' : undefined

export function Layout() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const stored = localStorage.getItem('framework-theme')
    const preferredDark = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches
    const nextTheme =
      stored === 'light' || stored === 'dark'
        ? stored
        : preferredDark
          ? 'dark'
          : 'light'

    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(nextTheme)
    document.documentElement.setAttribute('data-theme', nextTheme)
    localStorage.setItem('framework-theme', nextTheme)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Framework navigation">
        <div className="sidebar__brand">
          <h1>AI &amp; Automation Delivery Framework</h1>
          <p className="sidebar__meta">v1.0 · Draft</p>
          <button type="button" className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
        <nav>
          <ul className="nav-list">
            <li>
              <NavLink to="/" end className={navLinkClass}>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink to="/operating-model" className={navLinkClass}>
                Operating model
              </NavLink>
            </li>
            <li>
              <NavLink to="/business-process-flows" className={navLinkClass}>
                Business process flows
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/organizational-ownership"
                className={navLinkClass}
              >
                Org ownership (Syncfusion)
              </NavLink>
            </li>
            <li>
              <NavLink to="/portal/diagrams" className={navLinkClass}>
                Diagram repository
              </NavLink>
            </li>
            <li>
              <NavLink to="/portal/json-diagram" className={navLinkClass}>
                JSON → diagram
              </NavLink>
            </li>
            <li>
              <NavLink to="/portal/mermaid-diagram" className={navLinkClass}>
                Mermaid diagram
              </NavLink>
            </li>
          </ul>
          <div className="nav-section">
            <div className="nav-section__label">Core standards</div>
            <ul className="nav-list">
              <li>
                <NavLink to="/standards/data" className={navLinkClass}>
                  1. AI Data Standard
                </NavLink>
              </li>
              <li>
                <NavLink to="/standards/use-case" className={navLinkClass}>
                  2. AI Use Case Standard
                </NavLink>
              </li>
              <li>
                <NavLink to="/standards/automation" className={navLinkClass}>
                  3. Automation &amp; Integration
                </NavLink>
              </li>
              <li>
                <NavLink to="/standards/solution-design" className={navLinkClass}>
                  4. AI Solution Design
                </NavLink>
              </li>
              <li>
                <NavLink to="/standards/governance" className={navLinkClass}>
                  5. Governance &amp; Risk
                </NavLink>
              </li>
              <li>
                <NavLink to="/standards/definitions" className={navLinkClass}>
                  6. Definitions &amp; document control
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  )
}
