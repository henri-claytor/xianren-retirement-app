import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import RetirementDiagnosis from './pages/RetirementDiagnosis'
import S1FinancialInput from './pages/S1FinancialInput'
import S2BucketOverview from './pages/S2BucketOverview'
import S3InflationSimulator from './pages/S3InflationSimulator'
import A1RetirementGoal from './pages/A1RetirementGoal'
import A2StressTest from './pages/A2StressTest'
import A3AssetAllocation from './pages/A3AssetAllocation'
import A4PeriodicTracking from './pages/A4PeriodicTracking'
import B1WithdrawalPlan from './pages/B1WithdrawalPlan'
import B2CashflowTimeline from './pages/B2CashflowTimeline'
import B3AlertThresholds from './pages/B3AlertThresholds'
import B4Rebalancing from './pages/B4Rebalancing'
import C1ContentFeed from './pages/C1ContentFeed'
import C2CommunityFeed from './pages/C2CommunityFeed'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="diagnosis" element={<RetirementDiagnosis />} />
          <Route path="s1" element={<S1FinancialInput />} />
          <Route path="s2" element={<S2BucketOverview />} />
          <Route path="s3" element={<S3InflationSimulator />} />
          <Route path="a1" element={<A1RetirementGoal />} />
          <Route path="a2" element={<A2StressTest />} />
          <Route path="a3" element={<A3AssetAllocation />} />
          <Route path="a4" element={<A4PeriodicTracking />} />
          <Route path="b1" element={<B1WithdrawalPlan />} />
          <Route path="b2" element={<B2CashflowTimeline />} />
          <Route path="b3" element={<B3AlertThresholds />} />
          <Route path="b4" element={<B4Rebalancing />} />
          <Route path="c1" element={<C1ContentFeed />} />
          <Route path="c2" element={<C2CommunityFeed />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
