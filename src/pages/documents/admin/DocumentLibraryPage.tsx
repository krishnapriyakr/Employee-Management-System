import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { getAllDocuments, getDocumentStats, downloadDocument, deleteDocument, type Document, formatFileSize, getCategoryIcon, getCategoryLabel, type DocumentStats } from '../../../api/documentsApi';
import { fetchAllEmployees, type Employee } from '../../../api/employeeApi';
import DocumentUpload from '../DocumentUpload';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DocumentLibraryPage: React.FC = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [filters, setFilters] = useState({
    employeeId: '',
    category: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    fetchEmployees();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, statsRes] = await Promise.all([
        getAllDocuments(filters),
        getDocumentStats()
      ]);
      
      if (docsRes.success) setDocuments(docsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetchAllEmployees(1, 100, '', '');
      if (response.success) {
        setEmployees(response.data.employees);
      }
    } catch (error: any) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      await downloadDocument(id);
      toast.success('Download started');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    
    try {
      await deleteDocument(id);
      toast.success('Document deleted successfully');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStorage = (bytes: number): string => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'id_proof', label: 'ID Proof' },
    { value: 'offer_letter', label: 'Offer Letter' },
    { value: 'contract', label: 'Contract' },
    { value: 'performance', label: 'Performance Review' },
    { value: 'educational', label: 'Educational' },
    { value: 'medical', label: 'Medical' },
    { value: 'other', label: 'Other' }
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
              <h1 className="text-2xl font-bold text-gray-800">Document Library</h1>
              <p className="text-gray-600 mt-1">Manage all employee documents</p>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {showUpload ? 'Cancel' : '+ Upload Document'}
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <DocumentUpload
            employeeId={filters.employeeId || undefined}
            onSuccess={() => {
              setShowUpload(false);
              fetchData();
              toast.success('Document uploaded successfully');
            }}
            onCancel={() => setShowUpload(false)}
          />
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-600">Total Documents</p>
              <p className="text-2xl font-bold text-blue-700">{stats.totalDocuments}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-green-600">Total Storage Used</p>
              <p className="text-2xl font-bold text-green-700">{formatStorage(stats.totalStorage)}</p>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <p className="text-sm text-yellow-600">Categories</p>
              <p className="text-2xl font-bold text-yellow-700">{stats.byCategory?.length || 0}</p>
            </div>
          </div>
        )}

        {/* Expiring Documents Alert */}
        {stats?.expiringDocuments && stats.expiringDocuments.length > 0 && (
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
            <h3 className="text-sm font-semibold text-yellow-800 mb-2">⚠️ Documents Expiring Soon</h3>
            <div className="space-y-1">
              {stats.expiringDocuments.map((doc: any) => (
                <p key={doc.id} className="text-sm text-yellow-700">
                  • {doc.title} - {doc.employeeName} (Expires: {formatDate(doc.expiryDate)})
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Employee</label>
              <select
                value={filters.employeeId}
                onChange={(e) => setFilters({ ...filters, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Employees</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.personalInfo.firstName} {emp.personalInfo.lastName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Documents Table */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500 text-lg">No documents found</p>
            {showUpload ? (
              <p className="text-sm text-gray-400 mt-1">Fill the form above to upload a document</p>
            ) : (
              <button
                onClick={() => setShowUpload(true)}
                className="mt-4 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
              >
                + Upload First Document
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uploaded</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <tr key={doc._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                          <div className="text-xs text-gray-500">{doc.fileName}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => navigate(`/documents/employee/${doc.employeeId?._id}`)}
                          className="text-sm text-primary-600 hover:text-primary-800"
                        >
                          {doc.employeeId?.name || 'Unknown'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center space-x-1">
                          <span>{getCategoryIcon(doc.category)}</span>
                          <span className="text-sm text-gray-600">{getCategoryLabel(doc.category)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatFileSize(doc.fileSize)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(doc.createdAt)}</td>
                      <td className="px-6 py-4">
                        {doc.expiryDate && (
                          <span className={`text-sm ${new Date(doc.expiryDate) < new Date() ? 'text-red-500' : 'text-yellow-600'}`}>
                            {formatDate(doc.expiryDate)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleDownload(doc._id)}
                            className="text-primary-600 hover:text-primary-800"
                            title="Download"
                          >
                            📥
                          </button>
                          <button
                            onClick={() => navigate(`/documents/employee/${doc.employeeId?._id}`)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Employee"
                          >
                            👤
                          </button>
                          <button
                            onClick={() => handleDelete(doc._id, doc.title)}
                            className="text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentLibraryPage;