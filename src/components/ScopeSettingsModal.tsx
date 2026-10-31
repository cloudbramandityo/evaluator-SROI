import React, { useState } from 'react';
import { X, Building2, MapPin, Plus, Trash2, CheckCircle2, BookmarkPlus, Sparkles } from 'lucide-react';
import { EvaluationData } from '../types/tjsl';

interface ScopeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName: string;
  unitBranch: string;
  regions: string[];
  presets: EvaluationData[];
  onSave: (data: {
    companyName: string;
    unitBranch: string;
    regions: string[];
    presets: EvaluationData[];
  }) => void;
}

export const ScopeSettingsModal: React.FC<ScopeSettingsModalProps> = ({
  isOpen,
  onClose,
  companyName,
  unitBranch,
  regions,
  presets,
  onSave,
}) => {
  const [localCompany, setLocalCompany] = useState(companyName);
  const [localUnit, setLocalUnit] = useState(unitBranch);
  const [localRegions, setLocalRegions] = useState<string[]>([...regions]);
  const [newRegionInput, setNewRegionInput] = useState('');
  const [localPresets, setLocalPresets] = useState<EvaluationData[]>([...presets]);
  const [savedNotice, setSavedNotice] = useState(false);

  // New program modal state
  const [newProgName, setNewProgName] = useState('');
  const [newProgRegion, setNewProgRegion] = useState(regions[0] || 'Sulawesi Selatan');
  const [showAddProgram, setShowAddProgram] = useState(false);

  if (!isOpen) return null;

  const handleAddRegion = () => {
    if (!newRegionInput.trim()) return;
    const clean = newRegionInput.trim();
    if (!localRegions.includes(clean)) {
      setLocalRegions([...localRegions, clean]);
    }
    setNewRegionInput('');
  };

  const handleRemoveRegion = (regionToRemove: string) => {
    if (localRegions.length <= 1) {
      alert('Minimal harus ada 1 Daerah Cakupan');
      return;
    }
    setLocalRegions(localRegions.filter((r) => r !== regionToRemove));
  };

  const handleAddCustomProgram = () => {
    if (!newProgName.trim()) return;
    const newProg: EvaluationData = {
      id: `custom-prog-${Date.now()}`,
      programName: newProgName.trim(),
      companyName: localCompany,
      unitBranch: localUnit,
      region: newProgRegion,
      year: new Date().getFullYear(),
      pillar: 'Pemberdayaan Ekonomi & Lingkungan',
      beneficiariesCount: 50,
      investmentInput: 200000000,
      benefitOutput: 500000000,
      proxies: [
        {
          id: `p-${Date.now()}`,
          description: 'Peningkatan pendapatan / penghematan biaya ekonomi',
          stakeholder: 'Penerima Manfaat Lokal',
          quantity: 50,
          unit: 'orang/unit',
          unitProxy: 10000000,
          subtotal: 500000000,
          methodology: 'Survei baseline vs endline',
        },
      ],
      ikmScores: {
        u1: 3.6,
        u2: 3.5,
        u3: 3.5,
        u4: 3.8,
        u5: 3.7,
        u6: 3.6,
        u7: 3.8,
        u8: 3.4,
        u9: 3.5,
      },
      qualitativeNotes: `Program ${newProgName.trim()} di ${newProgRegion}.`,
    };

    setLocalPresets([newProg, ...localPresets]);
    setNewProgName('');
    setShowAddProgram(false);
  };

  const handleRemovePreset = (id?: string, name?: string) => {
    setLocalPresets(localPresets.filter((p) => (id ? p.id !== id : p.programName !== name)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      companyName: localCompany,
      unitBranch: localUnit,
      regions: localRegions,
      presets: localPresets,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Building2 className="w-5 h-5 text-[#FFDE00]" />
            <div>
              <h3 className="text-base font-bold">
                Pengaturan Instansi, Unit, & Daerah Cakupan
              </h3>
              <p className="text-xs text-slate-400">
                Konfigurasi entitas perusahaan, wilayah operasional, dan daftar program nyata TJSL
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

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Section 1: Instansi & Cabang */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#0072B5]" />
              Identitas Instansi / Perusahaan & Unit
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Instansi / Perusahaan:
                </label>
                <input
                  type="text"
                  required
                  value={localCompany}
                  onChange={(e) => setLocalCompany(e.target.value)}
                  placeholder="Contoh: PT PLN (PERSERO)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                />
                <span className="text-[10px] text-slate-400">
                  Default: PT PLN (PERSERO)
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-800">
                  Unit / Cabang:
                </label>
                <input
                  type="text"
                  required
                  value={localUnit}
                  onChange={(e) => setLocalUnit(e.target.value)}
                  placeholder="Contoh: UID Sulselrabar"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                />
                <span className="text-[10px] text-slate-400">
                  Default: UID Sulselrabar
                </span>
              </div>
            </div>
          </div>

          {/* Section 2: Daerah Cakupan (Add/Remove) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Daerah Cakupan (Tambah / Kurangi Manual)
              </h4>
              <span className="text-[11px] text-slate-400">
                {localRegions.length} Wilayah Terdaftar
              </span>
            </div>

            {/* Region Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {localRegions.map((r) => (
                <div
                  key={r}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-800 shadow-2xs"
                >
                  <span>{r}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRegion(r)}
                    className="p-0.5 text-slate-400 hover:text-rose-600 rounded transition"
                    title="Hapus daerah ini"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Input to add region */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newRegionInput}
                onChange={(e) => setNewRegionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRegion();
                  }
                }}
                placeholder="Ketik nama provinsi / kabupaten baru (cth: Gorontalo / Maluku)..."
                className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddRegion}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Daerah</span>
              </button>
            </div>
          </div>

          {/* Section 3: Program Nyata TJSL (Presets & Templates) */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookmarkPlus className="w-4 h-4 text-amber-500" />
                Daftar Program Nyata TJSL (Template Evaluasi)
              </h4>
              <button
                type="button"
                onClick={() => setShowAddProgram(!showAddProgram)}
                className="text-xs font-bold text-[#0072B5] hover:text-[#005B94] inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddProgram ? 'Tutup Form' : 'Tambah Program Nyata Baru'}</span>
              </button>
            </div>

            {showAddProgram && (
              <div className="p-3 bg-white border border-[#0072B5]/30 rounded-xl space-y-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Nama Program Nyata Baru:</label>
                  <input
                    type="text"
                    value={newProgName}
                    onChange={(e) => setNewProgName(e.target.value)}
                    placeholder="Contoh: Bantuan Sarana Pengolahan Ikan Asin Pesisir"
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-800">Wilayah Cakupan Program:</label>
                  <select
                    value={newProgRegion}
                    onChange={(e) => setNewProgRegion(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    {localRegions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddCustomProgram}
                    disabled={!newProgName.trim()}
                    className="px-3.5 py-1.5 bg-[#0072B5] hover:bg-[#005B94] disabled:opacity-50 text-white font-bold rounded-lg text-xs transition"
                  >
                    Simpan ke Daftar Program
                  </button>
                </div>
              </div>
            )}

            {/* List of current presets */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {localPresets.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="p-2.5 rounded-lg bg-white border border-slate-200 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">{p.programName}</p>
                    <p className="text-[11px] text-slate-500">
                      Wilayah: <strong className="text-slate-700">{p.region}</strong> | Input: Rp {Number(p.investmentInput).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePreset(p.id, p.programName)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition shrink-0"
                    title="Hapus program ini"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-200">
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
                  <span>Pengaturan Disimpan!</span>
                </>
              ) : (
                <span>Terapkan Pengaturan</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
