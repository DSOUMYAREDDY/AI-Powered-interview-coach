import React from 'react';

const Dashboard = () => {
  return (
    <div className="container" style={{ padding: '3rem 2rem', maxWidth: '900px' }}>
      <h2 className="mb-4" style={{ color: '#4b5563', fontSize: '1.5rem' }}>Interview Performance Dashboard</h2>

      {/* Top Metrics Cards */}
      <div className="flex gap-4 mb-4" style={{ flexWrap: 'wrap' }}>
        <div className="card flex-col items-center justify-center flex" style={{ flex: 1, minWidth: '200px', backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>Confidence</span>
          <span style={{ color: '#4f46e5', fontSize: '2.5rem', fontWeight: 700 }}>78%</span>
        </div>
        <div className="card flex-col items-center justify-center flex" style={{ flex: 1, minWidth: '200px', backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>Clarity</span>
          <span style={{ color: '#4f46e5', fontSize: '2.5rem', fontWeight: 700 }}>82%</span>
        </div>
        <div className="card flex-col items-center justify-center flex" style={{ flex: 1, minWidth: '200px', backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
          <span style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>Content</span>
          <span style={{ color: '#4f46e5', fontSize: '2.5rem', fontWeight: 700 }}>74%</span>
        </div>
      </div>

      {/* Speech Analysis Section */}
      <div className="card mb-4" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
        <h3 className="mb-3" style={{ fontSize: '1.1rem', color: '#374151' }}>Speech Analysis</h3>
        
        <div className="flex items-center mb-2">
          <span style={{ width: '150px', fontSize: '0.9rem', color: '#4b5563' }}>Clarity</span>
          <div className="progress-container" style={{ flex: 1, height: '6px', backgroundColor: '#e5e7eb' }}>
            <div className="progress-bar" style={{ width: '82%', backgroundColor: '#4f46e5' }}></div>
          </div>
          <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', color: '#6b7280' }}>82%</span>
        </div>
        
        <div className="flex items-center">
          <span style={{ width: '150px', fontSize: '0.9rem', color: '#4b5563' }}>Fillers detected</span>
          <div className="progress-container" style={{ flex: 1, height: '6px', backgroundColor: '#e5e7eb' }}>
            <div className="progress-bar" style={{ width: '15%', backgroundColor: '#ef4444' }}></div>
          </div>
          <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', color: '#6b7280' }}>15%</span>
        </div>
      </div>

      {/* Facial & Body Language Section */}
      <div className="card mb-4" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
        <h3 className="mb-3" style={{ fontSize: '1.1rem', color: '#374151' }}>Facial & Body Language</h3>
        
        <div className="flex items-center mb-3">
          <span style={{ width: '150px', fontSize: '0.9rem', color: '#4b5563' }}>Eye Contact</span>
          <div className="progress-container" style={{ flex: 1, height: '6px', backgroundColor: '#e5e7eb' }}>
            <div className="progress-bar" style={{ width: '88%', backgroundColor: '#4f46e5' }}></div>
          </div>
          <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', color: '#6b7280' }}>88%</span>
        </div>
        
        <div className="flex items-center">
          <span style={{ width: '150px', fontSize: '0.9rem', color: '#4b5563' }}>Posture</span>
          <div className="progress-container" style={{ flex: 1, height: '6px', backgroundColor: '#e5e7eb' }}>
            <div className="progress-bar" style={{ width: '92%', backgroundColor: '#4f46e5' }}></div>
          </div>
          <span style={{ width: '40px', textAlign: 'right', fontSize: '0.85rem', color: '#6b7280' }}>92%</span>
        </div>
      </div>

      {/* AI Feedback Section */}
      <div className="card" style={{ backgroundColor: '#f9fafb', borderColor: '#f3f4f6' }}>
        <h3 className="mb-3" style={{ fontSize: '1.1rem', color: '#374151' }}>AI Feedback</h3>
        <ul style={{ paddingLeft: '1.5rem', color: '#4b5563', fontSize: '0.95rem', lineHeight: '1.8' }}>
          <li>Reduce filler words (e.g., "um", "like").</li>
          <li>Maintain eye contact more consistently with the camera.</li>
          <li>Improve answer structure using the STAR method.</li>
        </ul>
      </div>

    </div>
  );
};

export default Dashboard;
