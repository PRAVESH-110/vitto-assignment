import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ text = "Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative h-16 w-16 mb-4">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-indigo-100"
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <p className="text-sm font-medium text-slate-500 animate-pulse">{text}</p>
    </div>
  );
};

export default Loader;
