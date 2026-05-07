import React from 'react';
import { motion } from 'framer-motion';
import StatusBadge from './StatusBadge';
import { Activity, AlertOctagon, Info } from 'lucide-react';

const DecisionCard = ({ result }) => {
  if (!result) return null;

  const { status, score, reasonCodes, riskSummary, applicationId } = result;

  // Determine score color based on range
  let scoreColor = 'text-emerald-500';
  if (score < 600) scoreColor = 'text-rose-500';
  else if (score < 700) scoreColor = 'text-amber-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 w-full max-w-2xl mx-auto mt-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Application ID
          </p>
          <p className="text-sm font-medium text-slate-700 font-mono">
            {applicationId || 'N/A'}
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <Activity className="text-indigo-400 mb-2" size={24} />
          <p className="text-sm font-medium text-slate-500 mb-1">Credit Score</p>
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-bold tracking-tight ${scoreColor}`}>
              {score}
            </span>
            <span className="text-slate-400 font-medium">/900</span>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex items-start gap-3 mb-4">
            <Info className="text-indigo-500 mt-1 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-semibold text-slate-900 mb-1">Risk Summary</p>
              <p className="text-sm text-slate-600 leading-relaxed">{riskSummary}</p>
            </div>
          </div>
        </div>
      </div>

      {reasonCodes && reasonCodes.length > 0 && (
        <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100">
          <div className="flex items-center gap-2 mb-3">
            <AlertOctagon className="text-rose-500" size={18} />
            <p className="text-sm font-semibold text-rose-900">Reason Codes</p>
          </div>
          <ul className="flex flex-wrap gap-2">
            {reasonCodes.map((code, index) => (
              <li
                key={index}
                className="bg-white border border-rose-200 text-rose-700 px-2.5 py-1 rounded-md text-xs font-medium shadow-sm"
              >
                {code.replace(/_/g, ' ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default DecisionCard;
