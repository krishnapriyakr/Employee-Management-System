import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getShifts, createShift, updateShift, deleteShift,type Shift, formatTime } from '../../../api/shiftApi';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaClock } from 'react-icons/fa';

const ShiftTemplatesPage: React.FC = () => {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    startTime: '09:00',
    endTime: '17:00',
    duration: 8,
    color: '#3b82f6'
  });

  useEffect(() => {
    fetchShifts();
  }, []);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      const response = await getShifts();
      if (response.success) {
        setShifts(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration' ? parseInt(value) : value
    });
  };

  const calculateDuration = (start: string, end: string) => {
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    return endHour - startHour;
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    const newDuration = calculateDuration(newStartTime, formData.endTime);
    setFormData({
      ...formData,
      startTime: newStartTime,
      duration: newDuration > 0 ? newDuration : 8
    });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    const newDuration = calculateDuration(formData.startTime, newEndTime);
    setFormData({
      ...formData,
      endTime: newEndTime,
      duration: newDuration > 0 ? newDuration : 8
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error('Please enter shift title');
      return;
    }

    try {
      if (editingShift) {
        await updateShift(editingShift._id, formData);
        toast.success('Shift updated successfully');
      } else {
        await createShift(formData);
        toast.success('Shift created successfully');
      }
      setShowForm(false);
      setEditingShift(null);
      setFormData({ title: '', startTime: '09:00', endTime: '17:00', duration: 8, color: '#3b82f6' });
      fetchShifts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (shift: Shift) => {
    setEditingShift(shift);
    setFormData({
      title: shift.title,
      startTime: shift.startTime,
      endTime: shift.endTime,
      duration: shift.duration,
      color: shift.color
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete shift "${title}"?`)) return;
    
    try {
      await deleteShift(id);
      toast.success('Shift deleted successfully');
      fetchShifts();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingShift(null);
    setFormData({ title: '', startTime: '09:00', endTime: '17:00', duration: 8, color: '#3b82f6' });
  };

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#10b981', label: 'Green' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#ef4444', label: 'Red' },
    { value: '#8b5cf6', label: 'Purple' },
    { value: '#ec4899', label: 'Pink' }
  ];

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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Shift Templates</h1>
              <p className="text-gray-600 mt-1">Manage shift types and timings</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Create Shift
            </button>
          </div>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editingShift ? 'Edit Shift' : 'Create New Shift'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Morning Shift, Night Shift"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                  <select
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color.value }}></span>
                          {color.label}
                        </span>
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleStartTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleEndTimeChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (hours)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">Auto-calculated from start/end time</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                  <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: formData.color }}></div>
                    <span className="font-medium">{formData.title || 'Shift Name'}</span>
                    <span className="text-sm text-gray-500">
                      ({formatTime(formData.startTime)} - {formatTime(formData.endTime)})
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FaSave className="h-4 w-4" />
                  {editingShift ? 'Update Shift' : 'Create Shift'}
                </button>
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <FaTimes className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Shifts List */}
        {shifts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaClock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No shift templates found</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              Create First Shift
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {shifts.map((shift) => (
              <div key={shift._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: shift.color }}></div>
                    <h3 className="text-lg font-semibold text-gray-800">{shift.title}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(shift)}
                      className="text-green-600 hover:text-green-800"
                      title="Edit"
                    >
                      <FaEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(shift._id, shift.title)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center gap-2">
                    <FaClock className="h-4 w-4 text-gray-400" />
                    {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                  </p>
                  <p>Duration: {shift.duration} hours</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ShiftTemplatesPage;