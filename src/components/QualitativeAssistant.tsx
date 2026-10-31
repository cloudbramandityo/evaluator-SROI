import React, { useState } from 'react';
import { ArrowRight, Wand2, RefreshCw, CheckCircle, Lightbulb, FileText } from 'lucide-react';
import { FinancialProxyItem, IkmUnsurScores, Region } from '../types/tjsl';

interface QualitativeAssistantProps {
  programName: string;
  region: Region;
  companyName?: string;
  onApplyConversion: (data: {
    estimatedInvestment?: number;
    proxies: FinancialProxyItem[];
    ikmScores?: IkmUnsurScores;
  }) => void;
}

export const QualitativeAssistant: React.FC<QualitativeAssistantProps> = ({
  programName,
  region,
  companyName = 'PT PLN (PERSERO)',
  onApplyConversion,
}) => {
  const [qualitativeStory, setQualitativeStory] = useState(
    'Bantuan 45 unit pompa air listrik dan infrastruktur penyambungan daya untuk kelompok petani cabai dan bawang di perbukitan Baraka Enrekang. Sebelum ada program ini petani menghabiskan biaya solar Rp 400.000 per bulan per orang dan sering gagal panen saat kemarau. Dengan pompa listrik, petani hemat 70% biaya bahan bakar, panen bertambah 1 kali per tahun dengan tambahan pendapatan sekitar Rp 7.500.000 per petani. Masyarakat dan Gapoktan sangat puas dengan respon cepat petugas saat penyambungan tiang trafo, meskipun di awal sempat bingung persyaratan administrasi proposal.'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<any | null>(null);

  const handleConvert = async () => {
    if (!qualitativeStory.trim()) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/convert-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          qualitativeStory,
          region,
          programName,
          companyName,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses konversi narasi');
      }

      const data = await response.json();
      setPreviewData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Terjadi kesalahan saat konversi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!previewData) return;

    const formattedProxies: FinancialProxyItem[] = (previewData.suggestedProxies || []).map(
      (p: any, idx: number) => ({
        id: `proxy-calc-${Date.now()}-${idx}`,
        description: p.description || 'Dampak kemanfaatan sosial',
        stakeholder: p.stakeholder || 'Penerima Manfaat',
        quantity: p.quantity || 1,
        unit: 'penerima',
        unitProxy: p.unitProxy || 0,
        subtotal: p.subtotal || (p.quantity || 1) * (p.unitProxy || 0),
        methodology: p.methodology || 'Valuasi konversi berbasis proxy metodologis',
      })
    );

    onApplyConversion({
      estimatedInvestment: previewData.estimatedInvestment,
      proxies: formattedProxies,
      ikmScores: previewData.suggestedIkm,
    });
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50/70 via-sky-50/50 to-white rounded-2xl p-6 border border-indigo-100 shadow-xs space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-xs">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              Moda Konversi Narasi Kualitatif ke Financial Proxy
              <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                Moda Konsultan
              </span>
            </h3>
            <p className="text-xs text-slate-600">
              Konversi narasi cerita dampak kualitatif, testimoni penerima manfaat, atau laporan lapangan menjadi indikator Financial Proxy terukur dalam nominal Rupiah.
            </p>
          </div>
        </div>
      </div>

      {/* Input Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <label className="flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            Tuliskan atau Tempelkan Narasi Kualitatif Program TJSL:
          </label>
          <span className="text-slate-400 font-normal">
            Sebutkan dampak ekonomi/sosial, jumlah orang, atau testimoni kepuasan
          </span>
        </div>

        <textarea
          rows={4}
          value={qualitativeStory}
          onChange={(e) => setQualitativeStory(e.target.value)}
          placeholder="Contoh: Bantuan 20 unit perahu motor listrik bagi nelayan... mereka menghemat BBM Rp 50.000 per hari, pendapatan meningkat, dan warga sangat puas..."
          className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-xs leading-relaxed text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
        />
      </div>

      {/* Convert Trigger Button */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-slate-500 italic">
          * Sistem akan mengidentifikasi stakeholder, menentukan proxy finansial (harga/satuan), dan estimasi skor 9 unsur IKM.
        </div>

        <button
          type="button"
          onClick={handleConvert}
          disabled={isLoading || !qualitativeStory.trim()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Memonetisasi Narasi...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4 text-[#FFDE00]" />
              <span>Konversi Narasi ke Financial Proxy</span>
            </>
          )}
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {errorMessage}
        </div>
      )}

      {/* Preview Conversion Result */}
      {previewData && (
        <div className="mt-4 p-4 bg-white border border-indigo-200 rounded-xl space-y-4 shadow-sm animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-950 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Hasil Ekstraksi & Monetisasi Proxy Kualitatif:
            </h4>
            {previewData.estimatedInvestment && (
              <span className="text-xs font-bold text-slate-700">
                Estimasi Investasi: <strong className="text-indigo-700">Rp {Number(previewData.estimatedInvestment).toLocaleString('id-ID')}</strong>
              </span>
            )}
          </div>

          <div className="space-y-2">
            {(previewData.suggestedProxies || []).map((p: any, i: number) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <p className="font-bold text-slate-900">{p.description}</p>
                  <p className="text-[11px] text-slate-500">
                    Stakeholder: <span className="font-semibold text-slate-700">{p.stakeholder}</span> | Metodologi: {p.methodology}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[11px] text-slate-500 block">
                    {p.quantity} x Rp {Number(p.unitProxy).toLocaleString('id-ID')}
                  </span>
                  <span className="font-extrabold text-emerald-700 text-xs">
                    Rp {Number(p.subtotal).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleApply}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition"
            >
              <span>Terapkan Proxy & Skor ke Kalkulator Form</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
