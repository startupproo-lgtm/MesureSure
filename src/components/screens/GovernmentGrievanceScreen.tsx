import React, { useState } from 'react';
import { useMetrology } from '../../context/MetrologyContext';
import {
  GrievanceReportEntity,
  GrievanceCategory,
  GrievanceStatus
} from '../../types';
import {
  ShieldAlert,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Scale,
  Fuel,
  Package,
  Award,
  AlertOctagon,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Lock,
  UserCheck,
  ExternalLink,
  ChevronRight,
  Gavel,
  ShieldCheck,
  Send,
  Check
} from 'lucide-react';

export const GovernmentGrievanceScreen: React.FC = () => {
  const {
    grievances,
    updateGrievanceAction,
    openGovtGrievanceModal,
    userRole,
    currentUser
  } = useMetrology();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | null>(null);

  // Officer adjudication inputs
  const [adjudicationOfficer, setAdjudicationOfficer] = useState('Officer Sarah Jenkins');
  const [adjudicationReport, setAdjudicationReport] = useState('');
  const [compoundingFine, setCompoundingFine] = useState<number>(10000);
  const [orderNumber, setOrderNumber] = useState('');

  const filteredGrievances = grievances.filter((grv) => {
    const matchesSearch =
      grv.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.establishmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.issueDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grv.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'ALL' || grv.complaintCategory === categoryFilter;
    const matchesStatus = statusFilter === 'ALL' || grv.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalComplaints = grievances.length;
  const criticalCount = grievances.filter((g) => g.severity === 'CRITICAL').length;
  const activeEnquiries = grievances.filter((g) => g.status === 'UNDER_REVIEW' || g.status === 'INSPECTOR_DISPATCHED').length;
  const enforcementTaken = grievances.filter((g) => g.status === 'ACTION_TAKEN' || g.status === 'RESOLVED').length;

  const getCategoryIcon = (cat?: GrievanceCategory) => {
    switch (cat) {
      case 'FUEL_DISPENSER_TAMPERING':
        return Fuel;
      case 'SHORT_DELIVERY_UNDERWEIGHT':
        return Scale;
      case 'SEAL_TAMPERED_EXPIRED':
        return Award;
      case 'PACKAGED_COMMODITY_VIOLATION':
        return Package;
      case 'OFFICER_CORRUPTION_DELAY':
        return AlertOctagon;
      default:
        return ShieldAlert;
    }
  };

  const getCategoryLabel = (cat?: GrievanceCategory) => {
    switch (cat) {
      case 'FUEL_DISPENSER_TAMPERING':
        return 'Fuel Dispenser / Petrol Pump Tampering';
      case 'SHORT_DELIVERY_UNDERWEIGHT':
        return 'Short-Weight / Quantity Cheating';
      case 'SEAL_TAMPERED_EXPIRED':
        return 'Tampered / Expired Verification Seal';
      case 'PACKAGED_COMMODITY_VIOLATION':
        return 'Packaged Commodity Rule Breach';
      case 'OFFICER_CORRUPTION_DELAY':
        return 'Officer Harassment / Verification Delay';
      case 'UNVERIFIED_INSTRUMENT_USE':
        return 'Uncertified Scale in Trade';
      default:
        return 'Statutory Metrology Violation';
    }
  };

  const getStatusBadge = (status: GrievanceStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
            Docketed
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            Under Directorate Scrutiny
          </span>
        );
      case 'INSPECTOR_DISPATCHED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Send className="w-3 h-3" />
            Vigilance Officer Dispatched
          </span>
        );
      case 'ACTION_TAKEN':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
            <Gavel className="w-3 h-3" />
            Statutory Action Taken / Seized
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Disposed & Resolved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            Rejected
          </span>
        );
    }
  };

  const handleApplyAction = (grvId: string, status: GrievanceStatus) => {
    updateGrievanceAction(grvId, {
      status,
      assignedInspectorName: adjudicationOfficer,
      actionTakenReport: adjudicationReport || 'Surprise volumetric inspection executed. Compliance order recorded.',
      compoundingFeeOrFine: compoundingFine > 0 ? compoundingFine : undefined,
      statutoryOrderNumber: orderNumber || `LM/ENF/2026/${Math.floor(1000 + Math.random() * 9000)}-COMP`
    });
    setAdjudicationReport('');
  };

  return (
    <div className="space-y-6 pb-12" id="government-grievance-screen">
      {/* Government Authority Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-950 via-slate-900 to-red-950 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Central Vigilance & Grievance Directorate</span>
              </span>
              <span className="text-xs text-amber-200/80 font-medium">
                Legal Metrology Act, 2009 (Sec 15, 18, 30 & 36)
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Government Grievance & Public Malpractice Portal
            </h1>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Official statutory reporting interface for citizens, business owners, and administrators to report short-measurement fraud, fuel pump meter tampering, broken verification seals, or officer extortion directly to Government Metrology Authorities.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="lodge-complaint-banner-btn"
              onClick={() => openGovtGrievanceModal()}
              className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Lodge Complaint to Government</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Grievances Docketed</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalComplaints}</div>
          <div className="text-xs text-slate-400 mt-0.5">Central legal metrology registry</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-rose-600 uppercase tracking-wider">Critical Malpractices</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{criticalCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Fuel tampering & short delivery</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Enquiries in Field</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{activeEnquiries}</div>
          <div className="text-xs text-slate-400 mt-0.5">Vigilance officers dispatched</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Statutory Penalties / ATR</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{enforcementTaken}</div>
          <div className="text-xs text-slate-400 mt-0.5">Seizures & compounding levied</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="govt-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Docket ID (DOCA-GRV-...), establishment, location, or keyword..."
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="govt-category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">All Malpractice Categories</option>
                <option value="SHORT_DELIVERY_UNDERWEIGHT">Short-Weight Cheating</option>
                <option value="FUEL_DISPENSER_TAMPERING">Fuel Dispenser / Petrol Pump</option>
                <option value="SEAL_TAMPERED_EXPIRED">Broken / Expired Seal</option>
                <option value="PACKAGED_COMMODITY_VIOLATION">Packaged Commodity Violation</option>
                <option value="OFFICER_CORRUPTION_DELAY">Officer Delay / Extortion</option>
                <option value="UNVERIFIED_INSTRUMENT_USE">Uncertified Weights in Trade</option>
              </select>
            </div>

            <select
              id="govt-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-semibold py-2 px-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="ALL">All Enforcement Stages</option>
              <option value="SUBMITTED">🔴 Docketed</option>
              <option value="UNDER_REVIEW">🟡 Under Review</option>
              <option value="INSPECTOR_DISPATCHED">🔵 Officer Dispatched</option>
              <option value="ACTION_TAKEN">🟣 Action Taken / Seized</option>
              <option value="RESOLVED">🟢 Disposed & Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredGrievances.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Government Grievances Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No complaint records matched your search query or filters.
            </p>
          </div>
        ) : (
          filteredGrievances.map((grv) => {
            const Icon = getCategoryIcon(grv.complaintCategory);
            const isExpanded = selectedGrievanceId === grv.id;
            const canAdjudicate = userRole === 'ADMIN' || userRole === 'INSPECTOR';

            return (
              <div
                key={grv.id}
                id={`govt-grievance-${grv.reportId.toLowerCase()}`}
                className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                  isExpanded ? 'border-amber-500 shadow-md ring-1 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Header Row */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 mt-0.5">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                            {grv.reportId}
                          </span>
                          {getStatusBadge(grv.status)}
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            grv.severity === 'CRITICAL'
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : grv.severity === 'URGENT'
                              ? 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-800 border border-blue-200'
                          }`}>
                            {grv.severity} Priority
                          </span>
                          <span className="text-xs text-slate-400 font-medium">
                            • Lodged on {new Date(grv.timestamp).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1.5">
                          {grv.establishmentName}
                        </h3>
                        <div className="text-xs font-medium text-amber-800 flex items-center gap-1.5 mt-0.5">
                          <span>Violation: {getCategoryLabel(grv.complaintCategory)}</span>
                        </div>

                        <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                          {grv.issueDescription}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedGrievanceId(isExpanded ? null : grv.id)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-900 self-start shrink-0 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Statutory Track' : 'View Docket & Action'}</span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>
                  </div>

                  {/* Location and Reporter meta */}
                  <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{grv.location}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700">Instrument:</span> {grv.instrumentTypeOrId}
                    </div>
                    <div className="flex items-center gap-1">
                      {grv.isAnonymous ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <Lock className="w-3 h-3" /> Anonymous Whistleblower Protected
                        </span>
                      ) : (
                        <span>
                          <span className="font-semibold text-slate-700">Complainant:</span> {grv.reporterName} ({grv.reporterContact})
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details / Enforcement Timeline */}
                {isExpanded && (
                  <div className="bg-slate-50/80 border-t border-slate-200 p-5 space-y-5">
                    {/* Official 5-stage timeline */}
                    <div className="bg-white rounded-xl p-4 border border-slate-200">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                        Statutory Enforcement Progress Timeline
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                          <div className="font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>1. Docketed</span>
                          </div>
                          <p className="text-[10px] text-emerald-700 mt-0.5">Complaint officially logged</p>
                        </div>

                        <div className={`p-2.5 rounded-lg border ${
                          grv.status !== 'SUBMITTED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1">
                            {grv.status !== 'SUBMITTED' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Clock className="w-3.5 h-3.5" />}
                            <span>2. Scrutinized</span>
                          </div>
                          <p className="text-[10px] mt-0.5">Zonal Directorate triage</p>
                        </div>

                        <div className={`p-2.5 rounded-lg border ${
                          grv.status === 'INSPECTOR_DISPATCHED' || grv.status === 'ACTION_TAKEN' || grv.status === 'RESOLVED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1">
                            {grv.status === 'ACTION_TAKEN' || grv.status === 'RESOLVED' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Send className="w-3.5 h-3.5" />}
                            <span>3. Raid / Audit</span>
                          </div>
                          <p className="text-[10px] mt-0.5">Field officer on-site</p>
                        </div>

                        <div className={`p-2.5 rounded-lg border ${
                          grv.status === 'ACTION_TAKEN' || grv.status === 'RESOLVED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1">
                            {grv.status === 'RESOLVED' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Gavel className="w-3.5 h-3.5" />}
                            <span>4. Seizure / ATR</span>
                          </div>
                          <p className="text-[10px] mt-0.5">Compounding penalty notice</p>
                        </div>

                        <div className={`p-2.5 rounded-lg border ${
                          grv.status === 'RESOLVED'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}>
                          <div className="flex items-center gap-1">
                            {grv.status === 'RESOLVED' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                            <span>5. Disposed</span>
                          </div>
                          <p className="text-[10px] mt-0.5">Case closed in registry</p>
                        </div>
                      </div>
                    </div>

                    {/* Action Taken Report (ATR) Card */}
                    {grv.actionTakenReport && (
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                            <Gavel className="w-4 h-4 text-emerald-600" />
                            <span>Action Taken Report (ATR) by Legal Metrology Department</span>
                          </div>
                          {grv.assignedInspectorName && (
                            <span className="text-xs font-semibold text-emerald-700">
                              Investigating Officer: {grv.assignedInspectorName}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-emerald-900 leading-relaxed font-medium">
                          {grv.actionTakenReport}
                        </p>

                        {(grv.compoundingFeeOrFine || grv.statutoryOrderNumber) && (
                          <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-emerald-200 text-xs font-bold text-emerald-900">
                            {grv.compoundingFeeOrFine && (
                              <div>
                                Compounding Penalty Realized: <span className="text-emerald-700">₹{grv.compoundingFeeOrFine.toLocaleString()}</span>
                              </div>
                            )}
                            {grv.statutoryOrderNumber && (
                              <div>
                                Statutory Order No: <span className="font-mono">{grv.statutoryOrderNumber}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Officer Adjudication Panel */}
                    {canAdjudicate && (
                      <div className="p-5 bg-white border border-amber-200 rounded-xl space-y-4 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                            <Gavel className="w-4 h-4 text-amber-600" />
                            <span>Statutory Adjudication & Enforcement Desk (Admin / Inspector)</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            Authorized Cadre: {currentUser.name}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Assign Investigating Officer
                            </label>
                            <select
                              value={adjudicationOfficer}
                              onChange={(e) => setAdjudicationOfficer(e.target.value)}
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white"
                            >
                              <option value="Officer Sarah Jenkins">Officer Sarah Jenkins (Cadre ID: INS-001)</option>
                              <option value="Chief Inspector Pavan">Chief Inspector Pavan (Cadre ID: INS-002)</option>
                              <option value="Officer Rajesh Sharma">Officer Rajesh Sharma (Zonal Vigilance)</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Compounding Penalty (₹)
                            </label>
                            <input
                              type="number"
                              value={compoundingFine}
                              onChange={(e) => setCompoundingFine(Number(e.target.value))}
                              placeholder="15000"
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Statutory Seizure / Memo Order No.
                            </label>
                            <input
                              type="text"
                              value={orderNumber}
                              onChange={(e) => setOrderNumber(e.target.value)}
                              placeholder="LM/ENF/2026/0412-COMP"
                              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Action Taken Report (ATR) Narrative
                          </label>
                          <textarea
                            rows={2}
                            value={adjudicationReport}
                            onChange={(e) => setAdjudicationReport(e.target.value)}
                            placeholder="Enter findings of field audit: Volumetric measure readings, physical seizure of manipulated weights, compounding notice issued under Section 48..."
                            className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 resize-none"
                          />
                        </div>

                        {/* Adjudication actions */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                          <span className="text-xs font-semibold text-slate-600 mr-1">Statutory Action:</span>
                          <button
                            onClick={() => handleApplyAction(grv.id, 'INSPECTOR_DISPATCHED')}
                            className="px-3 py-1.5 text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Dispatch Flying Squad / Raid</span>
                          </button>
                          <button
                            onClick={() => handleApplyAction(grv.id, 'ACTION_TAKEN')}
                            className="px-3 py-1.5 text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Gavel className="w-3.5 h-3.5" />
                            <span>Issue Seizure & Compounding Notice</span>
                          </button>
                          <button
                            onClick={() => handleApplyAction(grv.id, 'RESOLVED')}
                            className="px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Resolved / Fine Deposited</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
