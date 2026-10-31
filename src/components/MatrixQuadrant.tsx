import React from 'react';
import { Target, CheckCircle, AlertTriangle, Star, Compass } from 'lucide-react';
import { SroiResult, IkmResult } from '../types/tjsl';

interface MatrixQuadrantProps {
  sroiResult: SroiResult;
  ikmResult: IkmResult;
  programName: string;
  companyName?: string;
  region?: string;
}

export const MatrixQuadrant: React.FC<MatrixQuadrantProps> = ({
  sroiResult,
  ikmResult,
  programName,
  companyName = 'PT PLN (PERSERO)',
  region = 'Sulawesi Selatan',
}) => {
  const compLabel = companyName.toUpperCase().includes('PLN') ? 'PLN' : companyName.slice(0, 3).toUpperCase();
  const sroi = sroiResult.ratio;
  const ikm = ikmResult.convertedScore;

  // Determine quadrant
  // Threshold SROI: 2.0
  // Threshold IKM: 76.61 (Mutu B/A boundary)
  const isHighSroi = sroi >= 2.0;
  const isHighIkm = ikm >= 76.61;

  let currentQuadrant = 1;
  let quadrantTitle = 'Kuadran I: Program Unggulan & Bintang (Star Program)';
  let quadrantColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  let strategicImplication =
    `Program memiliki dampak kemanfaatan finansial/sosial yang sangat tinggi dan didukung oleh kepuasan masyarakat yang sangat baik di wilayah ${region}. Direkomendasikan untuk direplikasi ke unit lainnya dan dijadikan model percontohan.`;

  if (isHighSroi && isHighIkm) {
    currentQuadrant = 1;
    quadrantTitle = 'Kuadran I: Program Unggulan & Bintang (High Impact, High Satisfaction)';
    quadrantColor = 'text-emerald-700 bg-emerald-50 border-emerald-300';
    strategicImplication =
      'Program berkinerja prima di kedua dimensi. Kemanfaatan finansial tinggi (SROI ≥ 2.0) beriringan dengan kepuasan publik tinggi (IKM ≥ 76.61). Layak diusulkan dalam ajang CSR/TJSL Awards BUMN.';
  } else if (!isHighSroi && isHighIkm) {
    currentQuadrant = 2;
    quadrantTitle = 'Kuadran II: Program Populer & Humanis (Moderate SROI, High Satisfaction)';
    quadrantColor = 'text-blue-700 bg-blue-50 border-blue-300';
    strategicImplication =
      'Program sangat disukai masyarakat dan diterima dengan baik, namun monetisasi dampak finansial belum optimal. Fokuskan penguatan pada hilirisasi atau perluasan skala ekonomi penerima manfaat.';
  } else if (isHighSroi && !isHighIkm) {
    currentQuadrant = 3;
    quadrantTitle = 'Kuadran III: Program Efisien Teknis (High SROI, Lower Satisfaction)';
    quadrantColor = 'text-amber-700 bg-amber-50 border-amber-300';
    strategicImplication =
      'Secara kalkulasi finansial program menghasilkan nilai tambah besar, namun persepsi kepuasan masyarakat masih di bawah target (IKM < 76.61). Perlu perbaikan pada prosedur (U2), sosialisasi persyaratan (U1), atau keramahan dan komunikasi pelaksana (U7).';
  } else {
    currentQuadrant = 4;
    quadrantTitle = 'Kuadran IV: Program Perlu Restrukturisasi (Low SROI, Lower Satisfaction)';
    quadrantColor = 'text-rose-700 bg-rose-50 border-rose-300';
    strategicImplication =
      'Program belum memberikan pengembalian sosial yang memadai dan kepuasan penerima masih rendah. Diperlukan audit menyeluruh terhadap desain bantuan, ketepatan sasaran penerima manfaat, dan tata kelola program.';
  }

  // Calculate position coordinates inside relative 0-100% box
  // X: IKM from 25 to 100
  const posX = Math.min(95, Math.max(5, ((ikm - 25) / 75) * 100));
  // Y: SROI from 0 to 5 (inverted for top coordinate)
  const posY = Math.min(95, Math.max(5, 100 - (Math.min(sroi, 5) / 5) * 100));

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-100">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Matriks Integratif SROI vs IKM (Kuadran Portofolio TJSL)
            </h3>
            <p className="text-xs text-slate-500">
              Pemetaan posisi strategis program berdasarkan efisiensi dampak finansial versus persepsi kepuasan penerima.
            </p>
          </div>
        </div>

        <div className={`px-3 py-1 rounded-lg border text-xs font-bold ${quadrantColor}`}>
          Posisi: Kuadran {currentQuadrant}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive 2x2 Plot Box */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white relative select-none">
          {/* Y Axis Label */}
          <div className="absolute -left-1 sm:left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase">
            Rasio SROI (Tinggi →)
          </div>

          {/* Matrix Grid Container */}
          <div className="ml-6 mb-6 h-64 sm:h-72 border-l-2 border-b-2 border-slate-600 relative grid grid-cols-2 grid-rows-2 gap-1 p-1">
            {/* Quadrant III (Top-Left: High SROI, Low IKM) */}
            <div className="bg-slate-800/40 rounded-lg p-2 border border-slate-700/50 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-amber-400">Kuadran III</span>
              <span className="text-[10px] text-slate-400">Efisien Teknis (SROI Tinggi, IKM Rendah)</span>
            </div>

            {/* Quadrant I (Top-Right: High SROI, High IKM) */}
            <div className="bg-emerald-950/30 rounded-lg p-2 border border-emerald-600/40 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" /> Kuadran I
              </span>
              <span className="text-[10px] text-emerald-300/80">Program Unggulan (SROI Tinggi, IKM Tinggi)</span>
            </div>

            {/* Quadrant IV (Bottom-Left: Low SROI, Low IKM) */}
            <div className="bg-rose-950/20 rounded-lg p-2 border border-rose-800/30 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-rose-400">Kuadran IV</span>
              <span className="text-[10px] text-slate-400">Perlu Evaluasi (SROI Rendah, IKM Rendah)</span>
            </div>

            {/* Quadrant II (Bottom-Right: Low SROI, High IKM) */}
            <div className="bg-blue-950/30 rounded-lg p-2 border border-blue-600/40 flex flex-col justify-between">
              <span className="text-[10px] font-bold text-sky-400">Kuadran II</span>
              <span className="text-[10px] text-slate-300">Populer/Humanis (SROI Rendah, IKM Tinggi)</span>
            </div>

            {/* Program Position Indicator Dot */}
            <div
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all duration-500 ease-out"
              style={{
                left: `${posX}%`,
                top: `${posY}%`,
              }}
            >
              <div className="relative flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-7 w-7 rounded-full bg-[#FFDE00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-[#FFDE00] border-2 border-slate-900 shadow-lg text-slate-950 font-black text-[9px] items-center justify-center">
                  {compLabel}
                </span>
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-white text-slate-900 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-30">
                SROI 1:{sroi.toFixed(2)} | IKM {ikm.toFixed(2)}
              </div>
            </div>
          </div>

          {/* X Axis Label */}
          <div className="text-center text-[10px] sm:text-xs font-bold tracking-widest text-slate-400 uppercase ml-6">
            Indeks Kepuasan Masyarakat (IKM) (Tinggi →)
          </div>
        </div>

        {/* Narrative & Strategic Interpretation */}
        <div className="lg:col-span-5 space-y-4">
          <div className={`p-4 rounded-xl border ${quadrantColor}`}>
            <h4 className="text-xs font-black uppercase tracking-wider mb-1">
              {quadrantTitle}
            </h4>
            <p className="text-xs leading-relaxed text-slate-800">
              {strategicImplication}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-600">
            <p className="font-bold text-slate-800">Pedoman Pengambilan Keputusan Manajerial:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px]">
              <li>Ambang Batas SROI Sehat: ≥ 1 : 2.00 (pengembalian ganda nilai modal).</li>
              <li>Ambang Batas IKM Baik: ≥ 76.61 (Mutu B ke atas Permenpan-RB).</li>
              <li>Integrasi ini mencegah bias program "hanya populis tapi boros" atau "efisien tapi ditolak warga".</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
