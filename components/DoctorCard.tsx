import Image from "next/image";
import { Check } from "lucide-react";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  description: string;
  badge?: string;
  badgeColor?: string;
  imageSrc?: string;
  gradient: string;
  icon: string;
  accentBg: string;
  accentBorder: string;
  tags: string[];
  tagColor: string;
}

interface DoctorCardProps {
  doctor: Doctor;
  isSelected?: boolean;
  isBestMatch?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

export function DoctorAvatar({
  imageSrc,
  name,
  gradient,
  icon,
  size = "md",
}: {
  imageSrc?: string;
  name: string;
  gradient: string;
  icon: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-12 h-12 text-xl rounded-lg",
    md: "w-16 h-16 text-2xl rounded-xl",
    lg: "w-20 h-20 text-3xl rounded-2xl",
  };

  if (imageSrc) {
    return (
      <div className={`${sizeClasses[size]} overflow-hidden shadow-md border-2 border-white flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
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
      className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} flex flex-col items-center justify-center shadow-md border-2 border-white flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
    >
      <span className="leading-none">{icon}</span>
      {size !== "sm" && (
        <span className="text-[10px] font-black text-white/80 mt-0.5 tracking-wide">
          {name.split(" ")[1].slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

export default function DoctorCard({
  doctor,
  isSelected,
  isBestMatch,
  onClick,
  compact = false,
}: DoctorCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col items-center text-center rounded-2xl ${doctor.accentBg} border-2 transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-sky-500 shadow-lg shadow-sky-100 -translate-y-1"
          : `${doctor.accentBorder} shadow-sm hover:shadow-md hover:-translate-y-1`
      } ${compact ? "p-4" : "p-6"}`}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white shadow-md z-20">
          <Check className="w-4 h-4" />
        </div>
      )}

      {/* Best Match Badge */}
      {isBestMatch && (
        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 leading-tight z-10 shadow-sm animate-pulse">
          Best Match
        </span>
      )}

      <DoctorAvatar
        imageSrc={doctor.imageSrc}
        name={doctor.name}
        gradient={doctor.gradient}
        icon={doctor.icon}
        size={compact ? "md" : "lg"}
      />

      <h3 className={`font-bold text-slate-800 leading-tight mt-3 ${compact ? "text-sm" : "text-base"}`}>
        {doctor.name}
      </h3>
      <p className="text-[11px] font-semibold text-slate-500 mb-2 leading-tight">
        {doctor.specialty}
      </p>

      {!compact && (
        <p className="text-[12px] text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {doctor.description}
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-1">
        {doctor.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${doctor.tagColor}`}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
