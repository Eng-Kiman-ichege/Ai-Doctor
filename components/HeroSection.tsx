"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-gradient-to-br from-slate-50 via-sky-50 to-teal-50"
    >
      {/* Subtle background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-sky-100/60 blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-teal-100/50 blur-3xl animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-white/40 blur-2xl" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#0ea5e9 1px, transparent 1px), linear-gradient(90deg, #0ea5e9 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center py-16 lg:py-24">
          {/* Left Content */}
          <div className="flex flex-col gap-6 lg:gap-8 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 border border-sky-100 rounded-full px-4 py-2 shadow-sm self-center lg:self-start">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-sky-700 tracking-wide uppercase">
                AI-Powered Health Assistant
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight">
              Describe your symptoms.{" "}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-sky-500 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                  Get guided care
                </span>
                <span className="absolute bottom-1 left-0 right-0 h-3 bg-sky-100/80 -z-0 rounded" />
              </span>{" "}
              instantly.
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              AI-powered health assistant to help you understand your symptoms
              and take the next step — anytime, anywhere, in seconds.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 justify-center lg:justify-start text-center">
              {[
                { value: "2M+", label: "Consultations" },
                { value: "98%", label: "Satisfaction" },
                { value: "24/7", label: "Available" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col">
                  <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
                  <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                id="hero-cta-primary"
                href="/consultation"
                className="group relative inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-sky-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:translate-y-0 text-base"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.87a16 16 0 0 0 6.29 6.29l.98-.98a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                Start Consultation
                <span className="absolute inset-0 rounded-full ring-2 ring-sky-400/0 group-hover:ring-sky-400/40 transition-all duration-300" />
              </Link>
              <a
                id="hero-cta-secondary"
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 hover:border-sky-300 bg-white/80 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-0.5 text-base"
              >
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                How it works
              </a>
            </div>

            {/* Trust line */}
            <p className="text-xs text-slate-400 flex items-center gap-1.5 justify-center lg:justify-start">
              <svg className="w-3.5 h-3.5 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
              </svg>
              No account required · Private &amp; encrypted · Always free to start
            </p>
          </div>

          {/* Right – Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            {/* Floating card decoration */}
            <div className="absolute -top-6 -left-4 sm:left-8 z-20 animate-float">
              <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Diagnosis Ready</p>
                  <p className="text-[11px] text-slate-500">Just now</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-4 right-4 sm:right-8 z-20 animate-float" style={{ animationDelay: "1s" }}>
              <div className="bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Avg. response: 8 sec</p>
                  <p className="text-[11px] text-slate-500">Instant AI guidance</p>
                </div>
              </div>
            </div>

            {/* Main image */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-sky-200 to-teal-200 rounded-[40px] blur-2xl opacity-40 scale-95" />
              <div className="relative bg-white/60 backdrop-blur-sm border border-white/80 rounded-[40px] p-6 sm:p-8 shadow-xl">
                <Image
                  src="/hero-illustration.png"
                  alt="AI-powered medical brain with heartbeat line and DNA strands"
                  width={480}
                  height={480}
                  className="w-full h-auto drop-shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-50">
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
