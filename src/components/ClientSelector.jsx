import React, { useState, useEffect } from 'react';

const ClientSelector = ({ currentClient, onClientChange, onAddClient }) => {
  const [clients, setClients] = useState(['auto-promoter']);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newClientName, setNewClientName] = useState('');

  useEffect(() => {
    // Load clients from localStorage
    const savedClients = localStorage.getItem('autopromoter_clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  const handleAddClient = () => {
    if (newClientName.trim() && !clients.includes(newClientName.trim())) {
      const clientId = newClientName.trim().toLowerCase().replace(/\s+/g, '-');
      const newClients = [...clients, clientId];
      setClients(newClients);
      localStorage.setItem('autopromoter_clients', JSON.stringify(newClients));
      
      // Create client data structure
      const clientData = {
        id: clientId,
        name: newClientName.trim(),
        businessData: {
          name: newClientName.trim(),
          url: '',
          description: '',
          audience: '',
          keywords: '',
          socialMedia: {
            instagram: '',
            facebook: '',
            linkedin: '',
            tiktok: '',
            youtube: ''
          }
        },
        apiConfig: {
          facebook: { enabled: false },
          instagram: { enabled: false },
          linkedin: { enabled: false },
          tiktok: { enabled: false },
          youtube: { enabled: false }
        },
        postTemplates: [],
        recentPosts: []
      };
      
      localStorage.setItem(`autopromoter_client_${clientId}`, JSON.stringify(clientData));
      
      setNewClientName('');
      setShowAddForm(false);
      onClientChange(clientId);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">🏢 Client Management</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
        >
          ➕ Add Client
        </button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-white/5 rounded-lg border border-white/10">
          <input
            type="text"
            value={newClientName}
            onChange={(e) => setNewClientName(e.target.value)}
            placeholder="Enter client name (e.g., Tech Startup, Restaurant, etc.)"
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleAddClient}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-300"
            >
              ✅ Add Client
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewClientName('');
              }}
              className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all duration-300"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {clients.map((client) => (
          <button
            key={client}
            onClick={() => onClientChange(client)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
              currentClient === client
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {client.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="mt-4 text-sm text-white/60">
        <p>📊 <strong>Current Client:</strong> {currentClient.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
        <p>💡 Each client has separate business data, API configs, and post history</p>
      </div>
    </div>
  );
};

export default ClientSelector;
