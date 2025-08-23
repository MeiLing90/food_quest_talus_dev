const fs = require('fs').promises
const path = require('path')

const DATA_PATH = path.join(__dirname, '..', 'data', 'quests.json')

async function readQuests() {
    const raw = await fs.readFile(DATA_PATH, 'utf-8')
    const json = JSON.parse(raw)
    return json.items || []
}

async function writeQuests(items) {
    const data = { items }
    const tmp = DATA_PATH + '.tmp'
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf-8')
    // atomic replace
    await fs.rename(tmp, DATA_PATH)
    return items
}

async function updateQuestProgress(id, progress) {
    const items = await readQuests()
    const idx = items.findIndex(q => q.id === id)
    if (idx === -1) return null
    const next = Math.max(0, Math.min(100, progress))
    items[idx].progress = next
    items[idx].status = next >= 100 ? 'done' : (next > 0 ? 'in-progress' : 'not-started')
    await writeQuests(items)
    return items[idx]
}

/**
 * Prototype rule: when a recipe is cooked and it has e.g. 'veggie' tag,
 * bump the first matching quest that shares any tag to at least 80%.
 */
async function applyRecipeCooked({ recipeId, tags = [] }) {
    const items = await readQuests()
    const lowerTags = new Set(tags.map(t => String(t).toLowerCase()))
    let updated = []

    for (const q of items) {
        const qTags = (q.tags || []).map(t => String(t).toLowerCase())
        const matches = qTags.some(t => lowerTags.has(t))
        if (!matches) continue
        if (q.status === 'done') continue

        const target = 80
        const next = Math.max(q.progress || 0, target)
        q.progress = Math.min(100, next)
        q.status = q.progress >= 100 ? 'done' : (q.progress > 0 ? 'in-progress' : 'not-started')
        updated.push({ id: q.id, progress: q.progress, status: q.status })
        // If you only want to update ONE quest per event, uncomment:
        // break
    }

    if (updated.length > 0) await writeQuests(items)
    return updated
}

module.exports = {
    readQuests,
    writeQuests,
    updateQuestProgress,
    applyRecipeCooked,
}
