import React, { useState, useEffect } from 'react';
import { GOOGLE_APPS_SCRIPT_CODE, getStoredScriptUrl, saveStoredScriptUrl } from '../utils/googleScript';
import { X, Copy, Check, Table, Send, CheckCircle2, AlertTriangle, ExternalLink, RefreshCw, FileSpreadsheet } from 'lucide-react';

interface GoogleSheetGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleSheetGuideModal: React.FC<GoogleSheetGuideModalProps> = ({ isOpen, onClose }) => {
  const [webAppUrl, setWebAppUrl] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testMessage, setTestMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // fetch config from server
      fetch('/api/config/gsheet')
        .then((res) => res.json())
        .then((data) => {
          if (data.gsheetUrl) {
            setWebAppUrl(data.gsheetUrl);
          } else {
            setWebAppUrl(getStoredScriptUrl());
          }
        })
        .catch(() => {
          setWebAppUrl(getStoredScriptUrl());
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSaveAndTest = async () => {
    if (!webAppUrl.trim()) {
      alert('Please enter a Google Apps Script Web App URL.');
      return;
    }

    setIsTesting(true);
    setTestMessage(null);

    // Save locally
    saveStoredScriptUrl(webAppUrl);

    try {
      const response = await fetch('/api/config/gsheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gsheetUrl: webAppUrl.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setTestMessage({
          text: data.testResult || 'Web App URL saved and verified successfully!',
          isError: !data.tested,
        });
      } else {
        setTestMessage({ text: data.error || 'Failed to save URL', isError: true });
      }
    } catch (err: any) {
      setTestMessage({
        text: 'Error connecting to endpoint. Ensure Apps Script access is set to "Anyone".',
        isError: true,
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Table className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Google Sheet Lead Sync Guide</h3>
              <p className="text-xs text-slate-400">Automated Lead Collection Setup</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Step 1: Web App URL Input & Test */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                Active Google Web App Integration URL
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={webAppUrl}
                onChange={(e) => setWebAppUrl(e.target.value)}
                placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:border-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleSaveAndTest}
                disabled={isTesting}
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shrink-0"
              >
                {isTesting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Save & Test Ping</span>
              </button>
            </div>

            {testMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                  testMessage.isError
                    ? 'bg-rose-950/60 border border-rose-800 text-rose-300'
                    : 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                }`}
              >
                {testMessage.isError ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                <span>{testMessage.text}</span>
              </div>
            )}
          </div>

          {/* Step 2: Code Snippet box with copy button */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">1</span>
                <span>Copy Google Apps Script Code (`code.gs`)</span>
              </h4>
              <button
                onClick={handleCopyCode}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-amber-500/30"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy Script Code'}</span>
              </button>
            </div>

            <div className="relative rounded-2xl bg-slate-950 border border-slate-800 p-4 max-h-56 overflow-y-auto text-[11px] font-mono text-slate-300 leading-relaxed">
              <pre>{GOOGLE_APPS_SCRIPT_CODE}</pre>
            </div>
          </div>

          {/* Step 3: Instructions List */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs flex items-center justify-center font-bold">2</span>
              <span>1-Minute Setup Instructions</span>
            </h4>

            <ol className="space-y-2 text-xs text-slate-300 pl-8 list-decimal">
              <li>
                Open your target Google Sheet (or create a new blank Google Sheet).
              </li>
              <li>
                Click <strong className="text-white">Extensions</strong> → <strong className="text-white">Apps Script</strong> in the Google Sheet top navigation bar.
              </li>
              <li>
                Delete any pre-filled code in the script editor and <strong className="text-amber-400">paste the copied code above</strong>.
              </li>
              <li>
                Click <strong className="text-white">Deploy</strong> → <strong className="text-white">New deployment</strong>.
              </li>
              <li>
                Click the Gear icon next to "Select type" and choose <strong className="text-white">Web app</strong>.
              </li>
              <li>
                Under <strong className="text-white">Who has access</strong>, select <strong className="text-emerald-400">"Anyone"</strong> (This is required so leads post seamlessly without auth popups!).
              </li>
              <li>
                Click <strong className="text-white">Deploy</strong>, grant permissions, and copy the generated <strong className="text-amber-400">Web App URL</strong>.
              </li>
              <li>
                Paste the Web App URL into the box at the top of this modal and click <strong className="text-emerald-400">"Save & Test Ping"</strong>!
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
