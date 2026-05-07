import React from 'react';

const InputField = ({ label, id, error, ...props }) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        className={`input-field ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default InputField;
