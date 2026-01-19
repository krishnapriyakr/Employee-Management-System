import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/ui/Breadcrumb';
import BackButton from '../../components/ui/BackButton';
import { fetchEmployeeById, type Employee,  } from '../../api/employeeApi';
import { toast } from 'react-toastify';

const EmployeeDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Employees', path: '/employees' },
    { label: 'Employee Details', path: '' }
  ];

  useEffect(() => {
    if (id) {
      fetchEmployeeData();
    }
  }, [id]);

  const fetchEmployeeData = async () => {
    try {
      setIsLoading(true);
      const response = await fetchEmployeeById(id!);
      
      if (response.success) {
        setEmployee(response.data);
      } else {
        toast.error('Failed to load employee data');
        navigate('/employees');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to load employee data');
      navigate('/employees');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      inactive: { color: 'bg-red-100 text-red-800', label: 'Inactive' },
      'on-leave': { color: 'bg-yellow-100 text-yellow-800', label: 'On Leave' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </Layout>
    );
  }

  if (!employee) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h2>
            <p className="text-gray-600 mb-4">The employee you're looking for doesn't exist.</p>
            <Link
              to="/employees"
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              Back to Employees
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {getInitials(employee.personalInfo.firstName, employee.personalInfo.lastName)}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {employee.personalInfo.firstName} {employee.personalInfo.lastName}
                </h1>
                <Breadcrumb items={breadcrumbItems} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <Link
                to={`/employees/edit/${employee._id}`}
                className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center"
              >
                Edit Employee
              </Link>
              <BackButton />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                    <p className="text-gray-900 font-medium">{employee.personalInfo.firstName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-900 font-medium">{employee.personalInfo.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Date of Birth</label>
                    <p className="text-gray-900 font-medium">{formatDate(employee.personalInfo.dateOfBirth)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                    <p className="text-gray-900 font-medium">{employee.personalInfo.lastName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="text-gray-900 font-medium">{employee.personalInfo.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Gender</label>
                    <p className="text-gray-900 font-medium capitalize">{employee.personalInfo.gender}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Employment Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Employee ID</label>
                    <p className="text-gray-900 font-medium font-mono">{employee.employmentInfo.employeeId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                    <p className="text-gray-900 font-medium">{employee.employmentInfo.department}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Joining Date</label>
                    <p className="text-gray-900 font-medium">{formatDate(employee.employmentInfo.joiningDate)}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Position</label>
                    <p className="text-gray-900 font-medium">{employee.employmentInfo.position}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Salary</label>
                    <p className="text-gray-900 font-medium">₹{employee.employmentInfo.salary.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <div className="mt-1">{getStatusBadge(employee.employmentInfo.status)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Address Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Street Address</label>
                  <p className="text-gray-900 font-medium">{employee.address.street}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                    <p className="text-gray-900 font-medium">{employee.address.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                    <p className="text-gray-900 font-medium">{employee.address.state}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                    <p className="text-gray-900 font-medium">{employee.address.pincode}</p>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
                  <p className="text-gray-900 font-medium">{employee.address.country}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Information */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Emergency Contact
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Contact Name</label>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Relationship</label>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.relationship}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-gray-900 font-medium">{employee.emergencyContact.phone}</p>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                System Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created By</label>
                  <p className="text-gray-900 font-medium">{employee.createdBy.name}</p>
                  <p className="text-sm text-gray-500">{employee.createdBy.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created At</label>
                  <p className="text-gray-900 font-medium">{formatDate(employee.createdAt)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Last Updated</label>
                  <p className="text-gray-900 font-medium">{formatDate(employee.updatedAt)}</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Quick Actions
              </h2>
              <div className="space-y-3">
                <Link
                  to={`/employees/edit/${employee._id}`}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center block"
                >
                  Edit Employee
                </Link>
                <Link
                  to="/employees"
                  className="w-full bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-center block"
                >
                  Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeDetailsPage;