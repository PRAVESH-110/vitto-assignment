import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../api/api';
import InputField from '../components/InputField';
import SelectField from '../components/SelectField';
import ErrorAlert from '../components/ErrorAlert';
import Loader from '../components/Loader';
import { Building2, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorDetails, setErrorDetails] = useState([]);

  const [formData, setFormData] = useState({
    ownerName: '',
    pan: '',
    businessType: '',
    monthlyRevenue: '',
    loanAmount: '',
    tenure: '',
    loanPurpose: '',
  });

  const businessTypes = [
    { value: 'Proprietorship', label: 'Proprietorship' },
    { value: 'Partnership', label: 'Partnership' },
    { value: 'LLP', label: 'LLP' },
    { value: 'Private Limited', label: 'Private Limited' },
    { value: 'Public Limited', label: 'Public Limited' },
    { value: 'Other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrorDetails([]);

    try {
      const payload = {
        ...formData,
        monthlyRevenue: parseFloat(formData.monthlyRevenue),
        loanAmount: parseFloat(formData.loanAmount),
        tenure: parseInt(formData.tenure, 10),
      };

      const res = await createApplication(payload);
      
      if (res.success && res.data) {
        // Navigate to the result page, passing the decision result in state
        navigate(`/result/${res.data.applicationId}`, { state: { result: res.data } });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit application');
      setErrorDetails(err.errors || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="glass-card w-full max-w-2xl p-8 md:p-10"
      >
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-600/30 mb-6">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
            MSME Lending Application
          </h2>
          <p className="text-sm text-slate-500">
            Get an instant decision on your business loan request.
          </p>
        </div>

        {error && <ErrorAlert message={error} details={errorDetails} />}

        {loading ? (
          <Loader text="Analyzing business profile & credit risk..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <InputField
                label="Owner Name"
                id="ownerName"
                placeholder="e.g. John Doe"
                value={formData.ownerName}
                onChange={handleChange}
                required
              />
              <InputField
                label="PAN Number"
                id="pan"
                placeholder="ABCDE1234F"
                value={formData.pan}
                onChange={handleChange}
                className="uppercase"
                required
              />
              <SelectField
                label="Business Type"
                id="businessType"
                options={businessTypes}
                value={formData.businessType}
                onChange={handleChange}
                required
              />
              <div className="relative">
                <InputField
                  label="Monthly Revenue (₹)"
                  id="monthlyRevenue"
                  type="number"
                  min="0"
                  placeholder="100000"
                  value={formData.monthlyRevenue}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="relative">
                <InputField
                  label="Requested Loan Amount (₹)"
                  id="loanAmount"
                  type="number"
                  min="1000"
                  placeholder="500000"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  required
                />
              </div>
              <InputField
                label="Tenure (Months)"
                id="tenure"
                type="number"
                min="1"
                placeholder="24"
                value={formData.tenure}
                onChange={handleChange}
                required
              />
            </div>
            
            <InputField
              label="Loan Purpose"
              id="loanPurpose"
              placeholder="e.g. Working Capital, Equipment Purchase"
              value={formData.loanPurpose}
              onChange={handleChange}
              required
            />

            <button type="submit" className="btn-primary mt-8 py-4 text-base">
              Submit Application
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ApplicationForm;
