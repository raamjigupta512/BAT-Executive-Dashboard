import React, { useState } from 'react';
import { ManagementAction, ActionStatus } from '../../types/dashboard';
import { CheckSquare, Plus, Filter, ArrowRight, UserCheck, Calendar } from 'lucide-react';

interface DecisionsActionsViewProps {
  actions: ManagementAction[];
  onReviewAction: (action: ManagementAction) => void;
  onCreateAction: (newAction: Partial<ManagementAction>) => void;
}

export const DecisionsActionsView: React.FC<DecisionsActionsViewProps> = ({
  actions,
  onReviewAction,
  onCreateAction
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // New action form fields
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newRationale, setNewRationale] = useState('');
  const [newImpact, setNewImpact] = useState('');
  const [newOwner, setNewOwner] = useState('Executive Committee Member');
  const [newDueDate, setNewDueDate] = useState('31 Dec 2026');

  const filtered = filterStatus === 'All'
    ? actions
    : actions.filter(a => a.status === filterStatus);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateAction({
      title: newTitle,
      subtitle: newSubtitle || 'Executive priority initiative',
      rationale: newRationale || 'Strategic value enhancement for FY2025/2026',
      expectedFinancialImpact: newImpact || '+£150M Operational Benefit',
      owner: newOwner,
      ownerRole: 'Executive Lead',
      dueDate: newDueDate,
      status: 'Proposed',
      alternativeOptions: ['Standard rollout', 'Accelerated execution'],
      financialAssumptions: ['Priced at current margin corridors'],
      auditHistory: [
        {
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          user: 'CFO Office',
          action: 'Proposed new action charter'
        }
      ]
    });

    // Reset and close
    setNewTitle('');
    setNewSubtitle('');
    setNewRationale('');
    setNewImpact('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4 max-w-[1850px] mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#071B3A]">Decisions &amp; Management Actions</h1>
          <p className="text-xs text-[#536B8B]">
            Governance register, strategic approval workflows, financial impacts, and execution tracking
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <div className="flex bg-white rounded-lg border border-[#DCE8F0] p-1 text-xs">
            {['All', 'Proposed', 'Under Review', 'Approved', 'In Progress', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                  filterStatus === st
                    ? 'bg-[#008FCB] text-white'
                    : 'text-[#536B8B] hover:text-[#071B3A]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-2 bg-[#008FCB] hover:bg-[#007AB8] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Action</span>
          </button>
        </div>
      </div>

      {/* Action Table */}
      <div className="bg-white rounded-xl p-5 border border-[#DCE8F0] shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F8FAFC] border-b border-[#DCE8F0] text-[#536B8B] font-semibold">
              <tr>
                <th className="py-2.5 px-4 w-12 text-center">Rank</th>
                <th className="py-2.5 px-4">Action Item</th>
                <th className="py-2.5 px-4">Expected Financial Impact</th>
                <th className="py-2.5 px-4">Owner &amp; Role</th>
                <th className="py-2.5 px-4">Due Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF2F6]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#F8FAFC] transition-colors">
                  <td className="py-3 px-4 text-center">
                    <div className="w-6 h-6 rounded-full bg-[#008FCB] text-white font-bold text-xs flex items-center justify-center mx-auto">
                      {a.priority}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-[#071B3A] block">{a.title}</span>
                    <span className="text-[11px] text-[#536B8B]">{a.subtitle}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#12A66A]">{a.expectedFinancialImpact}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#071B3A] block">{a.owner}</span>
                    <span className="text-[10.5px] text-[#536B8B]">{a.ownerRole}</span>
                  </td>
                  <td className="py-3 px-4 text-[#536B8B]">{a.dueDate}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                      a.status === 'Approved' ? 'bg-[#D1FAE5] text-[#059669]' :
                      a.status === 'In Progress' ? 'bg-[#EBF6FC] text-[#008FCB]' :
                      a.status === 'Completed' ? 'bg-[#F1F5F9] text-[#475569]' :
                      'bg-[#FEF3C7] text-[#D97706]'
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => onReviewAction(a)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-[#008FCB] hover:bg-[#007AB8] rounded-md transition-colors shadow-2xs cursor-pointer"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Action Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#DCE8F0] p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-[#071B3A] mb-1">Create Management Action</h3>
            <p className="text-xs text-[#536B8B] mb-4">Add a new executive recommendation to the register</p>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#071B3A] block mb-1">Action Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Expand Velo distribution in Southern Europe"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F0] rounded-lg focus:outline-hidden focus:border-[#008FCB]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#071B3A] block mb-1">Subtitle / Summary</label>
                <input
                  type="text"
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  placeholder="e.g. Partner with Tier-1 convenience wholesalers"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F0] rounded-lg focus:outline-hidden focus:border-[#008FCB]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#071B3A] block mb-1">Expected Financial Impact</label>
                <input
                  type="text"
                  value={newImpact}
                  onChange={(e) => setNewImpact(e.target.value)}
                  placeholder="e.g. +£85M Incremental Revenue"
                  className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F0] rounded-lg focus:outline-hidden focus:border-[#008FCB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-[#071B3A] block mb-1">Owner</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F0] rounded-lg focus:outline-hidden focus:border-[#008FCB]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#071B3A] block mb-1">Target Date</label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full p-2 bg-[#F8FAFC] border border-[#DCE8F0] rounded-lg focus:outline-hidden focus:border-[#008FCB]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#EEF2F6]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#536B8B] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#008FCB] hover:bg-[#007AB8] text-white font-semibold cursor-pointer shadow-xs"
                >
                  Create &amp; Log Action
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
