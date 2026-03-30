import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppShell }       from './components/shared/AppShell'
import HomePage           from './pages/Home'
import DifficultyPage     from './pages/Difficulty'
import GamePage           from './pages/Game'
import ResultsPage        from './pages/Results'
import SettingsPage       from './pages/Settings'
import AboutPage          from './pages/About'
import LeaderboardPage    from './pages/Leaderboard'
import PrivacyPage        from './pages/Privacy'

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/',            element: <HomePage />        },
      { path: '/difficulty',  element: <DifficultyPage />  },
      { path: '/game',        element: <GamePage />         },
      { path: '/results',     element: <ResultsPage />      },
      { path: '/settings',    element: <SettingsPage />     },
      { path: '/about',       element: <AboutPage />        },
      { path: '/leaderboard', element: <LeaderboardPage />  },
      { path: '/privacy',     element: <PrivacyPage />      },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
