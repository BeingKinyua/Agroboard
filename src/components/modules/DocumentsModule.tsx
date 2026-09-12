import React, { useState } from 'react';
import { 
  FileText, Search, Filter, Download, Eye, 
  Calendar, CheckCircle, ShieldCheck, Tag, Check, ArrowRight
} from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import { EmptyState } from '../common/EmptyState';

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
  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

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

  const handleDownload = (doc: DocItem) => {
    setDownloadNotification(`Encrypted download bundle generated for ${doc.code}`);
    setTimeout(() => setDownloadNotification(null), 3500);
  };

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Enterprise Page Header */}
      <PageHeader
        category="Compliance & Records Vault"
        title="Enterprise Document Vault"
        description="Immutable electronic store for commercial tax invoices, signed proof of deliveries (e-PODs), KEPHIS phytosanitary certs, and county food safety permits."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            {docs.length} Official Records
          </span>
        }
      />

      {/* Download Alert Banner if active */}
      {downloadNotification && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-3 text-xs flex items-center gap-2 shadow-2xs">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadNotification}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by code, customer, or title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['all', 'Tax Invoice', 'Delivery Note', 'Goods Receipt', 'Compliance Cert'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[36px] ${
                selectedType === type
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
              }`}
            >
              {type === 'all' ? 'All Documents' : type + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="No electronic archive documents match your filter or search query."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedType('all');
          }}
        />
      ) : (
        <>
          {/* Mobile Cards (< 768px) */}
          <div className="md:hidden space-y-3">
            {filtered.map(doc => (
              <div key={doc.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{doc.code}</span>
                    <h3 className="font-bold text-sm text-slate-900 mt-0.5">{doc.name}</h3>
                    <p className="text-[11px] text-slate-500">{doc.type} · {doc.relatedEntity}</p>
                  </div>
                  <StatusBadge status="Delivered" customLabel={doc.status} size="sm" />
                </div>

                <div className="flex items-center justify-between text-xs py-1 border-t border-slate-100 text-slate-500">
                  <span>Issued: {doc.issueDate}</span>
                  <span className="font-mono text-[11px]">{doc.fileSize}</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => setPreviewDoc(doc)}
                    className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 min-h-[38px]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Record</span>
                  </button>
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 min-h-[38px]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table (>= 768px) */}
          <div className="hidden md:block bg-white rounded-xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto w-full touch-pan-x">
              <table className="w-full text-xs text-left min-w-[700px]">
                <thead className="bg-slate-50/90 text-slate-500 font-semibold border-b border-slate-200 text-[11px] uppercase tracking-wider">
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
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filtered.map(doc => (
                    <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{doc.name}</span>
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 ml-6">{doc.code}</div>
                      </td>
                      <td className="p-3.5 text-slate-600">{doc.type}</td>
                      <td className="p-3.5 font-medium text-slate-800">{doc.relatedEntity}</td>
                      <td className="p-3.5 text-slate-500 whitespace-nowrap">{doc.issueDate}</td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px] whitespace-nowrap">{doc.fileSize}</td>
                      <td className="p-3.5 text-center">
                        <StatusBadge status="Delivered" customLabel={doc.status} size="sm" />
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 min-h-[32px] min-w-[32px] inline-flex items-center justify-center transition-colors"
                            title="Inspect Document"
                            aria-label={`Inspect ${doc.name}`}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(doc)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-slate-100 min-h-[32px] min-w-[32px] inline-flex items-center justify-center transition-colors"
                            title="Download PDF"
                            aria-label={`Download ${doc.name}`}
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
          </div>
        </>
      )}

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
            <div className="pt-2 text-xs font-mono text-slate-500 break-all">
              SHA-256 Hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
            </div>
            <div className="pt-4 flex justify-center">
              <button
                onClick={() => {
                  handleDownload(previewDoc);
                  setPreviewDoc(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs min-h-[40px]"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified Copy</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
