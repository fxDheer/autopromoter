import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { db } from "../utils/firebaseConfig";
// import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [stats, setStats] = useState({
    totalBusinesses: 0,
    activeBusinesses: 0,
    totalPosts: 0,
    thisMonth: 0
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockBusinesses = [
      {
        id: "demo-business-1",
        name: "Tech Startup Inc",
        email: "admin@techstartup.com",
        status: "active",
        plan: "premium",
        postsGenerated: 45,
        lastActive: "2024-01-15",
        socialMedia: {
          instagram: "@techstartup",
          facebook: "techstartupinc",
          twitter: "@techstartup"
        },
        createdAt: "2024-01-01"
      },
      {
        id: "demo-business-2",
        name: "Coffee Shop Deluxe",
        email: "manager@coffeeshop.com",
        status: "active",
        plan: "basic",
        postsGenerated: 23,
        lastActive: "2024-01-14",
        socialMedia: {
          instagram: "@coffeeshopdeluxe",
          facebook: "coffeeshopdeluxe"
        },
        createdAt: "2024-01-05"
      },
      {
        id: "demo-business-3",
        name: "Fitness Studio Pro",
        email: "owner@fitnessstudio.com",
        status: "inactive",
        plan: "basic",
        postsGenerated: 12,
        lastActive: "2024-01-10",
        socialMedia: {
          instagram: "@fitnessstudiopro",
          tiktok: "@fitnessstudiopro"
        },
        createdAt: "2024-01-08"
      },
      {
        id: "demo-business-4",
        name: "Digital Marketing Agency",
        email: "ceo@digitalagency.com",
        status: "active",
        plan: "premium",
        postsGenerated: 67,
        lastActive: "2024-01-15",
        socialMedia: {
          instagram: "@digitalagency",
          facebook: "digitalmarketingagency",
          linkedin: "digitalmarketingagency",
          twitter: "@digitalagency"
        },
        createdAt: "2024-01-02"
      }
    ];

    setBusinesses(mockBusinesses);
    setStats({
      totalBusinesses: mockBusinesses.length,
      activeBusinesses: mockBusinesses.filter(b => b.status === "active").length,
      totalPosts: mockBusinesses.reduce((sum, b) => sum + b.postsGenerated, 0),
      thisMonth: mockBusinesses.filter(b => new Date(b.lastActive).getMonth() === new Date().getMonth()).length
    });
    setLoading(false);
  }, []);

  const handleStatusChange = async (businessId, newStatus) => {
    try {
      // Update in Firebase
      // await updateDoc(doc(db, "businesses", businessId), { status: newStatus });
      
      // Update local state
      setBusinesses(prev => prev.map(b => 
        b.id === businessId ? { ...b, status: newStatus } : b
      ));
      
      alert(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Error updating status");
    }
  };

  const handleDeleteBusiness = async (businessId) => {
    if (window.confirm("Are you sure you want to delete this business?")) {
      try {
        // Delete from Firebase
        // await deleteDoc(doc(db, "businesses", businessId));
        
        // Update local state
        setBusinesses(prev => prev.filter(b => b.id !== businessId));
        alert("Business deleted successfully");
      } catch (error) {
        console.error("Error deleting business:", error);
        alert("Error deleting business");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-red-100 text-red-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPlanColor = (plan) => {
    switch (plan) {
      case "premium": return "bg-purple-100 text-purple-800";
      case "basic": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🤖 Auto-Promoter Admin</h1>
              <p className="text-gray-600">Manage businesses and track performance</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              ← Back to App
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <span className="text-blue-600 text-xl">🏢</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Businesses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalBusinesses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Businesses</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeBusinesses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <span className="text-purple-600 text-xl">📝</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Posts Generated</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-orange-600 text-xl">📅</span>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active This Month</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Businesses Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Business Management</h2>
                <p className="text-sm text-gray-600">Manage all registered businesses and their status</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Business
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posts
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Active
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                                <span className="text-white font-semibold">
                                  {business.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{business.name}</div>
                              <div className="text-sm text-gray-500">{business.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(business.status)}`}>
                            {business.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(business.plan)}`}>
                            {business.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {business.postsGenerated}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(business.lastActive).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setSelectedBusiness(business)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            <select
                              value={business.status}
                              onChange={(e) => handleStatusChange(business.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded px-2 py-1"
                            >
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                              <option value="pending">Pending</option>
                            </select>
                            <button
                              onClick={() => handleDeleteBusiness(business.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Business Details Modal */}
            {selectedBusiness && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Business Details: {selectedBusiness.name}
                      </h3>
                      <button
                        onClick={() => setSelectedBusiness(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Business Name</label>
                        <p className="text-sm text-gray-900">{selectedBusiness.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <p className="text-sm text-gray-900">{selectedBusiness.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedBusiness.status)}`}>
                          {selectedBusiness.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Plan</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(selectedBusiness.plan)}`}>
                          {selectedBusiness.plan}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Posts Generated</label>
                        <p className="text-sm text-gray-900">{selectedBusiness.postsGenerated}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Active</label>
                        <p className="text-sm text-gray-900">{new Date(selectedBusiness.lastActive).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Connected Social Media</label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(selectedBusiness.socialMedia).map(([platform, handle]) => (
                          <div key={platform} className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600">{platform}:</span>
                            <span className="text-gray-900">{handle}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        onClick={() => setSelectedBusiness(null)}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Close
                      </button>
                      <button
                        onClick={() => {
                          // Navigate to business posts page
                          navigate(`/generate-posts?business=${selectedBusiness.id}`);
                          setSelectedBusiness(null);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        View Posts
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 