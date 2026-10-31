import React from 'react';
import { X, BookOpen, Calculator, Award, FileText, CheckCircle2 } from 'lucide-react';

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  unitBranch?: string;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({
  isOpen,
  onClose,
  companyName = 'PT PLN (PERSERO)',
  unitBranch = 'UID Sulselrabar',
}) => {
  if (!isOpen) return null;
  const compLabel = companyName.toUpperCase().includes('PLN') ? 'PLN' : companyName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-5 h-5 text-[#FFDE00]" />
            <h3 className="text-base font-bold">
              Pedoman Metodologi Evaluasi TJSL {companyName}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          {/* Section 1: SROI */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2.5">
            <h4 className="text-sm font-bold text-[#005B94] flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              1. Metodologi Social Return on Investment (SROI)
            </h4>
            <p>
              SROI merupakan metode akuntabilitas dampak sosial berbasis prinsip yang mengukur dan memperhitungkan nilai kemanfaatan sosial, ekonomi, dan lingkungan yang diciptakan oleh program TJSL terhadap total investasi yang dikeluarkan.
            </p>
            <div className="p-3 bg-white rounded-lg border border-blue-100 font-mono text-slate-800">
              Rasio SROI = Total Nilai Dampak Kemanfaatan (Financial Proxy) / Total Investasi (Input)
            </div>
            <p className="font-semibold text-slate-900">
              Interpretasi Standar Wajib:
            </p>
            <p className="italic bg-white/80 p-2.5 rounded border border-blue-100">
              "Artinya, setiap Rp1.000,- yang diinvestasikan oleh {compLabel} dalam program ini, memberikan dampak atau manfaat sosial bernilai Rp[Hasil Perhitungan Rasio x 1.000],- bagi masyarakat."
            </p>
          </div>

          {/* Section 2: Permenpan-RB 9 Unsur */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2.5">
            <h4 className="text-sm font-bold text-amber-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600" />
              2. Indeks Kepuasan Masyarakat (Permenpan-RB No. 14 Tahun 2017)
            </h4>
            <p>
              Mengacu pada Peraturan Menteri PAN-RB Nomor 14 Tahun 2017 tentang Pedoman Penyusunan Survei Kepuasan Masyarakat Unit Penyelenggara Pelayanan Publik:
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 font-medium text-slate-800">
              <li>• U1: Persyaratan</li>
              <li>• U2: Prosedur</li>
              <li>• U3: Waktu Pelayanan / Penyelesaian</li>
              <li>• U4: Biaya / Tarif (100% Gratis)</li>
              <li>• U5: Produk Spesifikasi Pelayanan</li>
              <li>• U6: Kompetensi Pelaksana</li>
              <li>• U7: Perilaku Pelaksana</li>
              <li>• U8: Penanganan Pengaduan & Masukan</li>
              <li>• U9: Sarana dan Prasarana</li>
            </ul>

            <div className="pt-2">
              <p className="font-bold text-slate-900 mb-1">Klasifikasi Mutu & Kinerja:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-rose-100 text-rose-900 font-bold">
                  25.00 - 64.99<br />Mutu D (Tidak Baik)
                </div>
                <div className="p-2 rounded bg-amber-100 text-amber-900 font-bold">
                  65.00 - 76.60<br />Mutu C (Kurang Baik)
                </div>
                <div className="p-2 rounded bg-blue-100 text-blue-900 font-bold">
                  76.61 - 88.30<br />Mutu B (Baik)
                </div>
                <div className="p-2 rounded bg-emerald-100 text-emerald-900 font-bold">
                  88.31 - 100.00<br />Mutu A (Sangat Baik)
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Wilayah UID Sulselrabar */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-600" />
              3. Wilayah Kerja PT PLN (Persero) UID Sulselrabar
            </h4>
            <p>
              Mencakup 3 Provinsi dengan 9 Unit Pelaksana Pelayanan Pelanggan (UP3):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-[#0072B5]">Sulawesi Selatan (Sulsel):</strong>
                <p className="text-slate-600 mt-1">UP3 Makassar Selatan, UP3 Makassar Utara, UP3 Palopo, UP3 Bulukumba, UP3 Watampone, UP3 Pinrang.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-[#0072B5]">Sulawesi Tenggara (Sultra):</strong>
                <p className="text-slate-600 mt-1">UP3 Kendari, UP3 Bau-Bau.</p>
              </div>
              <div className="bg-white p-2.5 rounded border border-slate-200">
                <strong className="text-[#0072B5]">Sulawesi Barat (Sulbar):</strong>
                <p className="text-slate-600 mt-1">UP3 Mamuju.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition"
          >
            Tutup Pedoman
          </button>
        </div>
      </div>
    </div>
  );
};
