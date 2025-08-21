// UploadAudio.jsx
import React, { useState } from "react";
import axios from "axios";
import { Loader2, FileAudio, UploadCloud } from "lucide-react";
import { Users, ListChecks, CheckCircle, ClipboardList } from "lucide-react";

const SummarySection = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mt-6 space-y-6 text-left">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        Meeting Summary
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-lg font-semibold text-gray-700">Meeting Title</p>
          <p className="text-gray-600">{summary.meeting_title || "N/A"}</p>
        </div>

        <div>
          <h4 className="flex items-center font-semibold text-gray-700 mb-2">
            <Users className="w-5 h-5 mr-2 text-blue-600" /> Participants
          </h4>
          {summary.participants?.length > 0 ? (
            <ul className="space-y-1 text-gray-600">
              {summary.participants.map((p, idx) => (
                <li key={idx} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  {p}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Not specified</p>
          )}
        </div>
      </div>

      <div>
        <h4 className="flex items-center font-semibold text-gray-700 mb-3">
          <ListChecks className="w-5 h-5 mr-2 text-purple-600" /> Key Points
        </h4>
        {summary.key_points?.length > 0 ? (
          <ul className="space-y-2">
            {summary.key_points.map((point, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-purple-500 mr-2">•</span>
                <span className="text-gray-600">{point}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">None</p>
        )}
      </div>

      <div>
        <h4 className="flex items-center font-semibold text-gray-700 mb-3">
          <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Decisions
        </h4>
        {summary.decisions?.length > 0 ? (
          <ul className="space-y-2">
            {summary.decisions.map((d, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-green-500 mr-2">•</span>
                <span className="text-gray-600">{d}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No decisions recorded</p>
        )}
      </div>

      <div>
        <h4 className="flex items-center font-semibold text-gray-700 mb-3">
          <ClipboardList className="w-5 h-5 mr-2 text-red-600" /> Action Items
        </h4>
        {summary.action_items?.length > 0 ? (
          <ul className="space-y-3">
            {summary.action_items.map((item, idx) => (
              <li key={idx} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="font-medium text-gray-800">{item.person}:</span>
                  {item.deadline && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                      Deadline: {item.deadline}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{item.task}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">None</p>
        )}
      </div>
    </div>
  );
};

export default function UploadAudio() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('audio/')) {
      setFile(droppedFile);
    } else {
      setError("Please upload an audio file");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("⚠️ Please select an audio file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(null);

      const res = await axios.post("http://127.0.0.1:8000/api/uploads/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setResponse(res.data);
    } catch (err) {
      setError(err.response ? JSON.stringify(err.response.data) : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Upload Meeting Audio</h2>

      <div 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UploadCloud className="w-8 h-8 text-indigo-600" />
          </div>
          
          <p className="text-gray-600 mb-4">
            Drag & drop your audio file here, or click to browse
          </p>
          
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="hidden"
            id="file-upload"
          />
          
          <label
            htmlFor="file-upload"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            Browse Files
          </label>
          
          {file && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FileAudio className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700 truncate">{file.name}</span>
                <button 
                  onClick={() => setFile(null)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {file && (
        <div className="mt-6 text-center">
          <button
            onClick={handleUpload}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Process Audio
              </>
            )}
          </button>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            Error: {error}
          </div>
        </div>
      )}

      {response && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Meeting ID</p>
              <p className="font-mono text-gray-800 text-sm">{response.id}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                <span className="capitalize">{response.status}</span>
              </div>
            </div>
          </div>

          {response.transcript && (
            <div className="mb-6">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showTranscript ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                    Hide Transcript
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    Show Transcript
                  </>
                )}
              </button>
              
              {showTranscript && (
                <div className="mt-3 p-4 bg-white rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                  <p className="text-gray-700 whitespace-pre-wrap">{response.transcript}</p>
                </div>
              )}
            </div>
          )}

          <SummarySection summary={response.summary} />

          {response.summary && (
            <div className="flex gap-4 mt-6">
              <a
                href={`http://127.0.0.1:8000/api/export/pdf/${response.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export PDF
              </a>
              
              <a
                href={`http://127.0.0.1:8000/api/export/txt/${response.id}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export TXT
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}