import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import {
  Database,
  Table,
  Search,
  RefreshCw,
  Download,
  Trash2,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Send,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { getWhatsAppLink, getPhoneCallLink } from '../utils/whatsapp';
import { GOOGLE_APPS_SCRIPT_CODE, getStoredScriptUrl, saveStoredScriptUrl } from '../utils/googleScript';
import { COMPANY_INFO } from '../data/copyData';

interface AdminPortalProps {
  onBackToWebsite: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToWebsite }) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'gsheet' | 'test'>('leads');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState<string>('ALL');
  const [filterSync, setFilterSync] = useState<'ALL' | 'SYNCED' | 'UNSYNCED'>('ALL');

  // GSheet config states
  const [gsheetUrl, setGsheetUrl] = useState('');
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [syncTestStatus, setSyncTestStatus] = useState<string | null>(null);
  const [syncTestSuccess, setSyncTestSuccess] = useState<boolean | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  // Single lead action loading
  const [resyncingId, setResyncingId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Test form state
  const [testLeadName, setTestLeadName] = useState('Admin Live Test');
  const [testLeadPhone, setTestLeadPhone] = useState('08131055940');
  const [testLeadExam, setTestLeadExam] = useState('WAEC');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testResultMsg, setTestResultMsg] = useState<string | null>(null);

  // Load leads from server
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leads');
      const data = await res.json();
      if (Array.isArray(data.leads)) {
        setLeads(data.leads);
        if (data.leads.length > 0) {
          setLastSyncTime(new Date(data.leads[0].createdAt).toLocaleTimeString());
        }
      }
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load GSheet config from server
  const fetchGSheetConfig = async () => {
    try {
      const res = await fetch('/api/config/gsheet');
      const data = await res.json();
      if (data.gsheetUrl) {
        setGsheetUrl(data.gsheetUrl);
        saveStoredScriptUrl(data.gsheetUrl);
      } else {
        const local = getStoredScriptUrl();
        setGsheetUrl(local);
      }
    } catch (err) {
      console.error('Failed to fetch gsheet config:', err);
      const local = getStoredScriptUrl();
      setGsheetUrl(local);
    }
  };

  useEffect(() => {
    fetchLeads();
    fetchGSheetConfig();
  }, []);

  const handleSaveGSheetUrl = async () => {
    if (!gsheetUrl.trim()) {
      alert('Please enter a valid Google Apps Script Web App URL.');
      return;
    }

    setIsSavingUrl(true);
    setSyncTestStatus(null);
    setSyncTestSuccess(null);

    try {
      saveStoredScriptUrl(gsheetUrl.trim());
      const res = await fetch('/api/config/gsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gsheetUrl: gsheetUrl.trim() }),
      });
      const data = await res.json();

      if (data.tested) {
        setSyncTestSuccess(data.success && !data.testResult.includes('non-200'));
        setSyncTestStatus(data.testResult);
        setLastSyncTime(new Date().toLocaleTimeString());
      } else {
        setSyncTestSuccess(true);
        setSyncTestStatus('Script URL saved successfully in backend configuration.');
      }
      fetchLeads();
    } catch (err: any) {
      setSyncTestSuccess(false);
      setSyncTestStatus(`Error connecting to server: ${err.message}`);
    } finally {
      setIsSavingUrl(false);
    }
  };

  const handleResyncLead = async (leadId: string) => {
    setResyncingId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}/sync`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, syncedToGoogleSheet: true } : l))
        );
      } else {
        alert(data.message || 'Sync failed. Please verify your Google Apps Script Web App deployment.');
      }
    } catch (err) {
      console.error('Resync failed:', err);
      alert('Failed to connect to backend.');
    } finally {
      setResyncingId(null);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setLeads((prev) => prev.filter((l) => l.id !== leadId));
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSendTestLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSendingTest(true);
    setTestResultMsg(null);

    try {
      const payload = {
        name: testLeadName,
        email: 'test@brainiaceduconsult.com',
        whatsapp: testLeadPhone,
        examType: testLeadExam,
        learningMode: 'Live Online Classes',
        subjects: ['Mathematics', 'English Language', 'Physics'],
        notes: 'Admin manual test lead submission',
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setTestResultMsg(
          data.lead.syncedToGoogleSheet
            ? 'Test lead created AND successfully pushed to Google Sheet!'
            : 'Test lead created in local database, but Google Sheet sync returned false. Check your script permissions.'
        );
        fetchLeads();
      }
    } catch (err: any) {
      setTestResultMsg(`Test lead failed: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'WhatsApp', 'Exam', 'Learning Mode', 'Subjects', 'Notes', 'Google Sheet Synced', 'Timestamp'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.whatsapp}"`,
      `"${l.examType}"`,
      `"${l.learningMode}"`,
      `"${l.subjects.join(', ')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      l.syncedToGoogleSheet ? 'YES' : 'NO',
      `"${new Date(l.createdAt).toLocaleString()}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `brainiac_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesSearch =
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.whatsapp.includes(searchTerm) ||
      l.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesExam = filterExam === 'ALL' || l.examType.toLowerCase().includes(filterExam.toLowerCase());
    const matchesSync =
      filterSync === 'ALL'
        ? true
        : filterSync === 'SYNCED'
        ? l.syncedToGoogleSheet
        : !l.syncedToGoogleSheet;

    return matchesSearch && matchesExam && matchesSync;
  });

  const totalSynced = leads.filter((l) => l.syncedToGoogleSheet).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center gap-4">
              <button
                onClick={onBackToWebsite}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="Return to Public Sales Page"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Website</span>
              </button>

              <div className="h-6 w-px bg-slate-800 hidden sm:block" />

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg sm:text-xl text-white tracking-tight">
                    {COMPANY_INFO.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-amber-500/30">
                    Admin Portal
                  </span>
                </div>
                <p className="text-xs text-slate-400">Backend Lead Management & Google Sheet Integrations</p>
              </div>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={fetchLeads}
                disabled={loading}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-amber-400' : ''}`} />
              </button>

              <button
                onClick={handleExportCSV}
                disabled={leads.length === 0}
                className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

        {/* Status Metrics Ribbon */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Total Leads</span>
              <Database className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">{leads.length}</div>
            <p className="text-[11px] text-slate-500 mt-1">Student submissions captured</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Google Sheet Synced</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {totalSynced} <span className="text-xs text-slate-500 font-normal">/ {leads.length}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {leads.length > 0 ? `${Math.round((totalSynced / leads.length) * 100)}% auto-synced` : 'Awaiting entries'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Integration Status</span>
              <Table className="w-4 h-4 text-sky-400" />
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <div className={`w-2.5 h-2.5 rounded-full ${gsheetUrl ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
              <span className="text-sm font-bold text-white">
                {gsheetUrl ? 'Active Endpoint' : 'Not Connected'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 truncate">
              {gsheetUrl ? 'Script configured' : 'Configure below'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold mb-1">
              <span>Last Sync Attempt</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-white mt-1">
              {lastSyncTime || 'No recent activity'}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Real-time webhook sync</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 gap-2">
          <button
            onClick={() => setActiveTab('leads')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'leads'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Captured Student Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gsheet')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'gsheet'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Google Sheet Sync Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('test')}
            className={`pb-3 px-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'test'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Test Webhook Ping</span>
          </button>
        </div>

        {/* TAB 1: LEADS LIST */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            
            {/* Filter and Search Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
              
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads by name, email, phone, subjects..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <select
                  value={filterExam}
                  onChange={(e) => setFilterExam(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Exams</option>
                  <option value="WAEC">WAEC</option>
                  <option value="NECO">NECO</option>
                  <option value="JAMB">JAMB / UTME</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="JUPEB">JUPEB</option>
                  <option value="A-Level">A-Level</option>
                </select>

                <select
                  value={filterSync}
                  onChange={(e) => setFilterSync(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Sync States</option>
                  <option value="SYNCED">Synced to Google Sheet</option>
                  <option value="UNSYNCED">Unsynced / Pending</option>
                </select>
              </div>

            </div>

            {/* Leads Table */}
            {filteredLeads.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-3.5">Candidate Details</th>
                      <th className="p-3.5">Phone / WhatsApp</th>
                      <th className="p-3.5">Target Exam</th>
                      <th className="p-3.5">Learning Mode</th>
                      <th className="p-3.5">Subjects</th>
                      <th className="p-3.5">G-Sheet Status</th>
                      <th className="p-3.5">Captured Date</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-white text-sm">{lead.name}</div>
                          <div className="text-[11px] text-slate-400">{lead.email}</div>
                          {lead.notes && (
                            <div className="text-[10px] text-amber-300/80 italic mt-0.5 max-w-xs truncate">
                              "{lead.notes}"
                            </div>
                          )}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          <span className="font-mono font-bold text-amber-400 text-xs">{lead.whatsapp}</span>
                        </td>

                        <td className="p-3.5">
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs">
                            {lead.examType}
                          </span>
                        </td>

                        <td className="p-3.5 text-slate-300 text-xs whitespace-nowrap">
                          {lead.learningMode}
                        </td>

                        <td className="p-3.5 max-w-xs text-xs text-slate-300">
                          {lead.subjects && lead.subjects.length > 0 ? lead.subjects.join(', ') : 'Not selected'}
                        </td>

                        <td className="p-3.5 whitespace-nowrap">
                          {lead.syncedToGoogleSheet ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-400 text-xs font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Synced</span>
                            </span>
                          ) : (
                            <button
                              onClick={() => handleResyncLead(lead.id)}
                              disabled={resyncingId === lead.id}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800/50 text-amber-400 text-xs font-semibold transition-colors cursor-pointer"
                              title="Click to retry sending to Google Sheet"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${resyncingId === lead.id ? 'animate-spin' : ''}`} />
                              <span>{resyncingId === lead.id ? 'Syncing...' : 'Pending (Retry)'}</span>
                            </button>
                          )}
                        </td>

                        <td className="p-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                          {new Date(lead.createdAt).toLocaleString()}
                        </td>

                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* WhatsApp Direct */}
                            <a
                              href={getWhatsAppLink(lead.whatsapp, `Hello ${lead.name}! Thank you for reaching out to Brainiac Educonsult regarding ${lead.examType}. How can we assist your enrollment?`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/40 transition-colors"
                              title="Chat on WhatsApp"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </a>

                            {/* Direct Phone Call */}
                            <a
                              href={getPhoneCallLink(lead.whatsapp)}
                              className="p-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition-colors"
                              title="Call Student"
                            >
                              <Phone className="w-4 h-4" />
                            </a>

                            {/* Delete Lead */}
                            {deleteConfirmId === lead.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-[10px]"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmId(lead.id)}
                                className="p-2 rounded-xl bg-slate-800/60 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700/60 transition-colors"
                                title="Delete Lead"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <Database className="w-10 h-10 text-slate-600 mx-auto" />
                <h4 className="text-base font-bold text-white">No Leads Match Your Criteria</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {leads.length === 0
                    ? 'No leads have been captured yet. Submissions on the public landing page will appear here.'
                    : 'Try clearing your search query or adjusting your filters above.'}
                </p>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: GOOGLE SHEET SYNC SETTINGS */}
        {activeTab === 'gsheet' && (
          <div className="space-y-6">
            
            {/* Endpoint Setup Card */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <Table className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Google Apps Script Web App URL</h3>
                    <p className="text-xs text-slate-400">This URL receives leads instantly from both the server and browser</p>
                  </div>
                </div>

                {gsheetUrl && (
                  <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Configured</span>
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={gsheetUrl}
                    onChange={(e) => setGsheetUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs font-mono focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    onClick={handleSaveGSheetUrl}
                    disabled={isSavingUrl}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingUrl ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying & Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save & Test Connection</span>
                      </>
                    )}
                  </button>
                </div>

                {syncTestStatus && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                      syncTestSuccess
                        ? 'bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                        : 'bg-rose-950/60 border-rose-800/60 text-rose-300'
                    }`}
                  >
                    {syncTestSuccess ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="font-bold">{syncTestSuccess ? 'Connection Verified!' : 'Diagnostic Note:'}</div>
                      <div>{syncTestStatus}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Tutorial & Apps Script Code */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Instructions */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>How to deploy your Google Apps Script</span>
                </h4>

                <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
                  <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-white">Create Google Sheet:</strong> Open{' '}
                    <a href="https://sheets.new" target="_blank" rel="noreferrer" className="text-amber-400 underline">
                      sheets.new
                    </a>{' '}
                    and name it <em>Brainiac Educonsult Leads</em>.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-white">Open Apps Script:</strong> In your sheet menu, click{' '}
                    <span className="text-amber-400">Extensions &gt; Apps Script</span>.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-white">Paste Code:</strong> Erase any template code and paste the script shown on the right.
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-white">Deploy Web App:</strong> Click{' '}
                    <span className="text-amber-400 font-bold">Deploy &gt; New deployment</span>.
                    Select type: <span className="text-white font-semibold">Web App</span>.
                    <div className="mt-1 pl-4 text-[11px] text-amber-300">
                      • Execute as: <strong>Me (your email)</strong><br />
                      • Who has access: <strong>Anyone</strong> (CRITICAL)
                    </div>
                  </li>
                  <li className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                    <strong className="text-white">Authorize & Paste:</strong> Authorize permissions, copy the Web App URL (ends in <code>/exec</code>), and paste it into the field above.
                  </li>
                </ol>
              </div>

              {/* Code Snippet Box */}
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col">
                <div className="flex items-center justify-between">
                  <h4 className="text-base font-bold text-white">Google Apps Script Code (Code.gs)</h4>
                  <button
                    onClick={handleCopyScript}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Code'}</span>
                  </button>
                </div>

                <div className="flex-1 bg-slate-950 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-96 border border-slate-800 leading-relaxed">
                  <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 3: TEST LIVE WEBHOOK PING */}
        {activeTab === 'test' && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 max-w-2xl mx-auto space-y-6">
            <div>
              <h3 className="text-lg font-bold text-white">Send a Verification Lead</h3>
              <p className="text-xs text-slate-400 mt-1">
                This triggers the exact same backend pipeline as an actual student enrollment form submission.
              </p>
            </div>

            <form onSubmit={handleSendTestLead} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Candidate Name</label>
                <input
                  type="text"
                  value={testLeadName}
                  onChange={(e) => setTestLeadName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">WhatsApp Phone</label>
                  <input
                    type="text"
                    value={testLeadPhone}
                    onChange={(e) => setTestLeadPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">Exam Type</label>
                  <select
                    value={testLeadExam}
                    onChange={(e) => setTestLeadExam(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs cursor-pointer"
                  >
                    <option value="WAEC">WAEC</option>
                    <option value="NECO">NECO</option>
                    <option value="JAMB">JAMB</option>
                    <option value="IGCSE">IGCSE</option>
                    <option value="JUPEB">JUPEB</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSendingTest}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSendingTest ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Transmitting Test Payload...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Verification Test Lead</span>
                  </>
                )}
              </button>

              {testResultMsg && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-amber-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{testResultMsg}</span>
                </div>
              )}
            </form>
          </div>
        )}

      </main>
    </div>
  );
};
