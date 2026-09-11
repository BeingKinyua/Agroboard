import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Download, Eye, 
  Calendar, CheckCircle, ShieldCheck, Tag 
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Modal } from '../common/Modal';

interface DocItem {
  id: string;
  code: string;
  name: string;
  type: 'Tax Invoice' | 'Delivery Note' | 'Goods Receipt' | 'Compliance Cert' | 'Contract';
  relatedEntity: string;
  issueDate: string;
  fileSize: string;
  status: 'Verified' | 'Archived' | 'Active';
}

export const DocumentsModule: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<DocItem | null>(null);

  const docs: DocItem[] = [
    {
      id: 'doc-1',
      code: 'INV-2026-001',
      name: 'Commercial Tax Invoice - Nairobi Hospital',
      type: 'Tax Invoice',
      relatedEntity: 'The Nairobi Hospital',
      issueDate: '2026-03-01',
      fileSize: '240 KB (PDF)',
      status: 'Verified'
    },
    {
      id: 'doc-2',
      code: 'DN-2026-004',
      name: 'Signed Electronic Proof of Delivery (e-POD)',
      type: 'Delivery Note',
      relatedEntity: 'Peponi House Preparatory',
      issueDate: '2026-03-10',
      fileSize: '180 KB (Signed PDF)',
      status: 'Verified'
    },
    {
      id: 'doc-3',
      code: 'GRN-2026-001',
      name: 'Intake Inspection Sheet - Kinangop Farmers',
      type: 'Goods Receipt',
      relatedEntity: 'Kinangop Highland Co-op',
      issueDate: '2026-03-09',
      fileSize: '195 KB (PDF)',
      status: 'Verified'
    },
    {
      id: 'doc-4',
      code: 'KEPHIS-PHYTO-2026',
      name: 'Kenya Plant Health Inspectorate Service Phytosanitary Cert',
      type: 'Compliance Cert',
      relatedEntity: 'Agro-Deliveries Cold Hub 1',
      issueDate: '2026-01-15',
      fileSize: '1.2 MB (Official Stamp)',
      status: 'Active'
    },
    {
      id: 'doc-5',
      code: 'NCC-FOOD-HYGIENE',
      name: 'Nairobi City County Public Health Food Handling License',
      type: 'Compliance Cert',
      relatedEntity: 'All Vehicle Fleet & Handlers',
      issueDate: '2026-01-05',
      fileSize: '890 KB (PDF)',
      status: 'Active'
    }
  ];

  const filtered = docs.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      d.relatedEntity.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType === 'all' || d.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Enterprise Document Vault</h2>
          <p className="text-xs text-slate-500">Immutable store for tax invoices, signed delivery slips, KEPHIS inspection certs, and food hygiene licenses</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by code, customer, or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {['all', 'Tax Invoice', 'Delivery Note', 'Goods Receipt', 'Compliance Cert'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedType === type
                  ? 'bg-slate-900 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'all' ? 'All Documents' : type + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Document Title & Code</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Related Entity</th>
              <th className="p-3.5">Issue Date</th>
              <th className="p-3.5">File Size</th>
              <th className="p-3.5 text-center">Status</th>
              <th className="p-3.5 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(doc => (
              <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-3.5">
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{doc.name}</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 ml-5.5">{doc.code}</div>
                </td>
                <td className="p-3.5 text-slate-600">{doc.type}</td>
                <td className="p-3.5 font-medium text-slate-800">{doc.relatedEntity}</td>
                <td className="p-3.5 text-slate-500">{doc.issueDate}</td>
                <td className="p-3.5 text-slate-500 font-mono text-[11px]">{doc.fileSize}</td>
                <td className="p-3.5 text-center">
                  <Badge variant="success" size="sm">{doc.status}</Badge>
                </td>
                <td className="p-3.5 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
                      title="Inspect Document"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => alert(`Initiating secure download of ${doc.name}`)}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document View Modal */}
      {previewDoc && (
        <Modal
          isOpen={!!previewDoc}
          onClose={() => setPreviewDoc(null)}
          title={previewDoc.name}
          subtitle={`Vault Document ID: ${previewDoc.code} · ${previewDoc.type}`}
          maxWidth="2xl"
        >
          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-900">{previewDoc.name}</h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Cryptographically verified official record stored in Agro-Deliveries Ke. secure cloud archives.
            </p>
            <div className="pt-2 text-xs font-mono text-slate-500">
              SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
