import React, { useState } from 'react';
import { X, UserCheck, Briefcase, Award, Mail, Calendar, Building, CheckCircle2 } from 'lucide-react';
import { ConsultantProfile } from '../types/tjsl';

interface ConsultantProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ConsultantProfile;
  onSaveProfile: (profile: ConsultantProfile) => void;
}

export const ConsultantProfileModal: React.FC<ConsultantProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<ConsultantProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 rounded-lg bg-[#0072B5] text-white">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Profil Konsultan Penyusun Laporan</h3>
              <p className="text-xs text-slate-400">
                Informasi tenaga ahli dan lembaga konsultan evaluator independen
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          {/* Lembaga / Kantor Konsultan */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <Building className="w-4 h-4 text-[#0072B5]" />
              Nama Lembaga / Kantor Konsultan:
            </label>
            <input
              type="text"
              required
              value={formData.firmName}
              onChange={(e) => setFormData({ ...formData, firmName: e.target.value })}
              placeholder="Contoh: PT Cipta Visi Keberlanjutan / Konsultan Independen TJSL"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
            />
          </div>

          {/* Lead Evaluator */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-800 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Nama Lead Consultant / Lead Evaluator (Gelar Lengkap):
            </label>
            <input
              type="text"
              required
              value={formData.leadConsultant}
              onChange={(e) => setFormData({ ...formData, leadConsultant: e.target.value })}
              placeholder="Contoh: Ir. H. Bramandityo, S.T., M.Env., CSRS, CSRA"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Nomor Lisensi / Registrasi */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                No. Registrasi / Sertifikasi Profesi:
              </label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="Contoh: CSRS-CSRA/2024/0988"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
              />
            </div>

            {/* Jabatan / Spesialisasi */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                Jabatan / Peran:
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                placeholder="Contoh: Senior Sustainability & SROI Evaluator"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Kontak */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                Email Kontak Evaluator:
              </label>
              <input
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="konsultan@keberlanjutan.id"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
              />
            </div>

            {/* Tanggal Penyusunan Laporan */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                Tanggal Laporan:
              </label>
              <input
                type="text"
                value={formData.evaluationDate}
                onChange={(e) => setFormData({ ...formData, evaluationDate: e.target.value })}
                placeholder="Contoh: 31 Oktober 2024"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
            Data profil konsultan ini akan otomatis dicantumkan pada kop surat laporan, lembar pengesahan, dan blok tanda tangan dokumen resmi evaluasi.
          </div>

          {/* Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0072B5] hover:bg-[#005B94] text-white font-bold rounded-xl shadow-xs transition flex items-center gap-2"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <span>Simpan Profil Konsultan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
