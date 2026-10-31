import React, { useState } from 'react';
import { Plus, Trash2, TrendingUp, DollarSign, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';
import { FinancialProxyItem, SroiResult } from '../types/tjsl';
import { formatNumberIndo } from '../utils/sroiIkmCalc';

interface SroiCalculatorProps {
  investmentInput: number;
  onInvestmentChange: (val: number) => void;
  proxies: FinancialProxyItem[];
  onProxiesChange: (proxies: FinancialProxyItem[]) => void;
  sroiResult: SroiResult;
  companyName?: string;
  onDirectBenefitOverride?: (val: number) => void;
}

export const SroiCalculator: React.FC<SroiCalculatorProps> = ({
  investmentInput,
  onInvestmentChange,
  proxies,
  onProxiesChange,
  sroiResult,
  companyName = 'PLN',
}) => {
  const [showHelper, setShowHelper] = useState(false);
  const compLabel = companyName.toUpperCase().includes('PLN') ? 'PLN' : companyName;

  // Quick chips for investment input
  const quickInvestments = [
    { label: 'Rp 100 Juta', value: 100000000 },
    { label: 'Rp 250 Juta', value: 250000000 },
    { label: 'Rp 320 Juta', value: 320000000 },
    { label: 'Rp 500 Juta', value: 500000000 },
    { label: 'Rp 1 Miliar', value: 1000000000 },
  ];

  const handleAddProxy = () => {
    const newItem: FinancialProxyItem = {
      id: `p-${Date.now()}`,
      description: 'Dampak peningkatan pendapatan / penghematan biaya operasional',
      stakeholder: 'Penerima Manfaat / Kelompok Binaan',
      quantity: 10,
      unit: 'orang/unit',
      unitProxy: 5000000,
      subtotal: 50000000,
      methodology: 'Survei baseline vs endline penerima',
    };
    onProxiesChange([...proxies, newItem]);
  };

  const handleRemoveProxy = (id: string) => {
    onProxiesChange(proxies.filter((p) => p.id !== id));
  };

  const handleUpdateProxy = (
    id: string,
    field: keyof FinancialProxyItem,
    value: string | number
  ) => {
    const updated = proxies.map((item) => {
      if (item.id === id) {
        const next = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitProxy') {
          const q = Number(field === 'quantity' ? value : item.quantity) || 0;
          const u = Number(field === 'unitProxy' ? value : item.unitProxy) || 0;
          next.subtotal = q * u;
        }
        return next;
      }
      return item;
    });
    onProxiesChange(updated);
  };

  const calculatedTotalBenefit = proxies.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6">
      {/* Title & Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-[#0072B5] border border-blue-100">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              1. Analisis SROI (Social Return on Investment)
            </h2>
            <p className="text-xs text-slate-500">
              Evaluasi rasio efektivitas pengembalian dampak sosial & ekonomi atas setiap Rupiah investasi {compLabel}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHelper(!showHelper)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0072B5] hover:text-[#005B94] self-start sm:self-auto"
        >
          <HelpCircle className="w-4 h-4" />
          <span>{showHelper ? 'Sembunyikan Panduan Rumus' : 'Panduan Rumus SROI'}</span>
        </button>
      </div>

      {/* Explanatory Banner */}
      {showHelper && (
        <div className="p-4 bg-sky-50/70 border border-sky-200/70 rounded-xl text-xs text-sky-900 space-y-2">
          <p className="font-bold flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-[#0072B5]" />
            Rumus & Standar Baku TJSL {compLabel}:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>
              <strong>Rasio SROI</strong> = Total Nilai Dampak Kemanfaatan (Financial Proxy) ÷ Total Investasi (Input).
            </li>
            <li>
              <strong>Financial Proxy</strong>: Pendekatan monetisasi atas perubahan sosial, ekonomi, atau lingkungan yang dialami pemangku kepentingan.
            </li>
            <li>
              <strong>Interpretasi Wajib</strong>: Berapa nilai manfaat yang tercipta dari setiap kelipatan Rp 1.000,- modal TJSL {compLabel}.
            </li>
          </ul>
        </div>
      )}

      {/* Section 1: Total Investasi (Input) */}
      <div className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            Total Investasi / Biaya Program (Input):
          </label>
          <span className="text-xs font-medium text-slate-500">
            Format: Nominal Rupiah Riil (Capex + Opex TJSL {compLabel})
          </span>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <span className="text-sm font-bold text-slate-500">Rp</span>
          </div>
          <input
            type="number"
            min="0"
            step="1000000"
            value={investmentInput || ''}
            onChange={(e) => onInvestmentChange(Number(e.target.value) || 0)}
            placeholder="Contoh: 320000000"
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5] focus:border-transparent"
          />
        </div>

        {/* Quick chip values */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-semibold text-slate-400">Pilihan Cepat:</span>
          {quickInvestments.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInvestmentChange(item.value)}
              className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${
                investmentInput === item.value
                  ? 'bg-[#0072B5] text-white border-[#0072B5]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: Financial Proxies Table (Total Dampak Kemanfaatan) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Rincian Dampak Kemanfaatan (Financial Proxy / Outcome)
            </h3>
            <p className="text-xs text-slate-500">
              Tambahkan indikator dampak sosial, ekonomi, atau lingkungan yang dimonetisasi.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddProxy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-[#0072B5] hover:bg-[#005B94] rounded-lg transition shadow-xs self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Indikator Dampak</span>
          </button>
        </div>

        {/* Proxy Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3 w-6/12 sm:w-4/12">Deskripsi Dampak</th>
                <th className="p-3 w-3/12 hidden md:table-cell">Stakeholder</th>
                <th className="p-3 w-2/12 sm:w-1/12 text-center">Jumlah</th>
                <th className="p-3 w-2/12 text-right">Nilai Proxy (Rp)</th>
                <th className="p-3 w-2/12 text-right">Subtotal (Rp)</th>
                <th className="p-3 w-1/12 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {proxies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    Belum ada indikator dampak. Klik <strong>"Tambah Indikator Dampak"</strong> atau gunakan Preset Program di atas.
                  </td>
                </tr>
              ) : (
                proxies.map((proxy) => (
                  <tr key={proxy.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Deskripsi */}
                    <td className="p-2.5">
                      <input
                        type="text"
                        value={proxy.description}
                        onChange={(e) => handleUpdateProxy(proxy.id, 'description', e.target.value)}
                        placeholder="Contoh: Penghematan BBM solar petani"
                        className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072B5]"
                      />
                      <input
                        type="text"
                        value={proxy.methodology || ''}
                        onChange={(e) => handleUpdateProxy(proxy.id, 'methodology', e.target.value)}
                        placeholder="Metodologi / dasar perhitungan (opsional)"
                        className="w-full mt-1 px-2 py-1 bg-transparent text-[11px] text-slate-500 placeholder-slate-400 italic focus:outline-none"
                      />
                    </td>

                    {/* Stakeholder */}
                    <td className="p-2.5 hidden md:table-cell">
                      <input
                        type="text"
                        value={proxy.stakeholder}
                        onChange={(e) => handleUpdateProxy(proxy.id, 'stakeholder', e.target.value)}
                        placeholder="Contoh: 65 Petani Bawang"
                        className="w-full px-2.5 py-1.5 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072B5]"
                      />
                    </td>

                    {/* Kuantitas */}
                    <td className="p-2.5 text-center">
                      <input
                        type="number"
                        min="1"
                        value={proxy.quantity || ''}
                        onChange={(e) => handleUpdateProxy(proxy.id, 'quantity', Number(e.target.value) || 0)}
                        className="w-16 px-2 py-1.5 text-center bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072B5]"
                      />
                      <span className="block text-[10px] text-slate-400 mt-0.5">{proxy.unit || 'unit'}</span>
                    </td>

                    {/* Nilai Proxy */}
                    <td className="p-2.5 text-right">
                      <input
                        type="number"
                        min="0"
                        step="100000"
                        value={proxy.unitProxy || ''}
                        onChange={(e) => handleUpdateProxy(proxy.id, 'unitProxy', Number(e.target.value) || 0)}
                        className="w-28 px-2 py-1.5 text-right bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0072B5]"
                      />
                    </td>

                    {/* Subtotal */}
                    <td className="p-2.5 text-right font-bold text-slate-900">
                      Rp {formatNumberIndo(proxy.subtotal || 0)}
                    </td>

                    {/* Hapus */}
                    <td className="p-2.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveProxy(proxy.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus baris ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
              <tr>
                <td colSpan={4} className="p-3 text-right text-slate-700">
                  Total Dampak Kemanfaatan (Output/Outcome):
                </td>
                <td className="p-3 text-right text-emerald-700 text-sm">
                  Rp {formatNumberIndo(calculatedTotalBenefit)}
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Realtime SROI Result Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {/* Card 1: Input */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Investasi (Input)
          </span>
          <p className="text-lg font-extrabold text-slate-900 mt-1">
            Rp {formatNumberIndo(sroiResult.totalInvestment)}
          </p>
        </div>

        {/* Card 2: Output */}
        <div className="bg-emerald-50/70 rounded-xl p-4 border border-emerald-200">
          <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            Total Dampak (Outcome)
          </span>
          <p className="text-lg font-extrabold text-emerald-900 mt-1">
            Rp {formatNumberIndo(sroiResult.totalBenefit)}
          </p>
        </div>

        {/* Card 3: Rasio */}
        <div className="bg-sky-50/80 rounded-xl p-4 border border-sky-200">
          <span className="text-xs font-semibold text-[#0072B5] uppercase tracking-wider">
            Rasio SROI (1 : Rasio)
          </span>
          <p className="text-2xl font-black text-[#005B94] mt-0.5">
            1 : {sroiResult.ratio.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Mandatory Interpretation Box */}
      <div className="bg-gradient-to-r from-blue-50/90 to-sky-50/90 border border-sky-200/90 rounded-xl p-4">
        <div className="flex items-start gap-2.5">
          <span className="p-1 rounded-md bg-[#0072B5] text-[#FFDE00] font-black text-xs shrink-0 mt-0.5">
            ⚡ MAKNA
          </span>
          <div>
            <p className="text-xs font-bold text-[#005B94] uppercase tracking-wide">
              Interpretasi Angka SROI Wajib:
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-0.5 leading-relaxed">
              "{sroiResult.interpretationText}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
