import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell }       from './components/shared/AppShell'
import HomePage           from './pages/Home'
import DifficultyPage     from './pages/Difficulty'
import GamePage           from './pages/Game'
import ResultsPage        from './pages/Results'
import SettingsPage       from './pages/Settings'
import AboutPage          from './pages/About'
import LeaderboardPage    from './pages/Leaderboard'
import PrivacyPage        from './pages/Privacy'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/"           element={<HomePage />}      />
          <Route path="/difficulty" element={<DifficultyPage />} />
          <Route path="/game"       element={<GamePage />}       />
          <Route path="/results"    element={<ResultsPage />}    />
          <Route path="/settings"     element={<SettingsPage />}    />
          <Route path="/about"        element={<AboutPage />}      />
          <Route path="/leaderboard"  element={<LeaderboardPage />} />
          <Route path="/privacy"      element={<PrivacyPage />}      />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
