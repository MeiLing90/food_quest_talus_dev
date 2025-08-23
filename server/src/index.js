const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- API routes ---
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, timestamp: new Date().toISOString() });
});

app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello from Express API 👋' });
});

const { readQuests, updateQuestProgress, applyRecipeCooked } = require('./store')

// List quests from JSON
app.get('/api/quests', async (_req, res) => {
  try {
    const items = await readQuests()
    res.json({ items })
  } catch (e) {
    res.status(500).json({ error: 'Failed to read quests' })
  }
})

// Directly set progress for a quest (useful for quick prototyping)
app.post('/api/quests/:id/progress', async (req, res) => {
  const { id } = req.params
  const { progress } = req.body || {}
  if (typeof progress !== 'number') return res.status(400).json({ error: 'progress (number) required' })
  const q = await updateQuestProgress(id, progress)
  if (!q) return res.status(404).json({ error: 'quest not found' })
  res.json(q)
})

// Event: a recipe was cooked -> update relevant quests
app.post('/api/events/recipe-cooked', async (req, res) => {
  const { recipeId, tags } = req.body || {}
  if (!Array.isArray(tags)) return res.status(400).json({ error: 'tags (array) required' })
  try {
    const updated = await applyRecipeCooked({ recipeId, tags })
    res.json({ updated })
  } catch (e) {
    res.status(500).json({ error: 'failed to apply event' })
  }
})

const fs = require('fs').promises;
const path = require('path');

app.get('/api/food', async (_req, res) => {
  try {
    const file = path.join(__dirname, '..', 'data', 'food.json');
    const raw = await fs.readFile(file, 'utf-8');
    res.setHeader('Content-Type', 'application/json');
    res.send(raw); // send as-is to avoid extra parse/stringify
  } catch (e) {
    res.status(500).json({ error: 'Failed to load food data' });
  }
});

// --- Static (production) ---
const publicDir = path.join(__dirname, '..', 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  // SPA fallback to index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(publicDir, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

