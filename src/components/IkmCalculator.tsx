import React from 'react';
import { Award, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { IkmResult, IkmUnsurScores } from '../types/tjsl';
import { UNSUR_IKM_META } from '../utils/sroiIkmCalc';

interface IkmCalculatorProps {
  scores: IkmUnsurScores;
  onScoreChange: (key: keyof IkmUnsurScores, value: number) => void;
  ikmResult: IkmResult;
}

export const IkmCalculator: React.FC<IkmCalculatorProps> = ({
  scores,
  onScoreChange,
  ikmResult,
}) => {
  // Preset quick grading for all 9 unsur
  const handleSetAll = (score: number) => {
    UNSUR_IKM_META.forEach((u) => {
      onScoreChange(u.key, score);
    });
  };

  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          indicator: 'bg-emerald-500',
          label: 'Mutu A (Sangat Baik)',
        };
      case 'B':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          indicator: 'bg-blue-500',
          label: 'Mutu B (Baik)',
        };
      case 'C':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          indicator: 'bg-amber-500',
          label: 'Mutu C (Kurang Baik)',
        };
      default:
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          indicator: 'bg-rose-500',
          label: 'Mutu D (Tidak Baik)',
        };
    }
  };

  const gradeInfo = getGradeBadge(ikmResult.grade);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              2. Analisis IKM (Indeks Kepuasan Masyarakat)
            </h2>
            <p className="text-xs text-slate-500">
              Berdasarkan 9 Unsur Pelayanan Sesuai Permenpan-RB Nomor 14 Tahun 2017 (Skala 1 - 4 & Konversi 25 - 100).
            </p>
          </div>
        </div>

        {/* Quick set buttons */}
        <div className="flex items-center gap-1 self-start sm:self-auto bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
          <span className="px-2 text-[11px] text-slate-400">Set Semua:</span>
          <button
            type="button"
            onClick={() => handleSetAll(4)}
            className="px-2.5 py-1 rounded-lg hover:bg-emerald-100 hover:text-emerald-800 transition"
            title="Set semua unsur ke Sangat Baik (4.0)"
          >
            4 (A)
          </button>
          <button
            type="button"
            onClick={() => handleSetAll(3.5)}
            className="px-2.5 py-1 rounded-lg hover:bg-blue-100 hover:text-blue-800 transition"
            title="Set semua unsur ke Baik (3.5)"
          >
            3.5 (B)
          </button>
          <button
            type="button"
            onClick={() => handleSetAll(3.0)}
            className="px-2.5 py-1 rounded-lg hover:bg-amber-100 hover:text-amber-800 transition"
            title="Set semua unsur ke Cukup/Kurang (3.0)"
          >
            3.0 (C)
          </button>
        </div>
      </div>

      {/* 9 Unsur Interactive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {UNSUR_IKM_META.map((unsur, index) => {
          const val = scores[unsur.key] ?? 3;
          return (
            <div
              key={unsur.key}
              className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-[#0072B5]/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-[#0072B5] bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                    U{index + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-800">
                    {val.toFixed(2)} <span className="text-[10px] text-slate-400">/ 4.0</span>
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-1.5">{unsur.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {unsur.desc}
                </p>
              </div>

              {/* 4-Step Choice Buttons */}
              <div className="grid grid-cols-4 gap-1 pt-1">
                {[
                  { score: 1, label: '1 - TB' },
                  { score: 2, label: '2 - KB' },
                  { score: 3, label: '3 - B' },
                  { score: 4, label: '4 - SB' },
                ].map((btn) => {
                  const active = Math.round(val) === btn.score;
                  return (
                    <button
                      key={btn.score}
                      type="button"
                      onClick={() => onScoreChange(unsur.key, btn.score)}
                      className={`py-1.5 px-1 text-[11px] font-bold rounded-lg transition text-center ${
                        active
                          ? btn.score === 4
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : btn.score === 3
                            ? 'bg-[#0072B5] text-white shadow-xs'
                            : btn.score === 2
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>

              {/* Fine tuning slider */}
              <div className="pt-0.5">
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="0.1"
                  value={val}
                  onChange={(e) => onScoreChange(unsur.key, parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0072B5]"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Realtime IKM Output Summary Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hasil Rekapitulasi IKM Permenpan-RB
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-[#FFDE00]">
                {ikmResult.convertedScore.toFixed(2)}
              </span>
              <span className="text-xs text-slate-300 font-medium">
                (Rata-rata Tertimbang: {ikmResult.averageWeighted.toFixed(3)})
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mutu Badge */}
            <div className={`px-4 py-2 rounded-xl border text-sm font-black flex items-center gap-2 ${gradeInfo.bg}`}>
              <span className={`w-2.5 h-2.5 rounded-full ${gradeInfo.indicator} animate-pulse`} />
              Mutu {ikmResult.grade}
            </div>

            {/* Kinerja Unit Badge */}
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FFDE00]" />
              Kinerja: {ikmResult.performance}
            </div>
          </div>
        </div>

        {/* Permenpan-RB Benchmark Interval Visual Scale */}
        <div className="pt-2 border-t border-slate-700/60 space-y-1.5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400">
            <span>25.00 - 64.99 (D: Tidak Baik)</span>
            <span>65.00 - 76.60 (C: Kurang Baik)</span>
            <span>76.61 - 88.30 (B: Baik)</span>
            <span className="text-[#FFDE00]">88.31 - 100 (A: Sangat Baik)</span>
          </div>

          {/* Color Scale Bar */}
          <div className="relative w-full h-3 bg-slate-700 rounded-full overflow-hidden flex">
            <div className="w-[40%] bg-rose-500/80" title="D (25-64.99)" />
            <div className="w-[12%] bg-amber-500/80" title="C (65-76.60)" />
            <div className="w-[12%] bg-blue-500/80" title="B (76.61-88.30)" />
            <div className="w-[36%] bg-emerald-500" title="A (88.31-100)" />

            {/* Needle indicator */}
            <div
              className="absolute top-0 bottom-0 w-1.5 bg-white shadow-lg -ml-0.5 rounded-full"
              style={{
                left: `${Math.min(100, Math.max(0, ((ikmResult.convertedScore - 25) / 75) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
