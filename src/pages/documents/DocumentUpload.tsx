import React, { useState, useEffect } from 'react';
import { uploadDocument, getCategoryLabel } from '../../api/documentsApi';
import { fetchAllEmployees,type Employee } from '../../api/employeeApi';
import { toast } from 'react-toastify';

interface DocumentUploadProps {
  employeeId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ employeeId, onSuccess, onCancel }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [formData, setFormData] = useState({
    employeeId: employeeId || '',
    title: '',
    description: '',
    category: 'other',
    expiryDate: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingEmployees, setLoadingEmployees] = useState(false);

  useEffect(() => {
    if (!employeeId) {
      fetchEmployees();
    }
  }, [employeeId]);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      const response = await fetchAllEmployees(1, 100, '', '');
      if (response.success) {
        setEmployees(response.data.employees);
      }
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoadingEmployees(false);
    }
  };

  const categories = [
    'id_proof',
    'offer_letter',
    'contract',
    'performance',
    'educational',
    'medical',
    'other'
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    
    if (!formData.title) {
      toast.error('Please enter a title');
      return;
    }
    
    setUploading(true);
    
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('employeeId', formData.employeeId);
      uploadFormData.append('title', formData.title);
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category', formData.category);
      if (formData.expiryDate) {
        uploadFormData.append('expiryDate', formData.expiryDate);
      }
      
      await uploadDocument(uploadFormData);
      toast.success('Document uploaded successfully');
      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Upload Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Employee Selection - Only show if employeeId not provided */}
        {!employeeId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Employee *
            </label>
            <select
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
              disabled={loadingEmployees}
            >
              <option value="">Select an employee...</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.personalInfo.firstName} {emp.personalInfo.lastName} - {emp.employmentInfo.department}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Offer Letter, ID Proof, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Optional description..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            File *
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Allowed: PDF, JPEG, PNG, DOC, DOCX (Max 10MB)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expiry Date (Optional)
          </label>
          <input
            type="date"
            value={formData.expiryDate}
            onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload Document'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DocumentUpload;