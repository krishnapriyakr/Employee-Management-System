import api from './axiosInstance';

export interface Document {
  _id: string;
  employeeId: {
    _id: string;
    name: string;
    email: string;
  };
  title: string;
  description: string;
  category: 'id_proof' | 'offer_letter' | 'contract' | 'performance' | 'educational' | 'medical' | 'other';
  categoryLabel: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
  expiryDate?: string;
  uploadedBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface DocumentStats {
  totalDocuments: number;
  totalStorage: number;
  byCategory: Array<{
    _id: string;
    count: number;
    totalSize: number;
  }>;
  expiringDocuments: Array<{
    id: string;
    title: string;
    employeeName: string;
    expiryDate: string;
  }>;
}

// Get my documents (Employee)
export const getMyDocuments = async (): Promise<any> => {
  try {
    const response = await api.get('/documents/my');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};

// Get employee documents (Admin)
export const getEmployeeDocuments = async (employeeId: string): Promise<any> => {
  try {
    const response = await api.get(`/documents/employee/${employeeId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch employee documents');
  }
};

// Get all documents (Admin)
export const getAllDocuments = async (filters?: {
  employeeId?: string;
  category?: string;
}): Promise<any> => {
  try {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.category) params.append('category', filters.category);
    
    const response = await api.get(`/documents/all?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch documents');
  }
};

// Upload document (Admin)
export const uploadDocument = async (formData: FormData): Promise<any> => {
  try {
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to upload document');
  }
};

// Download document
export const downloadDocument = async (id: string): Promise<void> => {
  try {
    const response = await api.get(`/documents/download/${id}`, {
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    
    // Get filename from Content-Disposition header or use default
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'document';
    if (contentDisposition) {
      const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (match && match[1]) {
        filename = match[1].replace(/['"]/g, '');
      }
    }
    
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download document');
  }
};

// Delete document (Admin)
export const deleteDocument = async (id: string): Promise<any> => {
  try {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete document');
  }
};

// Get document stats (Admin)
export const getDocumentStats = async (): Promise<any> => {
  try {
    const response = await api.get('/documents/stats');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch stats');
  }
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get category icon
export const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
    id_proof: '🪪',
    offer_letter: '📄',
    contract: '📝',
    performance: '⭐',
    educational: '🎓',
    medical: '🏥',
    other: '📎'
  };
  return icons[category] || '📄';
};

// Get category label
export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    id_proof: 'ID Proof',
    offer_letter: 'Offer Letter',
    contract: 'Contract',
    performance: 'Performance Review',
    educational: 'Educational Certificate',
    medical: 'Medical Record',
    other: 'Other'
  };
  return labels[category] || category;
};
