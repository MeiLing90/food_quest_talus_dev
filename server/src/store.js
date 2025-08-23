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
async function applyRecipeCooked({ recipeId, tags = [], target = 80 }) {
    const items = await readQuests()
    const lower = new Set(tags.map(t => String(t).toLowerCase()))
    const updated = []

    for (const q of items) {
        const qtags = (q.tags || []).map(t => String(t).toLowerCase())
        const match = qtags.some(t => lower.has(t))
        if (!match) continue

        const wasDone = q.status === 'done'
        q.progress = Math.max(q.progress || 0, target)
        q.status = q.progress >= 100 ? 'done' : (q.progress > 0 ? 'in-progress' : 'not-started')
        updated.push({ id: q.id, progress: q.progress, status: q.status })

        if (!wasDone && q.status === 'done') {
            await awardIfNewlyCompleted(q.id, q.reward)
        }
    }
    if (updated.length) await writeQuests(items)
    return updated
}

module.exports = {
    readUser,
    readQuests,
    writeQuests,
    updateQuestProgress,
    applyRecipeCooked,
}
