#!/usr/bin/env node
/**
 * scripts/clear-games.js
 *
 * Wipes all played-game data from Firestore. Keeps the `players` collection.
 *
 * Collections cleared:
 *   - games         (analytics log of every match)
 *   - leaderboards  (top-10 per difficulty)
 *   - savedGames    (in-progress games)
 *
 * Setup (one-time):
 *   1. npm install --no-save firebase-admin
 *   2. Firebase Console → Project Settings → Service accounts →
 *      "Generate new private key" → save as ./service-account.json
 *   3. export GOOGLE_APPLICATION_CREDENTIALS="$PWD/service-account.json"
 *
 * Run:
 *   node scripts/clear-games.js          # asks for confirmation
 *   node scripts/clear-games.js --yes    # skip prompt
 */

import { initializeApp, applicationDefault } from 'firebase-admin/app'
import { getFirestore }                      from 'firebase-admin/firestore'
import readline                              from 'node:readline/promises'
import { stdin as input, stdout as output }  from 'node:process'

const PROJECT_ID  = 'caaf-game'
const COLLECTIONS = ['games', 'leaderboards', 'savedGames']
const BATCH_SIZE  = 200

initializeApp({ credential: applicationDefault(), projectId: PROJECT_ID })
const db = getFirestore()

async function deleteCollection(name) {
  const ref   = db.collection(name)
  let total = 0
  while (true) {
    const snap = await ref.limit(BATCH_SIZE).get()
    if (snap.empty) break
    const batch = db.batch()
    snap.docs.forEach((d) => batch.delete(d.ref))
    await batch.commit()
    total += snap.size
    process.stdout.write(`  ${name}: ${total} deleted\r`)
  }
  process.stdout.write(`  ${name.padEnd(13)} ${total} docs deleted ✓\n`)
  return total
}

async function main() {
  const skipPrompt = process.argv.includes('--yes')

  console.log(`\n🔥 Firestore wipe — project: ${PROJECT_ID}`)
  console.log(`   Collections: ${COLLECTIONS.join(', ')}`)
  console.log(`   Preserved:   players\n`)

  if (!skipPrompt) {
    const rl  = readline.createInterface({ input, output })
    const ans = await rl.question('Type "DELETE" to confirm: ')
    rl.close()
    if (ans.trim() !== 'DELETE') {
      console.log('Aborted.')
      process.exit(0)
    }
  }

  let total = 0
  for (const name of COLLECTIONS) total += await deleteCollection(name)
  console.log(`\nDone. ${total} documents removed.\n`)
}

main().catch((err) => {
  console.error('\nFailed:', err.message)
  process.exit(1)
})
