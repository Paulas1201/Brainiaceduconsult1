import React, { useState, useEffect } from 'react';
import { Lead } from '../types';
import { X, Download, Database, Search, RefreshCw, CheckCircle2, MessageSquare, Phone } from 'lucide-react';
import { getWhatsAppLink, getPhoneCallLink } from '../utils/whatsapp';

interface LeadsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LeadsDashboardModal: React.FC<LeadsDashboardModalProps> = ({ isOpen, onClose }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = () => {
    setLoading(true);
    fetch('/api/leads')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.leads)) {
          setLeads(data.leads);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      fetchLeads();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.whatsapp.includes(searchTerm) ||
    l.examType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Name', 'Email', 'WhatsApp', 'Exam', 'Learning Mode', 'Subjects', 'Notes', 'Timestamp'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.email.replace(/"/g, '""')}"`,
      `"${l.whatsapp}"`,
      `"${l.examType}"`,
      `"${l.learningMode}"`,
      `"${l.subjects.join(', ')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header */}
        <div className="p-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Captured Leads Dashboard</h3>
              <p className="text-xs text-amber-400">Total Records: {leads.length}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLeads}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Leads"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by name, email, phone, or exam type..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Table */}
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-slate-800">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Candidate</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Exam & Mode</th>
                    <th className="p-3">Subjects</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold text-white">
                        <div>{lead.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{lead.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-amber-400 font-mono font-semibold">{lead.whatsapp}</span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-bold text-[10px] block w-fit mb-0.5">
                          {lead.examType}
                        </span>
                        <span className="text-[10px] text-slate-400">{lead.learningMode}</span>
                      </td>
                      <td className="p-3 max-w-xs truncate text-[11px]">
                        {lead.subjects.join(', ')}
                      </td>
                      <td className="p-3 text-[10px] text-slate-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={getWhatsAppLink(lead.whatsapp, `Hello ${lead.name}! Following up on your Brainiac Educonsult registration.`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 hover:bg-emerald-900"
                            title="WhatsApp Candidate"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={getPhoneCallLink(lead.whatsapp)}
                            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700"
                            title="Call Candidate"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500 text-sm">
              No leads recorded yet. Submissions from the sales page form will appear here automatically!
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
