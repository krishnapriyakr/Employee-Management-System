import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../components/layout/Layout';
import Breadcrumb from '../../components/ui/Breadcrumb';
import BackButton from '../../components/ui/BackButton';
import type { CreateEmployeeData } from '../../types';
import { addEmployee } from '../../api/employeeApi';

// Form steps
type FormStep = 'personal' | 'employment' | 'address' | 'emergency' | 'review';

const AddEmployeePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>('personal');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Form data state
  const [formData, setFormData] = useState<CreateEmployeeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      gender: 'male' as const,
      profileImage: ''
    },
    employmentInfo: {
      department: '',
      position: '',
      salary: 0,
      joiningDate: '',
      status: 'active' as const
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    }
  });

  // Form validation state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', path: '/dashboard' },
    { label: 'Employees', path: '/employees' },
    { label: 'Add Employee', path: '' }
  ];

  // Step configurations
  const steps: { key: FormStep; label: string }[] = [
    { key: 'personal', label: 'Personal Info' },
    { key: 'employment', label: 'Employment' },
    { key: 'address', label: 'Address' },
    { key: 'emergency', label: 'Emergency Contact' },
    { key: 'review', label: 'Review' }
  ];

  // Handle input changes
  const handleInputChange = (section: keyof CreateEmployeeData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validation functions
  const validatePersonalInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.personalInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.personalInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.personalInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.personalInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.personalInfo.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmploymentInfo = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.employmentInfo.department.trim()) {
      newErrors.department = 'Department is required';
    }

    if (!formData.employmentInfo.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.employmentInfo.salary || formData.employmentInfo.salary <= 0) {
      newErrors.salary = 'Valid salary is required';
    }

    if (!formData.employmentInfo.joiningDate) {
      newErrors.joiningDate = 'Joining date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddress = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.address.street.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.address.state.trim()) {
      newErrors.state = 'State is required';
    }

    if (!formData.address.pincode.trim()) {
      newErrors.pincode = 'Pincode is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateEmergencyContact = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.emergencyContact.name.trim()) {
      newErrors.emergencyName = 'Emergency contact name is required';
    }

    if (!formData.emergencyContact.relationship.trim()) {
      newErrors.relationship = 'Relationship is required';
    }

    if (!formData.emergencyContact.phone.trim()) {
      newErrors.emergencyPhone = 'Emergency phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation between steps
  const nextStep = () => {
    let isValid = true;

    switch (currentStep) {
      case 'personal':
        isValid = validatePersonalInfo();
        break;
      case 'employment':
        isValid = validateEmploymentInfo();
        break;
      case 'address':
        isValid = validateAddress();
        break;
      case 'emergency':
        isValid = validateEmergencyContact();
        break;
    }

    if (isValid) {
      const currentIndex = steps.findIndex(step => step.key === currentStep);
      if (currentIndex < steps.length - 1) {
        setCurrentStep(steps[currentIndex + 1].key);
      }
    }
  };

  const prevStep = () => {
    const currentIndex = steps.findIndex(step => step.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  // Submit form
  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const response = await addEmployee(formData as any);
      
      if (response.success) {
        toast.success('Employee added successfully!');
        navigate('/employees');
      } else {
        toast.error(response.message || 'Failed to add employee');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add employee');
    } finally {
      setIsLoading(false);
    }
  };

  // Render step progress
  const renderStepProgress = () => (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                steps.findIndex(s => s.key === currentStep) >= index
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm font-medium ${
                steps.findIndex(s => s.key === currentStep) >= index
                  ? 'text-primary-600'
                  : 'text-gray-500'
              }`}
            >
              {step.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 w-12 h-0.5 ${
                  steps.findIndex(s => s.key === currentStep) > index
                    ? 'bg-primary-500'
                    : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render personal info step
  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.firstName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter first name"
          />
          {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.lastName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter last name"
          />
          {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.personalInfo.email}
            onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            maxLength={10}
            value={formData.personalInfo.phone}
            onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.personalInfo.dateOfBirth}
            onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.dateOfBirth && <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.personalInfo.gender}
            onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render employment info step
  const renderEmploymentInfo = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Employment Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.employmentInfo.department}
            onChange={(e) => handleInputChange('employmentInfo', 'department', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.department ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Department</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">Human Resources</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>
          {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Position <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.employmentInfo.position}
            onChange={(e) => handleInputChange('employmentInfo', 'position', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter position"
          />
          {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salary (₹) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.employmentInfo.salary}
            onChange={(e) => handleInputChange('employmentInfo', 'salary', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.salary ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter salary"
            min="0"
          />
          {errors.salary && <p className="mt-1 text-sm text-red-600">{errors.salary}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Joining Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formData.employmentInfo.joiningDate}
            onChange={(e) => handleInputChange('employmentInfo', 'joiningDate', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.joiningDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.joiningDate && <p className="mt-1 text-sm text-red-600">{errors.joiningDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.employmentInfo.status}
            onChange={(e) => handleInputChange('employmentInfo', 'status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on-leave">On Leave</option>
          </select>
        </div>
      </div>
    </div>
  );

  // Render address step
  const renderAddress = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Address Information</h3>
      
      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Street Address <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address.street}
            onChange={(e) => handleInputChange('address', 'street', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.street ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter street address"
          />
          {errors.street && <p className="mt-1 text-sm text-red-600">{errors.street}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleInputChange('address', 'city', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter city"
            />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => handleInputChange('address', 'state', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.state ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter state"
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address.country}
              onChange={(e) => handleInputChange('address', 'country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Enter country"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address.pincode}
              onChange={(e) => handleInputChange('address', 'pincode', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                errors.pincode ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter pincode"
            />
            {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
          </div>
        </div>
      </div>
    </div>
  );

  // Render emergency contact step
  const renderEmergencyContact = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Emergency Contact</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.emergencyContact.name}
            onChange={(e) => handleInputChange('emergencyContact', 'name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.emergencyName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter contact name"
          />
          {errors.emergencyName && <p className="mt-1 text-sm text-red-600">{errors.emergencyName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Relationship <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.emergencyContact.relationship}
            onChange={(e) => handleInputChange('emergencyContact', 'relationship', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.relationship ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter relationship"
          />
          {errors.relationship && <p className="mt-1 text-sm text-red-600">{errors.relationship}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.emergencyContact.phone}
            onChange={(e) => handleInputChange('emergencyContact', 'phone', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.emergencyPhone && <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>}
        </div>
      </div>
    </div>
  );

  // Render review step
  const renderReview = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Review Information</h3>
      
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        {/* Personal Info Review */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Personal Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Name:</span> {formData.personalInfo.firstName} {formData.personalInfo.lastName}</div>
            <div><span className="text-gray-600">Email:</span> {formData.personalInfo.email}</div>
            <div><span className="text-gray-600">Phone:</span> {formData.personalInfo.phone}</div>
            <div><span className="text-gray-600">Date of Birth:</span> {formData.personalInfo.dateOfBirth}</div>
            <div><span className="text-gray-600">Gender:</span> {formData.personalInfo.gender}</div>
          </div>
        </div>

        {/* Employment Info Review */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Employment Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Department:</span> {formData.employmentInfo.department}</div>
            <div><span className="text-gray-600">Position:</span> {formData.employmentInfo.position}</div>
            <div><span className="text-gray-600">Salary:</span> ₹{formData.employmentInfo.salary.toLocaleString()}</div>
            <div><span className="text-gray-600">Joining Date:</span> {formData.employmentInfo.joiningDate}</div>
            <div><span className="text-gray-600">Status:</span> {formData.employmentInfo.status}</div>
          </div>
        </div>

        {/* Address Review */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Address</h4>
          <div className="text-sm">
            <div><span className="text-gray-600">Street:</span> {formData.address.street}</div>
            <div><span className="text-gray-600">City:</span> {formData.address.city}</div>
            <div><span className="text-gray-600">State:</span> {formData.address.state}</div>
            <div><span className="text-gray-600">Country:</span> {formData.address.country}</div>
            <div><span className="text-gray-600">Pincode:</span> {formData.address.pincode}</div>
          </div>
        </div>

        {/* Emergency Contact Review */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div><span className="text-gray-600">Name:</span> {formData.emergencyContact.name}</div>
            <div><span className="text-gray-600">Relationship:</span> {formData.emergencyContact.relationship}</div>
            <div><span className="text-gray-600">Phone:</span> {formData.emergencyContact.phone}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render current step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'personal':
        return renderPersonalInfo();
      case 'employment':
        return renderEmploymentInfo();
      case 'address':
        return renderAddress();
      case 'emergency':
        return renderEmergencyContact();
      case 'review':
        return renderReview();
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-primary-500">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Add New Employee</h1>
              <Breadcrumb items={breadcrumbItems} />
            </div>
            <BackButton />
          </div>
        </div>

        {/* Step Progress */}
        {renderStepProgress()}

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          {renderStepContent()}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div>
              {currentStep !== 'personal' && (
                <button
                  onClick={prevStep}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              {currentStep !== 'review' ? (
                <button
                  onClick={nextStep}
                  className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className={`bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Adding Employee...' : 'Add Employee'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AddEmployeePage;