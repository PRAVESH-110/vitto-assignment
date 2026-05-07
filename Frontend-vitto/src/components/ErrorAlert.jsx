import React from 'react';
import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ErrorAlert = ({ message, details }) => {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm"
    >
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 text-red-500 flex-shrink-0" size={20} />
        <div>
          <h3 className="text-sm font-semibold text-red-800">{message}</h3>
          {details && details.length > 0 && (
            <ul className="mt-2 list-inside list-disc text-sm text-red-700">
              {details.map((detail, idx) => {
                // Handling express-validator array of objects: [{ field: 'error msg' }]
                const text = typeof detail === 'object' ? Object.values(detail)[0] : detail;
                return <li key={idx}>{text}</li>;
              })}
            </ul>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorAlert;
