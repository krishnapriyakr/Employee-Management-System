import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { getMyGoals, updateGoalProgress,type Goal } from '../../api/performanceApi';
import { toast } from 'react-toastify';

const MyGoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await getMyGoals();
      if (response.success) {
        setGoals(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (goalId: string, newProgress: number) => {
    setUpdating(goalId);
    try {
      await updateGoalProgress(goalId, newProgress);
      toast.success('Progress updated');
      fetchGoals();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUpdating(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-green-600 bg-green-50'
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      technical: '💻',
      soft_skills: '🤝',
      leadership: '👥',
      project: '📊',
      behavioral: '🎯'
    };
    return icons[category] || '📌';
  };

  const getStatusBadge = (status: string) => {
    const config = {
      not_started: { color: 'bg-gray-100 text-gray-600', label: 'Not Started' },
      in_progress: { color: 'bg-blue-100 text-blue-600', label: 'In Progress' },
      completed: { color: 'bg-green-100 text-green-600', label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-600', label: 'Cancelled' }
    };
    const c = config[status as keyof typeof config];
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${c.color}`}>{c.label}</span>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <h1 className="text-2xl font-bold text-gray-800">My Goals</h1>
          <p className="text-gray-600 mt-1">Track your professional goals and progress</p>
        </div>

        {/* Goals Grid */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">No goals assigned yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div key={goal._id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                    <h3 className="text-lg font-semibold text-gray-800">{goal.title}</h3>
                  </div>
                  {getStatusBadge(goal.status)}
                </div>

                <p className="text-gray-600 text-sm mb-4">{goal.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <p>📅 {formatDate(goal.startDate)} - {formatDate(goal.endDate)}</p>
                  <p>
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority.toUpperCase()} Priority
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Progress</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-500 h-2 rounded-full transition-all"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>

                {goal.status !== 'completed' && goal.status !== 'cancelled' && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Progress
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="10"
                        value={goal.progress}
                        onChange={(e) => handleProgressUpdate(goal._id, parseInt(e.target.value))}
                        disabled={updating === goal._id}
                        className="flex-1"
                      />
                      <span className="text-sm font-semibold w-12">{goal.progress}%</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyGoalsPage;