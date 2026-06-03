import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../../components/layout/Layout';
import { getEmployeeDocuments, downloadDocument, deleteDocument,type Document, formatFileSize, getCategoryIcon, getCategoryLabel } from '../../../api/documentsApi';
import { toast } from 'react-toastify';
import DocumentUpload from '../DocumentUpload';

const EmployeeDocumentsPage: React.FC = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [employeeId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getEmployeeDocuments(employeeId!);
      if (response.success) {
        setDocuments(response.data);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
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
      fetchDocuments();
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
              <button
                onClick={() => navigate('/employees')}
                className="text-primary-600 hover:text-primary-800 mb-2 inline-flex items-center space-x-1"
              >
                <span>←</span>
                <span>Back to Employees</span>
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Employee Documents</h1>
              <p className="text-gray-600 mt-1">Manage documents for this employee</p>
            </div>
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium"
            >
              {showUpload ? 'Cancel' : '+ Upload Document'}
            </button>
          </div>
        </div>

        {/* Upload Form */}
        {showUpload && (
          <DocumentUpload
            employeeId={employeeId}
            onSuccess={() => {
              setShowUpload(false);
              fetchDocuments();
            }}
            onCancel={() => setShowUpload(false)}
          />
        )}

        {/* Documents List */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📄</div>
            <p className="text-gray-500 text-lg">No documents found</p>
            <p className="text-sm text-gray-400 mt-1">Upload documents using the button above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <div key={doc._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getCategoryIcon(doc.category)}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800">{doc.title}</h3>
                      <p className="text-xs text-gray-500">{getCategoryLabel(doc.category)}</p>
                    </div>
                  </div>
                  {doc.expiryDate && new Date(doc.expiryDate) < new Date() && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">Expired</span>
                  )}
                </div>

                {doc.description && (
                  <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                )}

                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <p>📄 {doc.fileName}</p>
                  <p>📏 {formatFileSize(doc.fileSize)}</p>
                  <p>📅 Uploaded: {formatDate(doc.createdAt)}</p>
                  <p>👤 By: {doc.uploadedBy?.name}</p>
                  {doc.expiryDate && (
                    <p className={new Date(doc.expiryDate) < new Date() ? 'text-red-500' : 'text-yellow-600'}>
                      ⏰ Expires: {formatDate(doc.expiryDate)}
                    </p>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownload(doc._id)}
                    className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(doc._id, doc.title)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeDocumentsPage;