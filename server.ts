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
  lastSyncMessage?: string;
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

interface SyncResult {
  success: boolean;
  message: string;
  row?: number;
  statusCode?: number;
}

// Resilient helper to post lead to Google Apps Script Web App
async function forwardToGoogleSheet(lead: LeadRecord, scriptUrl: string): Promise<SyncResult> {
  const url = (scriptUrl || '').trim();
  if (!url) {
    return { success: false, message: 'Google Apps Script URL is empty.' };
  }

  // Detect if user mistakenly gave a spreadsheet link
  if (url.includes('docs.google.com/spreadsheets')) {
    return {
      success: false,
      message: 'You entered a Google Sheet spreadsheet link instead of an Apps Script Web App URL. Please deploy your Google Apps Script as a Web App (ending in /exec).',
    };
  }

  if (!url.startsWith('http')) {
    return { success: false, message: 'Invalid URL format. URL must start with https://' };
  }

  // Attempt 1: Direct POST with text/plain (avoids CORS preflight failures on Google Apps Script)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(lead),
      redirect: 'follow',
    });

    const finalUrl = response.url || '';
    if (finalUrl.includes('accounts.google.com') || finalUrl.includes('ServiceLogin')) {
      return {
        success: false,
        statusCode: response.status,
        message: 'Google Apps Script redirected to login. In your Apps Script deployment settings, set "Who has access" to "Anyone".',
      };
    }

    if (response.ok) {
      const text = await response.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed.result === 'success' || parsed.status === 'success') {
          return { success: true, message: parsed.message || 'Row added to Google Sheet', row: parsed.row };
        }
      } catch {
        if (text.includes('success')) {
          return { success: true, message: 'Successfully recorded in Google Sheet' };
        }
      }
    }
  } catch (error: any) {
    console.error('POST to Google Sheet failed:', error?.message || error);
  }

  // Attempt 2: Fallback to GET with URL-encoded query parameters
  try {
    const params = new URLSearchParams({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      whatsapp: lead.whatsapp,
      examType: lead.examType,
      learningMode: lead.learningMode,
      subjects: Array.isArray(lead.subjects) ? lead.subjects.join(', ') : String(lead.subjects),
      notes: lead.notes || '',
      createdAt: lead.createdAt,
    });

    const fallbackUrl = url.includes('?') ? `${url}&${params.toString()}` : `${url}?${params.toString()}`;
    const getResponse = await fetch(fallbackUrl, {
      method: 'GET',
      redirect: 'follow',
    });

    const getFinalUrl = getResponse.url || '';
    if (getFinalUrl.includes('accounts.google.com') || getFinalUrl.includes('ServiceLogin')) {
      return {
        success: false,
        statusCode: getResponse.status,
        message: 'Google Apps Script requires "Who has access" set to "Anyone".',
      };
    }

    if (getResponse.ok) {
      const text = await getResponse.text();
      try {
        const parsed = JSON.parse(text);
        if (parsed.result === 'success' || parsed.status === 'success') {
          return { success: true, message: 'Saved to Google Sheet via GET fallback', row: parsed.row };
        }
      } catch {
        if (text.includes('success')) {
          return { success: true, message: 'Saved to Google Sheet' };
        }
      }
    }
  } catch (getErr: any) {
    console.error('GET fallback to Google Sheet failed:', getErr?.message || getErr);
  }

  return {
    success: false,
    message: 'Could not write to Google Sheet. Check your Web App deployment URL and ensure "Who has access" is set to "Anyone".',
  };
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
    const syncRes = await forwardToGoogleSheet(newLead, gsheetUrl);
    newLead.syncedToGoogleSheet = syncRes.success;
    newLead.lastSyncMessage = syncRes.message;
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
    return res.status(400).json({ error: 'No Google Sheet Apps Script URL configured in settings' });
  }

  const syncRes = await forwardToGoogleSheet(lead, gsheetUrl);
  leadsList[leadIndex].syncedToGoogleSheet = syncRes.success;
  leadsList[leadIndex].lastSyncMessage = syncRes.message;
  saveLeads(leadsList);

  return res.json({
    success: syncRes.success,
    lead: leadsList[leadIndex],
    message: syncRes.message,
    row: syncRes.row,
  });
});

// Admin Route: Sync ALL unsynced leads to Google Sheet in batch
app.post('/api/leads/sync-all', async (req, res) => {
  const gsheetUrl = appConfig.gsheetUrl;
  if (!gsheetUrl) {
    return res.status(400).json({ error: 'No Google Sheet Apps Script URL configured in settings' });
  }

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < leadsList.length; i++) {
    if (!leadsList[i].syncedToGoogleSheet) {
      const syncRes = await forwardToGoogleSheet(leadsList[i], gsheetUrl);
      if (syncRes.success) {
        leadsList[i].syncedToGoogleSheet = true;
        leadsList[i].lastSyncMessage = syncRes.message;
        successCount++;
      } else {
        leadsList[i].lastSyncMessage = syncRes.message;
        failCount++;
      }
    }
  }

  saveLeads(leadsList);

  return res.json({
    success: true,
    syncedCount: successCount,
    failedCount: failCount,
    total: leadsList.length,
    leads: leadsList,
    message: `Batch sync complete: ${successCount} leads synced successfully${failCount > 0 ? `, ${failCount} failed` : ''}.`,
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

// Test any GSheet URL endpoint
app.post('/api/config/gsheet/test', async (req, res) => {
  const { gsheetUrl } = req.body;
  const targetUrl = (gsheetUrl || appConfig.gsheetUrl || '').trim();

  if (!targetUrl) {
    return res.status(400).json({ success: false, message: 'No Google Apps Script URL provided.' });
  }

  const sampleLead: LeadRecord = {
    id: `ping_${Date.now()}`,
    name: 'Brainiac Test Ping',
    email: 'test@brainiaceduconsult.com',
    whatsapp: '+2348131055940',
    examType: 'Diagnostic Check',
    learningMode: 'Online Verification',
    subjects: ['Integration Test'],
    notes: 'Google Apps Script connection verification ping',
    createdAt: new Date().toISOString(),
    syncedToGoogleSheet: false,
  };

  const syncRes = await forwardToGoogleSheet(sampleLead, targetUrl);
  return res.json({
    success: syncRes.success,
    message: syncRes.message,
    row: syncRes.row,
    statusCode: syncRes.statusCode,
  });
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
        whatsapp: '+2348131055940',
        examType: 'System Ping Test',
        learningMode: 'Online Test',
        subjects: ['System Check'],
        notes: 'Testing Google Sheet AppsScript connection',
        createdAt: new Date().toISOString(),
        syncedToGoogleSheet: false,
      };

      const syncRes = await forwardToGoogleSheet(testLead, appConfig.gsheetUrl);
      return res.json({
        success: true,
        gsheetUrl: appConfig.gsheetUrl,
        tested: true,
        testResult: syncRes.success
          ? `Connection Successful! Sample test row added to Google Sheet (Row ${syncRes.row || 'appended'}).`
          : `URL saved, but test ping returned: ${syncRes.message}`,
        syncSuccess: syncRes.success,
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
