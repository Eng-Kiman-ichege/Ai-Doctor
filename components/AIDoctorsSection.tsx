import Image from "next/image";
import Link from "next/link";

/* ──────────────────────────────────────────────
   Avatar: rendered as a real photo OR an SVG
   gradient circle with initials + icon
────────────────────────────────────────────── */
function DoctorAvatar({
  imageSrc,
  name,
  gradient,
  icon,
}: {
  imageSrc?: string;
  name: string;
  gradient: string;
  icon: string;
}) {
  if (imageSrc) {
    return (
      <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md mb-4 border-2 border-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center mb-4 shadow-md border-2 border-white group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
    >
      <span className="text-3xl leading-none">{icon}</span>
      <span className="text-[10px] font-black text-white/80 mt-0.5 tracking-wide">
        {name.split(" ")[1].slice(0, 3).toUpperCase()}
      </span>
    </div>
  );
}

/* ── Doctor data ─────────────────────────────── */
const doctors = [
  {
    name: "Dr. Aria",
    specialty: "General Practitioner",
    description:
      "Your first point of contact for everyday illnesses, colds, infections, and general wellness questions.",
    badge: "Most Popular",
    badgeColor: "bg-sky-100 text-sky-700",
    imageSrc: "/doctors/aria.png",
    gradient: "from-sky-400 to-sky-600",
    icon: "🩺",
    accentBorder: "border-sky-100 hover:border-sky-300",
    accentBg: "bg-sky-50",
    tags: ["Cold & Flu", "Infections", "Wellness"],
    tagColor: "bg-sky-100/80 text-sky-700",
  },
  {
    name: "Dr. Kai",
    specialty: "Mental Health Specialist",
    description:
      "Compassionate support for anxiety, depression, stress, sleep disorders, and emotional well-being.",
    badge: "Top Rated",
    badgeColor: "bg-violet-100 text-violet-700",
    imageSrc: "/doctors/kai.png",
    gradient: "from-violet-400 to-purple-600",
    icon: "🧠",
    accentBorder: "border-violet-100 hover:border-violet-300",
    accentBg: "bg-violet-50",
    tags: ["Anxiety", "Depression", "Sleep"],
    tagColor: "bg-violet-100/80 text-violet-700",
  },
  {
    name: "Dr. Nova",
    specialty: "Nutritionist & Dietitian",
    description:
      "Expert guidance on diet, gut health, food sensitivities, metabolic concerns, and healthy eating habits.",
    badge: "New",
    badgeColor: "bg-emerald-100 text-emerald-700",
    imageSrc: "/doctors/nova.png",
    gradient: "from-emerald-400 to-teal-600",
    icon: "🥗",
    accentBorder: "border-emerald-100 hover:border-emerald-300",
    accentBg: "bg-emerald-50",
    tags: ["Nutrition", "Gut Health", "Weight"],
    tagColor: "bg-emerald-100/80 text-emerald-700",
  },
  {
    name: "Dr. Orion",
    specialty: "Urgent Care Advisor",
    description:
      "Triages urgent symptoms to help you decide whether to seek emergency care or wait for a scheduled visit.",
    badge: "24/7",
    badgeColor: "bg-rose-100 text-rose-700",
    imageSrc: "/doctors/orion.png",
    gradient: "from-rose-400 to-red-600",
    icon: "🚑",
    accentBorder: "border-rose-100 hover:border-rose-300",
    accentBg: "bg-rose-50",
    tags: ["Emergency", "Triage", "Pain"],
    tagColor: "bg-rose-100/80 text-rose-700",
  },
  {
    name: "Dr. Sol",
    specialty: "Dermatologist",
    description:
      "Identifies skin conditions, rashes, acne, eczema, and provides skincare and treatment recommendations.",
    badge: "Trending",
    badgeColor: "bg-amber-100 text-amber-700",
    imageSrc: "/doctors/sol.png",
    gradient: "from-amber-400 to-yellow-600",
    icon: "🧴",
    accentBorder: "border-amber-100 hover:border-amber-300",
    accentBg: "bg-amber-50",
    tags: ["Skin", "Acne", "Eczema"],
    tagColor: "bg-amber-100/80 text-amber-700",
  },
  {
    name: "Dr. Vera",
    specialty: "Cardiologist",
    description:
      "Monitors heart health, interprets cardiac symptoms, advises on blood pressure, cholesterol, and lifestyle risk factors.",
    badge: "Specialist",
    badgeColor: "bg-red-100 text-red-700",
    gradient: "from-red-400 to-rose-600",
    icon: "❤️",
    accentBorder: "border-red-100 hover:border-red-300",
    accentBg: "bg-red-50",
    tags: ["Heart", "Blood Pressure", "Cholesterol"],
    tagColor: "bg-red-100/80 text-red-700",
  },
  {
    name: "Dr. Mira",
    specialty: "Pediatrician",
    description:
      "Child health expert covering infant care, developmental milestones, vaccinations, and common childhood illnesses.",
    badge: "Family",
    badgeColor: "bg-pink-100 text-pink-700",
    gradient: "from-pink-400 to-fuchsia-600",
    icon: "👶",
    accentBorder: "border-pink-100 hover:border-pink-300",
    accentBg: "bg-pink-50",
    tags: ["Children", "Vaccines", "Development"],
    tagColor: "bg-pink-100/80 text-pink-700",
  },
  {
    name: "Dr. Rex",
    specialty: "Orthopedic Specialist",
    description:
      "Diagnoses and advises on joint pain, sports injuries, back pain, fractures, and musculoskeletal disorders.",
    badge: "Sports",
    badgeColor: "bg-orange-100 text-orange-700",
    gradient: "from-orange-400 to-amber-600",
    icon: "🦴",
    accentBorder: "border-orange-100 hover:border-orange-300",
    accentBg: "bg-orange-50",
    tags: ["Joints", "Back Pain", "Sports"],
    tagColor: "bg-orange-100/80 text-orange-700",
  },
  {
    name: "Dr. Lena",
    specialty: "Women's Health",
    description:
      "Comprehensive care for reproductive health, hormonal imbalances, prenatal support, menopause, and PCOS.",
    badge: "Women's",
    badgeColor: "bg-fuchsia-100 text-fuchsia-700",
    gradient: "from-fuchsia-400 to-pink-600",
    icon: "🌸",
    accentBorder: "border-fuchsia-100 hover:border-fuchsia-300",
    accentBg: "bg-fuchsia-50",
    tags: ["Hormones", "Prenatal", "PCOS"],
    tagColor: "bg-fuchsia-100/80 text-fuchsia-700",
  },
  {
    name: "Dr. Zen",
    specialty: "Sleep & Neurology",
    description:
      "Addresses insomnia, migraines, neurological symptoms, sleep apnea, and brain-health optimization strategies.",
    badge: "Neuro",
    badgeColor: "bg-indigo-100 text-indigo-700",
    gradient: "from-indigo-400 to-blue-600",
    icon: "🌙",
    accentBorder: "border-indigo-100 hover:border-indigo-300",
    accentBg: "bg-indigo-50",
    tags: ["Sleep", "Migraines", "Neurology"],
    tagColor: "bg-indigo-100/80 text-indigo-700",
  },
];

/* ── Section ─────────────────────────────────── */
export default function AIDoctorsSection() {
  return (
    <section id="ai-doctors" className="py-24 bg-gradient-to-br from-slate-50 to-sky-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-teal-500 mb-3">
            Meet Your Team
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            AI Doctors, specialized for you
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            10 AI doctors trained across different medical fields — ready to
            listen, analyze, and guide you toward the right care.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
          {doctors.map((doc, idx) => (
            <div
              key={idx}
              className={`group relative flex flex-col items-center text-center rounded-2xl ${doc.accentBg} border-2 ${doc.accentBorder} px-4 pt-6 pb-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer`}
            >
              {/* Badge */}
              <span
                className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${doc.badgeColor} leading-tight`}
              >
                {doc.badge}
              </span>

              {/* Avatar */}
              <DoctorAvatar
                imageSrc={doc.imageSrc}
                name={doc.name}
                gradient={doc.gradient}
                icon={doc.icon}
              />

              {/* Name + specialty */}
              <h3 className="text-[14px] font-bold text-slate-800 leading-tight mb-0.5">
                {doc.name}
              </h3>
              <p className="text-[11px] font-semibold text-slate-500 mb-3 leading-tight">
                {doc.specialty}
              </p>

              {/* Description — hidden on small cards */}
              <p className="text-[11px] text-slate-500 leading-relaxed mb-3 hidden lg:block line-clamp-3">
                {doc.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap justify-center gap-1 mb-4">
                {doc.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.tagColor}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <Link
                href="/consultation"
                className={`inline-flex items-center justify-center gap-1 w-full bg-white border border-slate-200 group-hover:border-transparent group-hover:bg-gradient-to-r group-hover:${doc.gradient} text-slate-700 group-hover:text-white text-[12px] font-semibold py-2 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md`}
              >
                Consult
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 text-center">
          <p className="text-slate-500 text-sm mb-5">
            Not sure which doctor to pick? Start a general consultation and
            we'll match you automatically.
          </p>
          <Link
            id="ai-doctors-cta"
            href="/consultation"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-full shadow-md hover:shadow-sky-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Start Consultation Now
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
