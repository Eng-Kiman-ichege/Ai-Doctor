export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3 max-w-xs text-center md:text-left">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 relative">
                <img 
                  src="/logo.png" 
                  alt="AI Doctor Pro Logo" 
                  className="w-full h-full object-contain brightness-0 invert opacity-90"
                />
              </div>
              <span className="text-[15px] font-bold text-white tracking-tight">
                AI Doctor <span className="text-sky-400">Pro</span>
              </span>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI-powered health guidance. Instant, private, and always available.
            </p>
            {/* Status badge */}
            <div className="inline-flex items-center gap-1.5 bg-emerald-900/30 border border-emerald-700/40 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-semibold text-emerald-400">All systems operational</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 text-center md:text-left">
            {/* Product */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Product</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "How it works", href: "#how-it-works" },
                  { label: "AI Doctors", href: "#ai-doctors" },
                  { label: "Features", href: "#features" },
                  { label: "Start Consultation", href: "#consultation" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            {/* Company */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">Company</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "About", href: "#" },
                  { label: "Privacy Policy", href: "#" },
                  { label: "Terms of Service", href: "#" },
                  { label: "Contact", href: "#" },
                ].map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-sky-400 transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} AI Doctor Pro. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-slate-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
            </svg>
            Not a substitute for professional medical advice. Always consult a licensed physician.
          </p>
        </div>
      </div>
    </footer>
  );
}
