import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { getApplication } from '../api/api';
import DecisionCard from '../components/DecisionCard';
import Loader from '../components/Loader';
import ErrorAlert from '../components/ErrorAlert';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const DecisionResult = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (!result && id) {
        try {
          const res = await getApplication(id);
          if (res.success && res.data && res.data.decisionId) {
            const app = res.data;
            const dec = app.decisionId;
            setResult({
              applicationId: app._id,
              status: dec.status,
              score: dec.score,
              reasonCodes: dec.reasonCodes,
              riskSummary: dec.riskSummary,
            });
          } else {
            setError('Application decision not found or still processing.');
          }
        } catch (err) {
          setError(err.message || 'Failed to fetch decision result');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplication();
  }, [id, result]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to New Application
        </button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-3">
            Decision Result
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Our automated lending engine has reviewed the application details and generated the following assessment.
          </p>
        </motion.div>

        {loading ? (
          <div className="glass-card mt-8">
            <Loader text="Fetching your decision..." />
          </div>
        ) : error ? (
          <ErrorAlert message={error} />
        ) : (
          <DecisionCard result={result} />
        )}
      </div>
    </div>
  );
};

export default DecisionResult;
