import React, { useState } from 'react';
import Layout from '@/components/Layout';

const LabManagement = () => {
  const [equipment, setEquipment] = useState([
    { name: 'Microscope', quantity: 10, status: 'Available' },
    { name: 'Bunsen Burner', quantity: 8, status: 'In Use' },
  ]);

  const [chemicals, setChemicals] = useState([
    { name: 'Hydrochloric Acid', quantity: '500ml', safety: 'Use gloves' },
    { name: 'Sodium Hydroxide', quantity: '250ml', safety: 'Wear goggles' },
  ]);

  const [labSessions, setLabSessions] = useState([
    { subject: 'Biology', topic: 'Cell Observation', date: '2025-07-25' },
  ]);

  const [incidentReports, setIncidentReports] = useState([]);

  const [newEquipment, setNewEquipment] = useState({ name: '', quantity: '', status: 'Available' });
  const [newChemical, setNewChemical] = useState({ name: '', quantity: '', safety: '' });
  const [newSession, setNewSession] = useState({ subject: '', topic: '', date: '' });
  const [newIncident, setNewIncident] = useState({ student: '', equipment: '', date: '', notes: '' });

  const handleAddEquipment = () => {
    if (newEquipment.name && newEquipment.quantity) {
      setEquipment([...equipment, { ...newEquipment, quantity: parseInt(newEquipment.quantity) }]);
      setNewEquipment({ name: '', quantity: '', status: 'Available' });
    }
  };

  const handleAddChemical = () => {
    if (newChemical.name && newChemical.quantity) {
      setChemicals([...chemicals, newChemical]);
      setNewChemical({ name: '', quantity: '', safety: '' });
    }
  };

  const handleAddSession = () => {
    if (newSession.subject && newSession.topic && newSession.date) {
      setLabSessions([...labSessions, newSession]);
      setNewSession({ subject: '', topic: '', date: '' });
    }
  };

  const handleDeleteEquipment = (index: number) => {
    const updated = [...equipment];
    updated.splice(index, 1);
    setEquipment(updated);
  };

  const handleDeleteChemical = (index: number) => {
    const updated = [...chemicals];
    updated.splice(index, 1);
    setChemicals(updated);
  };

  const handleDeleteSession = (index: number) => {
    const updated = [...labSessions];
    updated.splice(index, 1);
    setLabSessions(updated);
  };

  const handleAddIncident = () => {
    if (newIncident.student && newIncident.equipment && newIncident.date) {
      setIncidentReports([...incidentReports, newIncident]);
      setNewIncident({ student: '', equipment: '', date: '', notes: '' });
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-center">Lab Technician Dashboard</h1>

        {/* Lab Equipment Section */}
        <section className="mb-10 bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Lab Equipment</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {equipment.map((item, idx) => (
              <div key={idx} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <p><strong>{item.name}</strong></p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Status: <span className="text-green-600">{item.status}</span></p>
                </div>
                <button
                  onClick={() => handleDeleteEquipment(idx)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="border rounded p-2"
              placeholder="Equipment Name"
              value={newEquipment.name}
              onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
            />
            <input
              className="border rounded p-2"
              type="number"
              placeholder="Quantity"
              value={newEquipment.quantity}
              onChange={(e) => setNewEquipment({ ...newEquipment, quantity: e.target.value })}
            />
            <select
              className="border rounded p-2"
              value={newEquipment.status}
              onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
            >
              <option>Available</option>
              <option>In Use</option>
              <option>Under Maintenance</option>
            </select>
          </div>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleAddEquipment}
          >
            Add Equipment
          </button>
        </section>

        {/* Chemical Section */}
        <section className="mb-10 bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Chemicals in Stock</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            {chemicals.map((chem, idx) => (
              <div key={idx} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <p><strong>{chem.name}</strong></p>
                  <p>Quantity: {chem.quantity}</p>
                  <p>Safety: {chem.safety}</p>
                </div>
                <button
                  onClick={() => handleDeleteChemical(idx)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="border rounded p-2"
              placeholder="Chemical Name"
              value={newChemical.name}
              onChange={(e) => setNewChemical({ ...newChemical, name: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Quantity"
              value={newChemical.quantity}
              onChange={(e) => setNewChemical({ ...newChemical, quantity: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Safety Note"
              value={newChemical.safety}
              onChange={(e) => setNewChemical({ ...newChemical, safety: e.target.value })}
            />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={handleAddChemical}
          >
            Add Chemical
          </button>
        </section>

        {/* Lab Session Section */}
        <section className="mb-10 bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Upcoming Lab Sessions</h2>
          <ul className="list-disc list-inside mb-4">
            {labSessions.map((session, idx) => (
              <li key={idx} className="flex justify-between items-center">
                <span>
                  <strong>{session.subject}</strong>: {session.topic} on <span className="text-blue-600">{session.date}</span>
                </span>
                <button
                  onClick={() => handleDeleteSession(idx)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>

          <div className="grid md:grid-cols-3 gap-4">
            <input
              className="border rounded p-2"
              placeholder="Subject"
              value={newSession.subject}
              onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Topic"
              value={newSession.topic}
              onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
            />
            <input
              className="border rounded p-2"
              type="date"
              value={newSession.date}
              onChange={(e) => setNewSession({ ...newSession, date: e.target.value })}
            />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            onClick={handleAddSession}
          >
            Schedule Lab Session
          </button>
        </section>

        {/* Broken Equipment Reporting */}
        <section className="mb-10 bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Report Broken Equipment</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              className="border rounded p-2"
              placeholder="Student Name"
              value={newIncident.student}
              onChange={(e) => setNewIncident({ ...newIncident, student: e.target.value })}
            />
            <select
              className="border rounded p-2"
              value={newIncident.equipment}
              onChange={(e) => setNewIncident({ ...newIncident, equipment: e.target.value })}
            >
              <option value="">Select Equipment</option>
              {equipment.map((item, idx) => (
                <option key={idx} value={item.name}>{item.name}</option>
              ))}
            </select>
            <input
              className="border rounded p-2"
              type="date"
              value={newIncident.date}
              onChange={(e) => setNewIncident({ ...newIncident, date: e.target.value })}
            />
            <input
              className="border rounded p-2"
              placeholder="Notes (optional)"
              value={newIncident.notes}
              onChange={(e) => setNewIncident({ ...newIncident, notes: e.target.value })}
            />
          </div>
          <button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleAddIncident}
          >
            Submit Report
          </button>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Reported Incidents</h3>
            {incidentReports.length === 0 ? (
              <p className="text-gray-500">No incidents reported yet.</p>
            ) : (
              <ul className="list-disc list-inside space-y-2">
                {incidentReports.map((report, idx) => (
                  <li key={idx}>
                    <strong>{report.student}</strong> broke <strong>{report.equipment}</strong> on <span className="text-blue-600">{report.date}</span>{report.notes && ` - ${report.notes}`}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Lab Safety Guidelines */}
        <section className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Lab Safety Guidelines</h2>
          <ul className="list-decimal list-inside space-y-2">
            <li>Always wear lab coats and protective gear.</li>
            <li>No eating or drinking in the lab.</li>
            <li>Label all chemical containers clearly.</li>
            <li>Report any accidents to the lab technician immediately.</li>
            <li>Ensure proper ventilation when using volatile substances.</li>
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default LabManagement;
