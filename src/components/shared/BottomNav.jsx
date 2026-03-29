import { Layers, Trophy, Building2 } from 'lucide-react'
import { NavBar } from '../ui/NavBar'

const NAV_ITEMS = [
  { to: '/',            icon: Layers,    labelKey: 'nav.fields'  },
  { to: '/leaderboard', icon: Trophy,    labelKey: 'nav.trophy'  },
  { to: '/about',       icon: Building2, labelKey: 'nav.about'   },
]

export function BottomNav() {
  return <NavBar items={NAV_ITEMS} />
}
