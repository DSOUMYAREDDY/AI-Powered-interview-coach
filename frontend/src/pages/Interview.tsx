import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Play, Square, ArrowRight } from 'lucide-react';

const Interview = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState('Idle');
  const [timer, setTimer] = useState(0);

  // New state variables for the role and dynamic questions
  const [selectedRole, setSelectedRole] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    let interval: number | undefined;
    if (isRecording) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    // Prevent starting before selecting a role
    if (!selectedRole) {
      alert("Please select an Interview Role before starting!");
      return;
    }

    try {
      setStatus("Fetching questions from AI...");
      
      // Fetch dynamic questions from the Python backend
      const response = await fetch("http://localhost:8000/api/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selectedRole })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setQuestions(data.questions);

      // Once questions are fetched, start the camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setIsRecording(true);
      setStatus('Recording');
    } catch (err) {
      console.error("Error accessing camera or fetching API:", err);
      setStatus("Error: Check backend or camera permissions");
    }
  };

  const handleStop = () => {
    setIsRecording(false);
    setStatus('Processing...');
    
    // Stop all tracks to turn off the camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setTimeout(() => setStatus('Idle'), 2000);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Last question completed, go to dashboard
      handleStop();
      navigate('/dashboard');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header className="flex justify-between items-center mb-4 mt-4">
        <h2 style={{ color: '#4b5563' }}>AI-Powered Interview Coach</h2>
        <div style={{ backgroundColor: '#e0e7ff', padding: '0.4rem 1rem', borderRadius: '1rem', color: '#4f46e5', fontWeight: 500, fontSize: '0.9rem' }}>
          ⏱ {formatTime(timer)}
        </div>
      </header>

      {/* Top Controls */}
      <div className="flex gap-6 mb-4" style={{ flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <label className="form-label">Upload Resume</label>
          <div className="flex items-center" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '0.4rem', backgroundColor: '#f9fafb' }}>
            <button className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.85rem', marginRight: '0.5rem', backgroundColor: 'white' }}>Choose File</button>
            <span className="text-muted" style={{ fontSize: '0.85rem' }}>No file chosen</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: '300px' }}>
          <label className="form-label">Select Interview Role</label>
          <select 
            className="form-control" 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="" disabled>-- Select Role --</option>
            <option value="frontend developer">Frontend Developer</option>
            <option value="backend developer">Backend Developer</option>
            <option value="fullstack developer">Fullstack Developer</option>
          </select>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#4b5563' }}>
            Question {questions.length > 0 ? currentQuestionIndex + 1 : 0} of {questions.length || '?'}
          </span>
        </div>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: questions.length > 0 ? `${((currentQuestionIndex + 1) / questions.length) * 100}%` : '0%' }}></div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: '1.5rem', flex: 1 }}>
        
        {/* Camera Preview Mock / Actual Video */}
        <div style={{ backgroundColor: '#1f2937', borderRadius: 'var(--radius-md)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '350px', position: 'relative', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
          
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: stream ? 'block' : 'none' }}
          />
          
          {!stream && (
            <div className="flex items-center gap-2" style={{ color: '#9ca3af', fontWeight: 500 }}>
              <Camera size={24} />
              Camera Preview
            </div>
          )}
          
          {isRecording && (
             <div style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--danger)', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
               <div style={{ width: '8px', height: '8px', backgroundColor: 'white', borderRadius: '50%' }} /> REC
             </div>
          )}
        </div>

        {/* Question & Controls Area */}
        <div className="card flex flex-col justify-center" style={{ backgroundColor: '#f9fafb' }}>
          <h3 className="mb-3" style={{ fontSize: '1.2rem' }}>Interview Question</h3>
          <p className="mb-4" style={{ fontSize: '1.05rem', color: '#4b5563' }}>
            {questions.length > 0 ? questions[currentQuestionIndex] : "Pending AI generation..."}
          </p>
          
          <div className="flex gap-2 mb-3">
            <button className="btn btn-primary" onClick={handleStart} disabled={isRecording} style={{ backgroundColor: '#3b82f6' }}>
              <Play size={16} /> Start
            </button>
            <button className="btn btn-danger" onClick={handleStop} disabled={!isRecording}>
              <Square size={16} fill="currentColor" /> Stop
            </button>
            <button className="btn btn-outline" onClick={handleNext} disabled={!isRecording || questions.length === 0}>
              {questions.length > 0 && currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Interview'} <ArrowRight size={16} />
            </button>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '1rem' }}>
            Status: <span style={{ fontWeight: 600, color: status === 'Recording' ? 'var(--danger)' : '#4b5563' }}>{status}</span>
          </p>

          <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
            Please select role before finishing interview
          </p>
        </div>

      </div>
    </div>
  );
};

export default Interview;
