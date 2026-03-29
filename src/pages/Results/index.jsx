import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Share2 } from 'lucide-react'
import { ResultState }           from './ResultState'
import { Button }                from '../../components/ui/Button'
import { Card }                  from '../../components/ui/Card'
import { Text }                  from '../../components/ui/Typography'
import { recordGame }            from '../../services/statsService'
import { checkAndGrantMedals }   from '../../services/achievementService'
import { saveScore }             from '../../services/scoreService'
import { getLocalProfile }       from '../../services/profileService'
import { trackGame, trackShare } from '../../services/analyticsService'
import { showAchievementToast }  from '../../components/ui/AchievementToast'
import { shareResult }           from '../../utils/shareResult'

function padTime(n) { return String(n).padStart(2, '0') }
function formatTime(s) { return `${padTime(Math.floor(s / 60))}:${padTime(s % 60)}` }

function StatCell({ label, value, highlight }) {
  return (
    <Card
      elevation="low"
      className={[
        'p-5 flex flex-col gap-1',
        highlight ? 'bg-[var(--color-secondary-container)]/30' : '',
      ].join(' ')}
    >
      <Text scale="label-md" color="muted">{label}</Text>
      <Text
        scale="headline-md"
        className={highlight ? 'text-[var(--color-secondary)]' : 'text-[var(--color-primary)]'}
      >
        {value}
      </Text>
    </Card>
  )
}

export default function ResultsPage() {
  const navigate       = useNavigate()
  const { state }      = useLocation()
  const { t, i18n }   = useTranslation()
  const savedRef       = useRef(false)
  const gameIdRef      = useRef(null)   // stable gameId for analytics
  const [sharing, setSharing] = useState(false)

  const outcome        = state?.outcome        ?? 'win'
  const difficulty     = state?.difficulty     ?? 'medium'
  const elapsed        = state?.elapsed        ?? 0
  const failedAttempts = state?.failedAttempts ?? 0
  const score          = state?.score          ?? 0
  const isWin          = outcome === 'win'

  // ── On-mount: log analytics, save leaderboard score, check medals ─────────
  useEffect(() => {
    if (savedRef.current) return
    savedRef.current = true

    const profile      = getLocalProfile()
    const updatedStats = recordGame(outcome, difficulty, elapsed)

    // Log game to Firestore /games collection
    gameIdRef.current = trackGame({
      playerId:      profile?.playerId  ?? 'anon',
      playerName:    profile?.name      ?? '',
      iconKey:       profile?.iconKey   ?? '',
      difficulty,
      outcome,
      score,
      elapsed,
      failedAttempts,
    })

    if (isWin && profile) {
      saveScore({
        playerId:   profile.playerId,
        playerName: profile.name,
        iconKey:    profile.iconKey,
        difficulty,
        points:     score,
      }).then((rank) => {
        const newMedals = checkAndGrantMedals({ ...updatedStats, leaderboardRank: rank })
        newMedals.forEach((medal) => showAchievementToast(medal))
      })
    } else {
      const newMedals = checkAndGrantMedals(updatedStats)
      newMedals.forEach((medal) => showAchievementToast(medal))
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Share handler ─────────────────────────────────────────────────────────
  async function handleShare() {
    const profile = getLocalProfile()
    setSharing(true)

    // Determine share method: native Web Share API or canvas download fallback
    const testFile = new File([], 'test.png', { type: 'image/png' })
    const via      = navigator.canShare?.({ files: [testFile] }) ? 'native' : 'download'

    try {
      await shareResult({
        outcome,
        difficulty,
        score,
        elapsed,
        failedAttempts,
        playerName:      profile?.name ?? '',
        difficultyLabel: t(`difficulty.${difficulty}.label`),
        scoreLabel:      t('results.score'),
        timeLabel:       t('results.timeElapsed'),
        errorsLabel:     t('results.failedAttempts'),
        winTitle:        t('results.win.title'),
        loseTitle:       t('results.lose.title'),
        lang:            i18n.language,
      })
      // Only track after successful share (not cancelled)
      trackShare(gameIdRef.current, via)
    } catch {
      // share failed or cancelled — no UI error needed
    } finally {
      setSharing(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto w-full">

      <div className="md:grid md:grid-cols-2 md:gap-8 md:items-start">

        {/* Left: hero image + title */}
        <ResultState outcome={outcome} />

        {/* Right: stats + actions */}
        <div className="flex flex-col gap-4 md:pt-4">

          {/* Score — win only */}
          {isWin && (
            <Card elevation="low" className="p-5 flex flex-col gap-1 bg-[var(--color-secondary-container)]/30">
              <Text scale="label-md" color="muted">{t('results.score')}</Text>
              <div className="flex items-baseline gap-1.5">
                <Text
                  scale="display-sm"
                  className="text-[var(--color-secondary)] font-headline font-black leading-none"
                >
                  {score.toLocaleString()}
                </Text>
                <Text scale="body-md" color="muted">pts</Text>
              </div>
            </Card>
          )}

          {/* Elapsed time + Errors */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <StatCell
              label={t('results.timeElapsed')}
              value={formatTime(elapsed)}
              highlight={false}
            />
            <StatCell
              label={t('results.failedAttempts')}
              value={String(failedAttempts).padStart(2, '0')}
              highlight={isWin}
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center cursor-pointer"
              onClick={() => navigate('/difficulty')}
            >
              {isWin ? t('results.win.cta') : t('results.lose.cta')}
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="w-full justify-center cursor-pointer"
              onClick={handleShare}
              disabled={sharing}
            >
              <Share2 size={16} />
              {sharing ? t('results.share.preparing') : t('results.share.cta')}
            </Button>

            {!isWin && (
              <Button
                variant="tertiary"
                size="md"
                className="w-full justify-center cursor-pointer"
                onClick={() => navigate('/')}
              >
                {t('results.lose.back')}
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
