import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'glossary.json');

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(DATA_FILE);
  } catch (e) {
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf8');
  }
}

async function readGlossary() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, 'utf8');
  try { return JSON.parse(content || '[]'); } catch { return []; }
}

async function writeGlossary(arr) {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/glossary', async (req, res) => {
  try {
    const g = await readGlossary();
    res.json(g);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Replace entire glossary
app.put('/api/glossary', async (req, res) => {
  const body = req.body;
  if (!Array.isArray(body)) return res.status(400).json({ error: 'Expected array' });
  try {
    await writeGlossary(body);
    res.json({ ok: true, count: body.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Merge array of items into existing (by term)
app.post('/api/glossary/merge', async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected array' });
  try {
    const existing = await readGlossary();
    const byTerm = new Map(existing.map(i => [i.term, i]));
    for (const it of items) {
      if (it && it.term) byTerm.set(it.term, it);
    }
    const merged = Array.from(byTerm.values());
    await writeGlossary(merged);
    res.json(merged);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add single term
app.post('/api/glossary/term', async (req, res) => {
  const term = req.body;
  if (!term || !term.term) return res.status(400).json({ error: 'Missing term' });
  try {
    const existing = await readGlossary();
    existing.push(term);
    await writeGlossary(existing);
    res.status(201).json(term);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Delete by term (term URL encoded)
app.delete('/api/glossary/term/:term', async (req, res) => {
  const termParam = decodeURIComponent(req.params.term);
  try {
    let g = await readGlossary();
    const lenBefore = g.length;
    g = g.filter(i => i.term !== termParam);
    await writeGlossary(g);
    res.json({ deleted: lenBefore - g.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Glossary server listening on http://localhost:${port}`));
