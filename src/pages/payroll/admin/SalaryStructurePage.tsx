import React, { useState, useEffect } from 'react';
import Layout from '../../../components/layout/Layout';
import { createSalaryStructure, getSalaryStructures, getEmployeeSalaryStructure, formatCurrency,type SalaryStructure } from '../../../api/payrollApi';
import { fetchAllEmployees,type Employee } from '../../../api/employeeApi';
import { toast } from 'react-toastify';
import { FaPlus, FaEdit, FaRupeeSign, FaBuilding, FaUser } from 'react-icons/fa';

const SalaryStructurePage: React.FC = () => {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    basicSalary: '',
    hra: '',
    da: '',
    ca: '',
    specialAllowance: '',
    bonus: '',
    pf: '',
    professionalTax: '',
    tds: '',
    otherDeductions: '',
    effectiveFrom: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [structuresRes, employeesRes] = await Promise.all([
        getSalaryStructures(),
        fetchAllEmployees(1, 100, '', '')
      ]);
      
      if (structuresRes.success) setStructures(structuresRes.data);
      if (employeesRes.success) setEmployees(employeesRes.data.employees);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId) {
      toast.error('Please select an employee');
      return;
    }

    const data = {
      employeeId: formData.employeeId,
      basicSalary: parseFloat(formData.basicSalary) || 0,
      hra: parseFloat(formData.hra) || 0,
      da: parseFloat(formData.da) || 0,
      ca: parseFloat(formData.ca) || 0,
      specialAllowance: parseFloat(formData.specialAllowance) || 0,
      bonus: parseFloat(formData.bonus) || 0,
      pf: parseFloat(formData.pf) || 0,
      professionalTax: parseFloat(formData.professionalTax) || 0,
      tds: parseFloat(formData.tds) || 0,
      otherDeductions: parseFloat(formData.otherDeductions) || 0,
      effectiveFrom: new Date(formData.effectiveFrom)
    };

    try {
      await createSalaryStructure(data);
      toast.success('Salary structure created successfully');
      setShowForm(false);
      setFormData({
        employeeId: '',
        basicSalary: '',
        hra: '',
        da: '',
        ca: '',
        specialAllowance: '',
        bonus: '',
        pf: '',
        professionalTax: '',
        tds: '',
        otherDeductions: '',
        effectiveFrom: new Date().toISOString().split('T')[0]
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    }
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
              <h1 className="text-2xl font-bold text-gray-800">Salary Structures</h1>
              <p className="text-gray-600 mt-1">Manage employee salary components</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <FaPlus className="h-4 w-4" />
              Add Salary Structure
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create Salary Structure</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Employee *</label>
                <select
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  required
                >
                  <option value="">Select an employee...</option>
                  {employees.map(emp => (
                    <option key={emp._id} value={emp._id}>
                      {emp.personalInfo.firstName} {emp.personalInfo.lastName} - {emp.employmentInfo.employeeId}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                  <input
                    type="number"
                    name="basicSalary"
                    value={formData.basicSalary}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HRA</label>
                  <input
                    type="number"
                    name="hra"
                    value={formData.hra}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DA</label>
                  <input
                    type="number"
                    name="da"
                    value={formData.da}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CA</label>
                  <input
                    type="number"
                    name="ca"
                    value={formData.ca}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Allowance</label>
                  <input
                    type="number"
                    name="specialAllowance"
                    value={formData.specialAllowance}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bonus</label>
                  <input
                    type="number"
                    name="bonus"
                    value={formData.bonus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PF</label>
                  <input
                    type="number"
                    name="pf"
                    value={formData.pf}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Tax</label>
                  <input
                    type="number"
                    name="professionalTax"
                    value={formData.professionalTax}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">TDS</label>
                  <input
                    type="number"
                    name="tds"
                    value={formData.tds}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Deductions</label>
                  <input
                    type="number"
                    name="otherDeductions"
                    value={formData.otherDeductions}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective From</label>
                <input
                  type="date"
                  name="effectiveFrom"
                  value={formData.effectiveFrom}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-2 rounded-lg font-medium"
                >
                  Create Salary Structure
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Structures List */}
        {structures.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FaRupeeSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No salary structures found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {structures.map((structure) => {
              const totalEarnings = structure.basicSalary + structure.hra + structure.da + structure.ca + structure.specialAllowance + structure.bonus;
              const totalDeductions = structure.pf + structure.professionalTax + structure.tds + structure.otherDeductions;
              const netSalary = totalEarnings - totalDeductions;
              
              return (
                <div key={structure._id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{structure.employeeId?.name}</h3>
                      <p className="text-sm text-gray-500">{structure.employeeId?.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${structure.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {structure.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between"><span>Basic:</span><span className="font-medium">{formatCurrency(structure.basicSalary)}</span></div>
                    <div className="flex justify-between"><span>Net Salary:</span><span className="font-bold text-green-600">{formatCurrency(netSalary)}</span></div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Effective from: {new Date(structure.effectiveFrom).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SalaryStructurePage;