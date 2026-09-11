import React, { useState } from 'react';
import { 
  Sparkles, X, Bot, RefreshCw, Send, AlertTriangle, 
  TrendingUp, ShoppingCart, ShieldAlert, ArrowRight, CheckCircle2 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { 
    currentUser, 
    selectedBranch, 
    products, 
    orders, 
    inventoryItems, 
    deliveryRuns, 
    approvals, 
    invoices,
    suppliers,
    setActiveModule
  } = useApp();

  const [activeTab, setActiveTab] = useState<'copilot' | 'briefing' | 'replenish' | 'expiry'>('copilot');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: `Hello ${currentUser.name}. I am your Agro-Deliveries Operational Copilot monitoring the **${selectedBranch}** depot.\n\nHow can I assist your logistics and cold-chain workflow today?`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultData, setResultData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSendChat = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'chat',
          payload: {
            history: messages,
            query: textToSend,
            options: {
              userRole: currentUser.roleTitle,
              branch: selectedBranch,
              contextSummary: `Orders: ${orders.length}, Products: ${products.length}, Inventory lines: ${inventoryItems.length}, Trucks active: ${deliveryRuns.length}`
            }
          }
        })
      });

      const res = await response.json();
      if (res.success && res.reply) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Operational response could not be generated. Please retry in a moment.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection to server AI engine timed out. Rule-based analytics remain active.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunBriefing = async () => {
    setIsLoading(true);
    setActiveTab('briefing');
    try {
      const overdueReceivables = invoices
        .filter(i => i.status === 'Overdue')
        .reduce((sum, i) => sum + (i.totalAmount - i.amountPaid), 0);

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'briefing',
          payload: {
            dailyRevenueKES: orders.reduce((s, o) => s + o.totalAmount, 0),
            ordersCount: orders.length,
            dispatchOnTimeRate: 94.6,
            activeTruckRuns: deliveryRuns.length,
            refrigerationAlertsCount: 0,
            pendingApprovalsCount: approvals.filter(a => a.status === 'Pending').length,
            overdueReceivablesKES: overdueReceivables,
            activeBranch: selectedBranch
          }
        })
      });
      const res = await response.json();
      if (res.success) {
        setResultData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunProcurement = async () => {
    setIsLoading(true);
    setActiveTab('replenish');
    try {
      const lowStock = products
        .filter(p => p.currentStock <= p.minStockLevel)
        .map(p => ({
          name: p.name,
          currentStock: p.currentStock,
          minStock: p.minStockLevel,
          unit: p.unit,
          category: p.category
        }));

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'procurement',
          payload: {
            lowStockItems: lowStock.length > 0 ? lowStock : products.slice(0, 3).map(p => ({
              name: p.name,
              currentStock: p.currentStock,
              minStock: p.minStockLevel,
              unit: p.unit,
              category: p.category
            })),
            pendingOrdersCount: orders.filter(o => o.status === 'Confirmed' || o.status === 'Picking').length,
            availableSuppliers: suppliers.map(s => ({
              name: s.name,
              category: s.category,
              location: s.location,
              rating: s.rating
            }))
          }
        })
      });
      const res = await response.json();
      if (res.success) {
        setResultData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRunExpiryScan = async () => {
    setIsLoading(true);
    setActiveTab('expiry');
    try {
      const batches = inventoryItems.map(item => {
        const prod = products.find(p => p.id === item.productId);
        const expDate = new Date(item.expiryDate);
        const today = new Date('2026-03-24');
        const diffDays = Math.max(1, Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
        const qty = item.quantityAvailable ?? item.quantity ?? 0;
        return {
          batchNumber: item.batchNumber,
          productName: item.productName,
          currentStock: qty,
          unit: item.unit,
          daysToExpiry: diffDays,
          location: item.location || item.binLocation,
          valueKES: qty * (prod?.costPrice || prod?.baseCost || 40)
        };
      });

      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'inventory_risk',
          payload: { batches }
        })
      });
      const res = await response.json();
      if (res.success) {
        setResultData(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl h-[90vh] max-h-[750px] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:px-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">Agro-Deliveries BOS Intelligence Copilot</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Gemini Flash 2.5
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Contextual AI advisor for supply chain, cold storage, and institutional fulfillment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Strip */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-slate-50 border-b border-slate-200 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('copilot')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'copilot' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            Interactive Copilot
          </button>
          <button
            onClick={handleRunBriefing}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'briefing' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Daily Executive Briefing
          </button>
          <button
            onClick={handleRunProcurement}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'replenish' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            Co-op Replenishment Insights
          </button>
          <button
            onClick={handleRunExpiryScan}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'expiry' ? 'bg-white text-emerald-700 shadow-xs border border-slate-200' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            FEFO Shelf-Life Risk Scan
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/60">
          {isLoading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-3 py-16">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-xs font-semibold text-slate-700">Synthesizing logistics intelligence across depots...</p>
              <p className="text-[11px] text-slate-400">Querying live batch expiry, supplier lead times, and dispatch telemetry</p>
            </div>
          ) : activeTab === 'copilot' ? (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      AG
                    </div>
                  )}
                  <div className={`p-3.5 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-emerald-600 text-white rounded-br-none shadow-xs font-medium' 
                      : 'bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-xs whitespace-pre-line'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'briefing' && resultData ? (
            <div className="space-y-5">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Executive Overview</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    Health Score: {resultData.logisticsHealthScore || 92}/100
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {resultData.executiveSummary}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-2">
                  <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Operational Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {resultData.keyStrengths?.map((s: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-xl border border-amber-200 shadow-xs space-y-2 bg-amber-50/20">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Immediate Attention Required
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {resultData.immediateActionItems?.map((act: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Working Capital Outlook</span>
                <p>{resultData.workingCapitalOutlook}</p>
              </div>
            </div>
          ) : activeTab === 'replenish' && resultData ? (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Recommended Co-op Sourcing Orders</h4>
                  <p className="text-[11px] text-slate-500">{resultData.summary}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Estimated Spend</span>
                  <span className="text-sm font-extrabold text-emerald-600">
                    KES {(resultData.totalEstimatedSpendKES || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {resultData.recommendations?.map((rec: any, i: number) => (
                  <div key={i} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{rec.productName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          rec.urgency === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {rec.urgency} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">{rec.rationale}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-600 font-medium">
                        <span>Preferred Vendor: <strong className="text-slate-900">{rec.preferredSupplier}</strong></span>
                        <span>•</span>
                        <span>Quantity: <strong className="text-slate-900">{rec.suggestedQty} {rec.unit}</strong></span>
                      </div>
                    </div>
                    <div className="text-right pl-4">
                      <span className="text-xs font-bold text-slate-900 block">KES {rec.estimatedCostKES?.toLocaleString()}</span>
                      <button
                        onClick={() => {
                          onClose();
                          setActiveModule('procurement');
                        }}
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Create PO <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'expiry' && resultData ? (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Perishability & Batch Expiry Matrix</h4>
                  <p className="text-[11px] text-slate-500">{resultData.preventativeMitigationPlan}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Value at Immediate Risk</span>
                  <span className="text-sm font-extrabold text-rose-600">
                    KES {(resultData.totalValueAtRiskKES || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2.5">
                {resultData.criticalBatches?.map((b: any, i: number) => (
                  <div key={i} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{b.batchNumber}</span>
                        <span className="font-bold text-slate-900">— {b.productName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                          {b.daysToExpiry} {b.daysToExpiry === 1 ? 'day' : 'days'} left
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">{b.actionDetails}</p>
                    </div>
                    <div className="text-right pl-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-800">
                        {b.recommendedAction}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Interactive Query Input Bar (for Copilot Tab) */}
        {activeTab === 'copilot' && (
          <div className="p-3.5 sm:px-6 bg-white border-t border-slate-200">
            <div className="flex items-center gap-2 mb-2 overflow-x-auto pb-1 text-[11px]">
              <button
                onClick={() => handleSendChat('What are the urgent dispatch priorities for the Nairobi Dawn kitchen routes?')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                Dawn Kitchen Priorities
              </button>
              <button
                onClick={() => handleSendChat('Which leafy green batches in Cold Room A should be allocated first?')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                Leafy Green Allocation
              </button>
              <button
                onClick={() => handleSendChat('Summarize unallocated M-Pesa payments and hospital accounts receivable.')}
                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg whitespace-nowrap transition-colors"
              >
                M-Pesa & AR Summary
              </button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                placeholder="Ask your logistics copilot about orders, co-ops, cold-storage, or routes..."
                className="flex-1 px-3.5 py-2 text-xs bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-800"
              />
              <button
                type="submit"
                disabled={isLoading || !inputQuery.trim()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Ask</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
