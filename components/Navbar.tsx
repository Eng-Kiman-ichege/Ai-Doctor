"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="AI Doctor Pro Logo" 
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-[15px] font-bold text-slate-800 tracking-tight">
            AI Doctor <span className="text-sky-500">Pro</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200"
          >
            How it works
          </a>
          <a
            href="#ai-doctors"
            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200"
          >
            AI Doctors
          </a>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200"
          >
            Contact
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200"
          >
            Features
          </a>
          <SignedIn>
            <Link
              href="/profile"
              className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors duration-200"
            >
              Medical Hub
            </Link>
          </SignedIn>
        </div>

        {/* CTA + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="hidden sm:inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-sky-300 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-full shadow-sm transition-all duration-300 hover:bg-sky-50">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 border-2 border-sky-100 ring-2 ring-white"
                }
              }}
            />
          </SignedIn>

          <Link
            id="nav-cta"
            href="/consultation"
            className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md hover:shadow-sky-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            <svg
              className="w-4 h-4"
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
          </Link>

          {/* Hamburger */}
          <button
            id="mobile-menu-toggle"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        } bg-white border-t border-slate-100`}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            How it works
          </a>
          <a
            href="#ai-doctors"
            className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            AI Doctors
          </a>
          <Link
            href="/about"
            className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
          <a
            href="#features"
            className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Features
          </a>
          <SignedIn>
            <Link
              href="/profile"
              className="text-sm font-medium text-slate-700 hover:text-sky-600 py-2 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Medical Hub
            </Link>
          </SignedIn>
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold px-5 py-3 rounded-full shadow-md mt-1"
            onClick={() => setMenuOpen(false)}
          >
            Start Consultation
          </Link>
        </div>
      </div>
    </header>
  );
}
