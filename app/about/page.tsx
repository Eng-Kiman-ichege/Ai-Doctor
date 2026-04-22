"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Shield, Zap, Target, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-600 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
              Our Story
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              Human Expertise meets <br />
              <span className="bg-gradient-to-r from-sky-500 to-teal-500 bg-clip-text text-transparent">
                Artificial Intelligence
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-slate-600 leading-relaxed">
              AI Doctor Pro was born from a simple mission: to make high-quality clinical guidance accessible to everyone, anywhere, at any time.
            </p>
          </div>

          {/* Creator Section */}
          <div className="grid lg:grid-cols-2 gap-12 items-center bg-slate-50 rounded-[40px] p-8 md:p-16 mb-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 text-sky-500 font-bold text-sm mb-4">
                <Star className="w-4 h-4 fill-sky-500" />
                The Founder
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6">
                Meet Evan Chege
              </h2>
              <div className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  As the creator of AI Doctor Pro, Evan Chege envisioned a platform where technology could bridge the gap between initial symptoms and professional care. With a passion for innovative health solutions, Evan built this tool to provide users with a private, instant, and intelligent first point of contact for health concerns.
                </p>
                <p>
                  "I believe that everyone deserves instant access to health information that is structured, medically responsible, and easy to understand. AI Doctor Pro is my contribution to a more connected and informed healthcare future."
                </p>
              </div>
              
              <div className="flex gap-4 mt-8">
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200/60">
                  <p className="text-sm font-bold text-slate-900 mb-1 leading-none">Creator / Developer</p>
                  <p className="text-xs text-slate-500">AI Health Innovations</p>
                </div>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-sky-500/20 blur-3xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-500" />
              <div className="relative overflow-hidden rounded-[32px] border-8 border-white shadow-2xl">
                <img 
                  src="/kimse.png" 
                  alt="Evan Chege - Creator of AI Doctor Pro" 
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-5 rounded-3xl shadow-xl border border-slate-100 hidden sm:block animate-bounce [animation-duration:3s]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5 fill-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900 leading-none">Built for Efficiency</p>
                    <p className="text-[10px] text-slate-500 mt-1">Health in seconds</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Heart className="w-6 h-6 text-rose-500" />,
                title: "Human Centered",
                desc: "We prioritize the user experience and ensure the AI remains supportive and empathetic throughout every consultation."
              },
              {
                icon: <Shield className="w-6 h-6 text-emerald-500" />,
                title: "Privacy First",
                desc: "Your medical history is your private concern. We use state-of-the-art encryption to keep your records secure and confidential."
              },
              {
                icon: <Target className="w-6 h-6 text-sky-500" />,
                title: "Medically Responsible",
                desc: "Our AI is programmed with strict guardrails to suggest conditions cautiously while always prioritizing professional advice."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
