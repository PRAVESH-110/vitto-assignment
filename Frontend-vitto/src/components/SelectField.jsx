import React from 'react';
import { ChevronDown } from 'lucide-react';

const SelectField = ({ label, id, error, options, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={`input-field appearance-none pr-10 ${
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          }`}
          {...props}
        >
          <option value="" disabled>Select {label.toLowerCase()}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          <ChevronDown size={18} />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SelectField;
