import React from 'react';
import { Zap, BookOpen, RotateCcw, Building2, ShieldCheck, UserCheck, Settings } from 'lucide-react';
import { Region } from '../types/tjsl';

interface NavbarProps {
  companyName: string;
  unitBranch: string;
  regions: Region[];
  selectedRegion: Region;
  onSelectRegion: (r: Region) => void;
  onOpenConsultantProfile: () => void;
  onOpenSettings: () => void;
  onOpenMethodology: () => void;
  onReset: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  companyName,
  unitBranch,
  regions,
  selectedRegion,
  onSelectRegion,
  onOpenConsultantProfile,
  onOpenSettings,
  onOpenMethodology,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-[#005B94] to-[#0085CA] text-white shadow-md shadow-sky-600/20 border border-sky-400/30">
              <Zap className="w-6 h-6 text-[#FFDE00] fill-[#FFDE00]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#ED1C24] border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                ★
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#0072B5] bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60 max-w-[200px] truncate">
                  {companyName || 'PT PLN (Persero)'}
                </span>
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1 max-w-[180px] truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {unitBranch || 'UID Sulselrabar'}
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Evaluator TJSL <span className="text-[#0072B5]">SROI & IKM</span>
              </h1>
            </div>
          </div>

          {/* Region Tabs & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dynamic Region Pills */}
            <div className="hidden xl:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 max-w-md overflow-x-auto">
              {regions.map((reg) => {
                const active = selectedRegion === reg;
                return (
                  <button
                    key={reg}
                    onClick={() => onSelectRegion(reg)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                      active
                        ? 'bg-[#0072B5] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    {reg}
                  </button>
                );
              })}
            </div>

            {/* Consultant Profile Trigger Button */}
            <button
              onClick={onOpenConsultantProfile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition border border-emerald-300 shadow-xs"
              title="Kelola Profil Konsultan Penyusun Laporan"
            >
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Profil Konsultan</span>
            </button>

            {/* Institution & Scope Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-300"
              title="Atur Instansi, Cabang, dan Tambah/Kurangi Wilayah Cakupan"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Instansi & Wilayah</span>
            </button>

            {/* Methodology Modal Trigger */}
            <button
              onClick={onOpenMethodology}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition border border-slate-300"
              title="Lihat Pedoman Metodologi SROI & Permenpan-RB"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden lg:inline">Pedoman</span>
            </button>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition border border-rose-200"
              title="Reset data formulir ke awal"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
