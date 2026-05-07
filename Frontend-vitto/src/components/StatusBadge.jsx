import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const config = {
    APPROVED: {
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      icon: <CheckCircle size={16} className="text-emerald-600" />,
      label: 'Approved',
    },
    APPROVED_WITH_WARNINGS: {
      color: 'bg-amber-100 text-amber-800 border-amber-200',
      icon: <AlertTriangle size={16} className="text-amber-600" />,
      label: 'Approved (Action Req.)',
    },
    REJECTED: {
      color: 'bg-rose-100 text-rose-800 border-rose-200',
      icon: <XCircle size={16} className="text-rose-600" />,
      label: 'Rejected',
    },
    PROCESSING: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />,
      label: 'Processing',
    },
  };

  const currentConfig = config[status] || config.PROCESSING;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium ${currentConfig.color}`}>
      {currentConfig.icon}
      {currentConfig.label}
    </span>
  );
};

export default StatusBadge;
