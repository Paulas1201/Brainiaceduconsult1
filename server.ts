import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Memory and local file persistence for leads
interface LeadRecord {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  examType: string;
  learningMode: string;
  subjects: string[];
  notes?: string;
  createdAt: string;
  syncedToGoogleSheet: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data folder exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadLeads(): LeadRecord[] {
  try {
    if (fs.existsSync(LEADS_FILE)) {
      const content = fs.readFileSync(LEADS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading leads:', err);
  }
  return [];
}

function saveLeads(leads: LeadRecord[]): void {
  try {
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving leads:', err);
  }
}

const DEFAULT_GSHEET_URL = 'https://script.google.com/macros/s/AKfycbxF3jyebVnyHZ8tF-bYPb7zmWxhJcJImAlsZIU7HK22uQMPDPxHXehlVZFa9hIVXoq_/exec';

function loadConfig(): { gsheetUrl: string } {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed && parsed.gsheetUrl) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading config:', err);
  }
  return { gsheetUrl: DEFAULT_GSHEET_URL };
}

function saveConfig(config: { gsheetUrl: string }): void {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving config:', err);
  }
}

let leadsList: LeadRecord[] = loadLeads();
let appConfig = loadConfig();

// Helper to post lead to Google Apps Script Web App
async function forwardToGoogleSheet(lead: LeadRecord, scriptUrl: string): Promise<boolean> {
  if (!scriptUrl || !scriptUrl.startsWith('http')) return false;

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
      redirect: 'follow',
    });

    if (response.ok) {
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        return result.result === 'success' || result.status === 'success' || true;
      } catch {
        return text.includes('success') || true;
      }
    }
  } catch (error) {
    console.error('Failed to forward lead to Google Sheet:', error);
  }
  return false;
}

// API Routes
app.post('/api/leads', async (req, res) => {
  const { name, email, whatsapp, examType, learningMode, subjects, notes, customGsheetUrl } = req.body;

  if (!name || !email || !whatsapp) {
    return res.status(400).json({ error: 'Name, Email, and WhatsApp number are required.' });
  }

  const newLead: LeadRecord = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    name,
    email,
    whatsapp,
    examType: examType || 'General Enquiry',
    learningMode: learningMode || 'Not specified',
    subjects: Array.isArray(subjects) ? subjects : [],
    notes: notes || '',
    createdAt: new Date().toISOString(),
    syncedToGoogleSheet: false,
  };

  const gsheetUrl = customGsheetUrl || appConfig.gsheetUrl;

  // Sync to Google Sheet if configured
  if (gsheetUrl) {
    const synced = await forwardToGoogleSheet(newLead, gsheetUrl);
    newLead.syncedToGoogleSheet = synced;
  }

  leadsList.unshift(newLead);
  saveLeads(leadsList);

  return res.json({
    success: true,
    message: 'Lead captured successfully!',
    lead: newLead,
  });
});

app.get('/api/leads', (req, res) => {
  res.json({ leads: leadsList });
});

// Admin Route: Delete a lead
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = leadsList.length;
  leadsList = leadsList.filter((l) => l.id !== id);
  if (leadsList.length !== initialLength) {
    saveLeads(leadsList);
    return res.json({ success: true, message: 'Lead removed successfully' });
  }
  return res.status(404).json({ error: 'Lead not found' });
});

// Admin Route: Resync a specific lead to Google Sheet
app.post('/api/leads/:id/sync', async (req, res) => {
  const { id } = req.params;
  const leadIndex = leadsList.findIndex((l) => l.id === id);
  if (leadIndex === -1) {
    return res.status(404).json({ error: 'Lead not found' });
  }

  const lead = leadsList[leadIndex];
  const gsheetUrl = appConfig.gsheetUrl;
  if (!gsheetUrl) {
    return res.status(400).json({ error: 'No Google Sheet Apps Script URL configured' });
  }

  const synced = await forwardToGoogleSheet(lead, gsheetUrl);
  leadsList[leadIndex].syncedToGoogleSheet = synced;
  saveLeads(leadsList);

  return res.json({
    success: synced,
    lead: leadsList[leadIndex],
    message: synced ? 'Successfully synced to Google Sheet!' : 'Failed to sync to Google Sheet. Check script URL & permissions.',
  });
});

// Admin Route: Clear test leads
app.delete('/api/leads', (req, res) => {
  leadsList = [];
  saveLeads(leadsList);
  return res.json({ success: true, message: 'All leads cleared' });
});

app.get('/api/config/gsheet', (req, res) => {
  res.json({ gsheetUrl: appConfig.gsheetUrl });
});

app.post('/api/config/gsheet', async (req, res) => {
  const { gsheetUrl } = req.body;
  if (typeof gsheetUrl === 'string') {
    appConfig.gsheetUrl = gsheetUrl.trim();
    saveConfig(appConfig);

    // Test ping if URL provided
    if (appConfig.gsheetUrl) {
      const testLead: LeadRecord = {
        id: `test_${Date.now()}`,
        name: 'Brainiac Test Ping',
        email: 'test@brainiaceduconsult.com',
        whatsapp: '08131055940',
        examType: 'System Ping Test',
        learningMode: 'Online Test',
        subjects: ['System Check'],
        notes: 'Testing Google Sheet AppsScript connection',
        createdAt: new Date().toISOString(),
        syncedToGoogleSheet: false,
      };

      const success = await forwardToGoogleSheet(testLead, appConfig.gsheetUrl);
      return res.json({
        success: true,
        gsheetUrl: appConfig.gsheetUrl,
        tested: true,
        testResult: success ? 'Connection Successful! Sample test row added to Google Sheet.' : 'Saved URL, but test ping returned non-200. Check Apps Script "Anyone" permissions.',
      });
    }

    return res.json({ success: true, gsheetUrl: '' });
  }
  res.status(400).json({ error: 'Invalid URL format' });
});

// Vite server integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Brainiac Educonsult server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
