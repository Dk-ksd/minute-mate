// Recorder.jsx
import { useState, useEffect } from "react";
import { ReactMediaRecorder } from "react-media-recorder";
import axios from "axios";
import { Users, ListChecks, CheckCircle, ClipboardList, Loader2 } from "lucide-react";

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

export default function Recorder() {
  const [meetingId, setMeetingId] = useState(null);
  const [status, setStatus] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (!meetingId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/results/${meetingId}/`);
        setStatus(res.data.status);
        setTranscript(res.data.transcript);
        setSummary(res.data.summary);

        if (res.data.status === "summarized") {
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Error fetching results", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [meetingId]);

  const uploadFile = async (blob) => {
    const form = new FormData();
    form.append("file", blob, "recording.webm");

    try {
      setIsUploading(true);
      const res = await axios.post("http://127.0.0.1:8000/api/uploads/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMeetingId(res.data.id);
      setStatus(res.data.status);
      setTranscript(res.data.transcript);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Record Meeting</h2>

      <ReactMediaRecorder
        audio
        render={({ status: recordStatus, startRecording, stopRecording, mediaBlobUrl }) => (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              
              <p className="text-gray-600">Recorder Status: <span className="font-medium capitalize">{recordStatus}</span></p>
              
              <div className="flex gap-3 mt-4">
                <button
                  onClick={startRecording}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Start
                </button>
                
                <button
                  onClick={stopRecording}
                  disabled={isUploading}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop
                </button>
              </div>
              
              {mediaBlobUrl && (
                <div className="mt-6 w-full">
                  <div className="flex flex-col items-center gap-4">
                    <audio src={mediaBlobUrl} controls className="w-full max-w-md" />
                    
                    <button
                      onClick={async () => {
                        const blob = await fetch(mediaBlobUrl).then((r) => r.blob());
                        uploadFile(blob);
                      }}
                      disabled={isUploading}
                      className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                          </svg>
                          Upload & Process
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      />

      {meetingId && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Meeting ID</p>
              <p className="font-mono text-gray-800 text-sm">{meetingId}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {status === "processing" && <Loader2 className="w-4 h-4 animate-spin" />}
                <span className="capitalize">{status}</span>
              </div>
            </div>
          </div>

          {transcript && (
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
                  <p className="text-gray-700 whitespace-pre-wrap">{transcript}</p>
                </div>
              )}
            </div>
          )}

          <SummarySection summary={summary} />

          {summary && (
            <div className="flex gap-4 mt-6">
              <a
                href={`http://127.0.0.1:8000/api/export/pdf/${meetingId}/`}
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
                href={`http://127.0.0.1:8000/api/export/txt/${meetingId}/`}
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