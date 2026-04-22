"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle2, MapPin, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, you'd send this to an API
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left side: Information */}
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                Connect With Us
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                Get in touch with our team
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-lg">
                Have questions about AI Doctor Pro? Whether you're interested in partnership or just want to suggest a new feature, we're here to listen.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-sky-500 shadow-sm border border-slate-100">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Email Us</h3>
                    <p className="text-slate-500 text-sm">Our team will respond within 24 hours.</p>
                    <a href="mailto:malcomchege0582@gmail.com" className="text-sky-600 font-bold text-lg mt-1 block">
                      malcomchege0582@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Live Support</h3>
                    <p className="text-slate-500 text-sm">Integrated AI support available 24/7 inside the app.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-rose-500 shadow-sm border border-slate-100">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Global Accessibility</h3>
                    <p className="text-slate-500 text-sm">Serving users worldwide with digital-first care.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Contact Form */}
            <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-full -translate-y-1/2 translate-x-1/2" />
              
              {submitted ? (
                <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Message Received!</h2>
                  <p className="text-slate-500 leading-relaxed mb-8">
                    Thank you for reaching out, Evan's team will get back to you shortly at the email address provided.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-sky-600 font-bold hover:text-sky-700 transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">First Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Evan"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:border-sky-300 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Last Name</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="Chege"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:border-sky-300 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input 
                      required 
                      type="email" 
                      placeholder="evan@example.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:border-sky-300 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:border-sky-300 outline-none transition-all">
                      <option>General Inquiry</option>
                      <option>Support Request</option>
                      <option>Partnership Interest</option>
                      <option>Feature Suggestion</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Message</label>
                    <textarea 
                      required 
                      rows={4}
                      placeholder="How can we help you today?"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:bg-white focus:border-sky-300 outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    Send Message
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
