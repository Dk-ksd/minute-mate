// App.jsx
import { useState } from "react";
import Recorder from "./components/Recorder";
import UploadAudio from "./components/UploadAudio";
import { Mic, FileAudio, FileText, Download, Users, Sparkles, Clock, CheckCircle, Mail, Phone } from "lucide-react";

export default function App() {
  const [mode, setMode] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex flex-col">
      {/* Navbar */}
      <header className="w-full bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-2 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              MinuteMate
            </h1>
          </div>
          <nav className="hidden md:flex gap-6 text-gray-600 font-medium">
            <a href="#" className="hover:text-indigo-600 transition-colors">Home</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-col flex-1 items-center justify-center px-6 text-center py-12">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles  className="w-4 h-4" /> AI-Powered Meeting Assistant
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Transform Meetings Into
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"> Actionable Notes</span>
          </h2>
          
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Record, transcribe, and summarize meetings. Get structured notes with key decisions, action items, and highlights—all automatically.
          </p>

          {/* Mode Selection Card */}
          <div  className="mt-12 w-full max-w-2xl mx-auto bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-8 border border-gray-100">
            {!mode ? (
              <div className="space-y-6">
                <h3 className="text-2xl font-semibold text-gray-800">Get Started</h3>
                <p className="text-gray-500">Choose how you'd like to process your meeting</p>
                
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <button
                    onClick={() => setMode("record")}
                    className="group flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:border-green-200 transition-all hover:shadow-md"
                  >
                    <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                      <Mic className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Record Live</h4>
                    <p className="text-sm text-gray-500 text-center">Record a meeting in real-time</p>
                  </button>
                  
                  <button
                    onClick={() => setMode("upload")}
                    className="group flex flex-col items-center justify-center gap-4 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:border-blue-200 transition-all hover:shadow-md"
                  >
                    <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                      <FileAudio className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-800">Upload Audio</h4>
                    <p className="text-sm text-gray-500 text-center">Upload an existing recording</p>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-left">
                <button
                  onClick={() => setMode(null)}
                  className="flex items-center gap-2 mb-6 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to options
                </button>
                {mode === "record" && <Recorder />}
                {mode === "upload" && <UploadAudio />}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How MinuteMate Works</h3>
            <p className="text-lg text-gray-600">Three simple steps to transform your meetings</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">1</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Record or Upload</h4>
              <p className="text-gray-600">Start by recording a live meeting or uploading an existing audio file</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">2</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">AI Processing</h4>
              <p className="text-gray-600">Our AI transcribes and analyzes the conversation to extract key information</p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-indigo-600">3</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-800 mb-2">Get Results</h4>
              <p className="text-gray-600">Receive a structured summary with decisions, action items, and key points</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Powerful Features</h3>
            <p className="text-lg text-gray-600">Everything you need for effective meeting management</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Live Recording</h4>
              <p className="text-gray-600 text-sm">Capture meetings in real-time with high quality audio</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">AI Summaries</h4>
              <p className="text-gray-600 text-sm">Get structured meeting summaries with key insights</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Export & Share</h4>
              <p className="text-gray-600 text-sm">Download results as PDF or TXT to share with your team</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Action Items</h4>
              <p className="text-gray-600 text-sm">Never miss important tasks with clear action items</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to transform your meetings?</h3>
          <p className="text-xl text-indigo-100 mb-8">Join teams using MinuteMate to save time and improve productivity</p>
          <button
            onClick={() => setMode(null)}
            className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            <a href="#">Get Started Now</a>
          </button>
        </div>
      </section> */}

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h3>
            <p className="text-lg text-gray-600">Have questions or need support? We're here to help.</p>
          </div>
          
          <div className="max-w-md mx-auto bg-gray-50 p-8 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Email Us</h4>
                <a href="mailto:abcdefghijk@gmail.com" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  mrdeekshithk@gmail.com
                </a>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Call Us</h4>
                <a href="tel:1234567890" className="text-indigo-600 hover:text-indigo-700 transition-colors">
                  +91 7012611244
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
            <h4 className="text-xl font-bold">MinuteMate</h4>
          </div>
          
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            AI-powered meeting assistant that helps you focus on what matters most.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
          
          <p className="text-gray-400">© {new Date().getFullYear()} MinuteMate. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}