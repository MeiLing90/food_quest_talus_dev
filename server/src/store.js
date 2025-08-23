const fs = require('fs').promises
const path = require('path')

const QUESTS_PATH = path.join(__dirname, '..', 'data', 'quests.json')
const USER_PATH   = path.join(__dirname, '..', 'data', 'user.json')

// ---------- helpers ----------
async function readJson(p, fallback) {
    try { return JSON.parse(await fs.readFile(p, 'utf-8')) }
    catch { return fallback }
}
async function writeJson(p, data) {
    const tmp = p + '.tmp'
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
    await fs.rename(tmp, p)
}

// ---------- quests ----------
async function readQuests() {
    const data = await readJson(QUESTS_PATH, { items: [] })
    return data.items || []
}
async function writeQuests(items) {
    await writeJson(QUESTS_PATH, { items })
    return items
}

// ---------- user ----------
async function readUser() {
    const data = await readJson(USER_PATH, { id: 'demo', points: 0, completedQuestIds: [] })
    // ensure shape
    if (!Array.isArray(data.completedQuestIds)) data.completedQuestIds = []
    if (typeof data.points !== 'number') data.points = 0
    return data
}
async function writeUser(user) {
    await writeJson(USER_PATH, user)
    return user
}

// award points when a quest becomes "done" and hasn't been counted yet
async function awardIfNewlyCompleted(questId, reward) {
    const user = await readUser()
    if (user.completedQuestIds.includes(questId)) return user // already counted
    user.completedQuestIds.push(questId)
    user.points += Number(reward || 0)
    return await writeUser(user)
}

// ---------- operations ----------
async function updateQuestProgress(id, progress) {
    const items = await readQuests()
    const i = items.findIndex(q => String(q.id) === String(id))
    if (i === -1) return null

    const before = items[i]
    const prevDone = before.status === 'done'

    const next = Math.max(0, Math.min(100, Number(progress)))
    items[i] = { ...before,
        progress: next,
        status: next >= 100 ? 'done' : (next > 0 ? 'in-progress' : 'not-started')
    }

    await writeQuests(items)
    if (!prevDone && items[i].status === 'done') {
        await awardIfNewlyCompleted(items[i].id, items[i].reward)
    }
    return items[i]
}

/** Prototype rule for recipe cooked event:
 * bump matching quests (by tags) to at least target% and award points if they reach "done".
 */
function computeFromCount(q) {
    const target = Math.max(1, Number(q.targetCount || 1))
    const count = Math.max(0, Number(q.count || 0))
    const progress = Math.min(100, Math.round((count / target) * 100))
    const status = count >= target ? 'done' : (count > 0 ? 'in-progress' : 'not-started')
    return { progress, status }
}

/** Count-based: for each quest that shares at least one tag with the recipe, increment count by 1 */
async function applyRecipeCooked({ recipeId, tags = [] }) {
    const items = await readQuests()
    const user  = await readUser()

    const lower = new Set((tags || []).map(t => String(t).toLowerCase()))
    const updated = []
    let questsChanged = false
    let userChanged   = false

    for (const q of items) {
        const qtags = (q.tags || []).map(t => String(t).toLowerCase())
        const match = qtags.some(t => lower.has(t))   // ✅ at least one tag overlap
        if (!match) continue

        const target = Math.max(1, Number(q.targetCount || 1))
        const wasDone = (q.count || 0) >= target

        q.count = Math.max(0, Number(q.count || 0) + 1)      // increment count
        const { progress, status } = computeFromCount(q)
        q.progress = progress                                  // (optional, but handy)
        q.status   = status

        updated.push({ id: q.id, count: q.count, targetCount: q.targetCount, progress, status })
        questsChanged = true

        // Award points once, the first time it crosses to "done"
        if (!wasDone && q.count >= target) {
            if (!user.completedQuestIds.includes(q.id)) {
                user.completedQuestIds.push(q.id)
                user.points += Number(q.reward || 0)
                userChanged = true
            }
        }
    }

    if (questsChanged) await writeQuests(items)
    if (userChanged)   await writeUser(user)

    return { updated, user }
}

module.exports = {
    readUser,
    readQuests,
    writeQuests,
    updateQuestProgress, // keep if you still use it elsewhere
    applyRecipeCooked,
}