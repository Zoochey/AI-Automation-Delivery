import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { OperatingModelPage } from './pages/OperatingModelPage.tsx'
import { DataStandardPage } from './pages/DataStandardPage.tsx'
import { UseCaseStandardPage } from './pages/UseCaseStandardPage.tsx'
import { AutomationStandardPage } from './pages/AutomationStandardPage.tsx'
import { SolutionDesignPage } from './pages/SolutionDesignPage.tsx'
import { GovernancePage } from './pages/GovernancePage.tsx'
import { DefinitionsPage } from './pages/DefinitionsPage.tsx'
import { VisualFlowPage } from './pages/VisualFlowPage.tsx'
import { BusinessProcessFlowsPage } from './pages/BusinessProcessFlowsPage.tsx'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="operating-model" element={<OperatingModelPage />} />
        <Route path="standards/data" element={<DataStandardPage />} />
        <Route path="standards/use-case" element={<UseCaseStandardPage />} />
        <Route path="standards/automation" element={<AutomationStandardPage />} />
        <Route path="standards/solution-design" element={<SolutionDesignPage />} />
        <Route path="standards/governance" element={<GovernancePage />} />
        <Route path="standards/definitions" element={<DefinitionsPage />} />
        <Route
          path="business-process-flows"
          element={<BusinessProcessFlowsPage />}
        />
        <Route path="appendix/visual-flow" element={<VisualFlowPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
