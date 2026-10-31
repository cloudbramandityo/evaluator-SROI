import React, { useState } from 'react';
import {
  Copy,
  Check,
  Printer,
  Download,
  FileText,
  Building,
  UserCheck,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  SroiResult,
  IkmResult,
  Region,
  ConsultantProfile,
  FinancialProxyItem,
  IkmUnsurScores,
} from '../types/tjsl';
import { formatNumberIndo, UNSUR_IKM_META } from '../utils/sroiIkmCalc';

interface ReportViewProps {
  reportMarkdown: string;
  programName: string;
  companyName: string;
  unitBranch: string;
  region: Region;
  up3Unit: string;
  year: number;
  sroiResult: SroiResult;
  ikmResult: IkmResult;
  consultantProfile?: ConsultantProfile;
  proxies?: FinancialProxyItem[];
  ikmScores?: IkmUnsurScores;
}

export const ReportView: React.FC<ReportViewProps> = ({
  reportMarkdown,
  programName,
  companyName,
  unitBranch,
  region,
  up3Unit,
  year,
  sroiResult,
  ikmResult,
  consultantProfile,
  proxies = [],
  ikmScores,
}) => {
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [showDetailTables, setShowDetailTables] = useState<boolean>(true);

  const company = companyName || 'PT PLN (PERSERO)';
  const unit = unitBranch || 'UID SULSELRABAR';
  const compLabel = company.toUpperCase().includes('PLN') ? 'PLN' : company;

  const consultant = consultantProfile || {
    firmName: 'Konsultan Evaluasi TJSL & Keberlanjutan Independen',
    leadConsultant: 'Ir. Bramandityo, S.T., M.Env., CSRS, CSRA',
    registrationNumber: 'CSRA-SROI/IDN-2024/0988',
    position: 'Lead Sustainability & SROI Evaluator',
    evaluationDate: '31 Oktober 2024',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const blob = new Blob([reportMarkdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Evaluasi_TJSL_${region}_${programName.replace(/\s+/g, '_')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-md overflow-hidden space-y-0 print:border-none print:shadow-none print:rounded-none">
      {/* Injected Print Stylesheet for A4 size & page orientation */}
      <style>{`
        @media print {
          @page {
            size: A4 ${orientation};
            margin: ${orientation === 'landscape' ? '10mm 12mm 10mm 12mm' : '14mm 15mm 14mm 15mm'};
          }
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Top Action Toolbar (Hidden in print) */}
      <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Laporan Resmi Evaluasi TJSL • Format Monokrom A4
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Orientation Selector */}
          <div className="bg-slate-800 p-0.5 rounded-lg text-xs flex border border-slate-700">
            <button
              type="button"
              onClick={() => setOrientation('portrait')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                orientation === 'portrait'
                  ? 'bg-white text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Atur format cetak ke A4 Portrait (Tegak)"
            >
              A4 Portrait
            </button>
            <button
              type="button"
              onClick={() => setOrientation('landscape')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                orientation === 'landscape'
                  ? 'bg-white text-slate-950 font-bold shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Atur format cetak ke A4 Landscape (Mendatar)"
            >
              A4 Landscape
            </button>
          </div>

          {/* Toggle Table Details */}
          <button
            type="button"
            onClick={() => setShowDetailTables(!showDetailTables)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
              showDetailTables
                ? 'bg-slate-800 text-white border-slate-600'
                : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Tampilkan / Sembunyikan tabel rincian pendukung pada lampiran"
          >
            {showDetailTables ? 'Tabel Rincian: Aktif' : 'Tabel Rincian: Nonaktif'}
          </button>

          {/* View Mode Toggle */}
          <div className="bg-slate-800 p-0.5 rounded-lg text-xs flex border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('formatted')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                viewMode === 'formatted'
                  ? 'bg-white text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Dokumen Resmi
            </button>
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                viewMode === 'raw'
                  ? 'bg-white text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Raw Markdown
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition border border-slate-700"
            title="Salin Markdown Lengkap"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Salin</span>
              </>
            )}
          </button>

          {/* Download Markdown */}
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition border border-slate-700"
            title="Unduh file .md"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden sm:inline">.md</span>
          </button>

          {/* Primary Print / Save PDF Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-950 text-xs font-black rounded-lg shadow-sm transition active:scale-95"
            title="Cetak atau Simpan sebagai PDF A4"
          >
            <Printer className="w-4 h-4 text-slate-900" />
            <span>CETAK / SIMPAN PDF</span>
          </button>
        </div>
      </div>

      {/* Raw Markdown View Mode */}
      {viewMode === 'raw' ? (
        <div className="p-6 bg-slate-950 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-slate-800">
          {reportMarkdown}
        </div>
      ) : (
        /* Document Body - Clean Monochrome A4 Format */
        <div
          className={`p-8 sm:p-12 space-y-6 bg-white text-slate-950 font-sans print:p-0 print:space-y-4 print:text-black ${
            orientation === 'landscape' ? 'max-w-6xl mx-auto' : 'max-w-4xl mx-auto'
          }`}
        >
          {/* ============================================================== */}
          {/* KOP SURAT FORMAL RESMI (Monochrome Double-Line Letterhead)     */}
          {/* ============================================================== */}
          <div className="border-b-4 border-double border-slate-950 pb-4 mb-4 break-inside-avoid print-avoid-break">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {/* Formal Corporate Monogram Badge */}
                <div className="w-13 h-13 rounded-lg border-2 border-slate-950 flex flex-col items-center justify-center bg-slate-100 text-slate-950 font-black text-lg tracking-tight shrink-0 shadow-2xs">
                  <span>{compLabel.slice(0, 4)}</span>
                </div>

                <div>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-950 leading-tight">
                    {company}
                  </h2>
                  <p className="text-xs font-bold text-slate-800 leading-snug">
                    {unit} — BIDANG TANGGUNG JAWAB SOSIAL DAN LINGKUNGAN (TJSL)
                  </p>
                  <p className="text-[10px] text-slate-600 mt-0.5">
                    Konsultan Evaluator Independen: <span className="font-semibold text-slate-900">{consultant.firmName}</span>
                  </p>
                </div>
              </div>

              {/* Document Reference Stamp */}
              <div className="text-right shrink-0">
                <div className="inline-block border border-slate-800 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-50">
                  REF: EVAL-TJSL/{year || 2024}/{region.slice(0, 6).toUpperCase()}
                </div>
                <p className="text-[10px] text-slate-600 mt-1">
                  Tanggal: {consultant.evaluationDate || new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </p>
                <p className="text-[9px] text-slate-400 font-mono">
                  Klasifikasi: DOKUMEN RESMI
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================== */}
          {/* JUDUL DOKUMEN & IDENTITAS LAPORAN                             */}
          {/* ============================================================== */}
          <div className="space-y-1.5 break-inside-avoid print-avoid-break border-b border-slate-300 pb-3">
            <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight leading-snug">
              LAPORAN EVALUASI PROGRAM TJSL {company.toUpperCase()} {unit.toUpperCase()}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-800">
              <p>
                <strong className="text-slate-950">Nama Program:</strong> {programName}
              </p>
              <p>
                <strong className="text-slate-950">Wilayah Cakupan:</strong> {region} {up3Unit ? `(${up3Unit})` : ''}
              </p>
            </div>
          </div>

          {/* ============================================================== */}
          {/* SECTION 1: ANALISIS SROI                                       */}
          {/* ============================================================== */}
          <div className="p-4 rounded-lg border border-slate-400 bg-white space-y-3 break-inside-avoid print-avoid-break">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">
                1. ANALISIS SROI (Social Return on Investment)
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-300 rounded">
                Rasio: 1 : {sroiResult.ratio.toFixed(2)}
              </span>
            </div>

            {/* SROI Standard Metrics List */}
            <ul className="space-y-1.5 text-xs text-slate-900 list-disc list-inside">
              <li>
                <strong>Total Investasi (Input):</strong> Rp {formatNumberIndo(sroiResult.totalInvestment)}
              </li>
              <li>
                <strong>Total Dampak Kemanfaatan (Output/Outcome):</strong> Rp {formatNumberIndo(sroiResult.totalBenefit)}
              </li>
              <li>
                <strong>Rasio SROI:</strong> 1 : {sroiResult.ratio.toFixed(2)}
              </li>
              <li className="list-none pt-1">
                <div className="p-2.5 rounded border border-slate-300 bg-slate-50 text-xs text-slate-900 leading-relaxed">
                  <strong>Makna Angka:</strong> "{sroiResult.interpretationText}"
                </div>
              </li>
            </ul>

            {/* Optional Financial Proxy Detail Breakdown Table */}
            {showDetailTables && proxies.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tabel Rincian Monetisasi Dampak (Financial Proxy):
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-slate-300">
                    <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-1.5 border-r border-slate-300">Indikator Dampak</th>
                        <th className="p-1.5 border-r border-slate-300">Stakeholder</th>
                        <th className="p-1.5 border-r border-slate-300 text-center w-16">Vol</th>
                        <th className="p-1.5 border-r border-slate-300 text-right">Nilai Satuan (Rp)</th>
                        <th className="p-1.5 text-right">Subtotal (Rp)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {proxies.map((p, idx) => (
                        <tr key={p.id || idx}>
                          <td className="p-1.5 border-r border-slate-200">
                            <span className="font-medium text-slate-950">{p.description}</span>
                            {p.methodology && (
                              <span className="block text-[10px] text-slate-500 italic">
                                Catatan: {p.methodology}
                              </span>
                            )}
                          </td>
                          <td className="p-1.5 border-r border-slate-200 text-slate-700">{p.stakeholder}</td>
                          <td className="p-1.5 border-r border-slate-200 text-center">{p.quantity}</td>
                          <td className="p-1.5 border-r border-slate-200 text-right">{formatNumberIndo(p.unitProxy)}</td>
                          <td className="p-1.5 text-right font-semibold text-slate-950">
                            {formatNumberIndo(p.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t border-slate-300 font-bold">
                      <tr>
                        <td colSpan={4} className="p-1.5 text-right border-r border-slate-300">
                          Total Dampak Kemanfaatan:
                        </td>
                        <td className="p-1.5 text-right font-black">
                          Rp {formatNumberIndo(sroiResult.totalBenefit)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 2: ANALISIS IKM                                        */}
          {/* ============================================================== */}
          <div className="p-4 rounded-lg border border-slate-400 bg-white space-y-3 break-inside-avoid print-avoid-break">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">
                2. ANALISIS IKM (Indeks Kepuasan Masyarakat)
              </h3>
              <span className="text-[10px] font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-300 rounded">
                Mutu: {ikmResult.grade} ({ikmResult.performance})
              </span>
            </div>

            {/* IKM Standard Metrics List */}
            <ul className="space-y-1.5 text-xs text-slate-900 list-disc list-inside">
              <li>
                <strong>Nilai IKM Konversi:</strong> {ikmResult.convertedScore.toFixed(2)}
              </li>
              <li>
                <strong>Mutu Pelayanan:</strong> Mutu {ikmResult.grade}
              </li>
              <li>
                <strong>Kinerja Unit:</strong> {ikmResult.performance}
              </li>
            </ul>

            {/* Optional 9 Unsur IKM Permenpan-RB Breakdown Table */}
            {showDetailTables && ikmScores && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Tabel Rincian 9 Unsur Pelayanan (Permenpan-RB No. 14 Tahun 2017):
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border border-slate-300">
                    <thead className="bg-slate-100 text-slate-900 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-1.5 border-r border-slate-300 w-12 text-center">Kode</th>
                        <th className="p-1.5 border-r border-slate-300">Unsur Pelayanan</th>
                        <th className="p-1.5 border-r border-slate-300 text-center w-20">Skor (1-4)</th>
                        <th className="p-1.5 border-r border-slate-300 text-center w-20">Bobot</th>
                        <th className="p-1.5 text-right w-24">Tertimbang</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {UNSUR_IKM_META.map((u, i) => {
                        const score = Number(ikmScores[u.key]) || 3.5;
                        const weighted = score / 9;
                        return (
                          <tr key={u.key}>
                            <td className="p-1.5 border-r border-slate-200 text-center font-bold">U{i + 1}</td>
                            <td className="p-1.5 border-r border-slate-200 text-slate-800">
                              <span className="font-semibold text-slate-950">{u.name}</span>
                              <span className="block text-[10px] text-slate-500">{u.desc}</span>
                            </td>
                            <td className="p-1.5 border-r border-slate-200 text-center font-bold">{score.toFixed(2)}</td>
                            <td className="p-1.5 border-r border-slate-200 text-center text-slate-600">0.111</td>
                            <td className="p-1.5 text-right text-slate-900 font-semibold">{weighted.toFixed(3)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-100 border-t border-slate-300 font-bold text-xs">
                      <tr>
                        <td colSpan={2} className="p-1.5 text-right border-r border-slate-300">
                          Rata-rata Nilai Tertimbang (Skala 1 - 4):
                        </td>
                        <td colSpan={3} className="p-1.5 text-right font-black">
                          {ikmResult.averageWeighted.toFixed(3)}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={2} className="p-1.5 text-right border-r border-slate-300">
                          Nilai IKM Konversi (Tertimbang x 25):
                        </td>
                        <td colSpan={3} className="p-1.5 text-right font-black text-slate-950">
                          {ikmResult.convertedScore.toFixed(2)} — Mutu {ikmResult.grade} ({ikmResult.performance})
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* SECTION 3: KESIMPULAN INTEGRATIF & REKOMENDASI STRATEGIS       */}
          {/* ============================================================== */}
          <div className="p-4 rounded-lg border border-slate-400 bg-white space-y-3 break-inside-avoid print-avoid-break">
            <div className="border-b border-slate-200 pb-1.5">
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-950">
                3. KESIMPULAN INTEGRATIF & REKOMENDASI STRATEGIS
              </h3>
            </div>

            <div className="text-xs text-slate-900 leading-relaxed space-y-2">
              {reportMarkdown && reportMarkdown.includes('### 3.') ? (
                <div className="space-y-1.5">
                  {reportMarkdown
                    .split('### 3.')[1]
                    ?.split('\n')
                    .map((line, idx) => {
                      const trimmed = line.trim();
                      if (!trimmed || trimmed.startsWith('#')) return null;
                      if (trimmed.startsWith('-')) {
                        return (
                          <p key={idx} className="flex items-start gap-1.5 text-slate-900 font-medium">
                            <span className="font-bold shrink-0">•</span>
                            <span>{trimmed.replace(/^-\s*/, '')}</span>
                          </p>
                        );
                      }
                      return <p key={idx} className="text-slate-800">{trimmed}</p>;
                    })}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <p>
                    Korelasi antara capaian rasio SROI 1 : {sroiResult.ratio.toFixed(2)} dengan nilai IKM {ikmResult.convertedScore.toFixed(2)} (Mutu {ikmResult.grade} - {ikmResult.performance}) membuktikan bahwa program TJSL {company} di wilayah {region} telah berhasil menciptakan multiplier effect finansial nyata bagi penerima manfaat sekaligus memenuhi ekspektasi mutu layanan publik secara prima.
                  </p>
                  <p className="font-bold text-slate-950 pt-1">Rekomendasi Strategis Keberlanjutan:</p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-bold shrink-0">1.</span>
                    <span>Memperluas skala replikasi program pada klaster produktif sejenis dengan pendampingan teknis intensif dan sistem pemantauan dampak multi-tahun.</span>
                  </p>
                  <p className="flex items-start gap-1.5">
                    <span className="font-bold shrink-0">2.</span>
                    <span>Mengoptimalkan saluran penanganan saran masukan (U8) serta pemeliharaan sarana bantuan guna mempertahankan kepuasan masyarakat pada Kategori A.</span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* LEMBAR PENGESAHAN TANDA TANGAN (Monochrome Signature Block)    */}
          {/* ============================================================== */}
          <div className="pt-4 border-t-2 border-slate-950 grid grid-cols-2 gap-6 text-center text-xs text-slate-950 break-inside-avoid print-avoid-break">
            {/* Consultant Signature Box */}
            <div className="space-y-12 p-3 rounded border border-slate-300 bg-slate-50">
              <div>
                <p className="font-bold text-slate-950 text-xs">
                  Diusulkan & Dianalisis oleh:
                </p>
                <p className="text-[11px] text-slate-700 font-medium">
                  {consultant.firmName}
                </p>
              </div>

              <div>
                <p className="font-black underline text-slate-950 text-xs">
                  {consultant.leadConsultant}
                </p>
                <p className="text-[10px] text-slate-700">{consultant.position}</p>
                <p className="text-[9px] text-slate-500 font-mono">Reg. No: {consultant.registrationNumber}</p>
              </div>
            </div>

            {/* Corporate PIC Signature Box */}
            <div className="space-y-12 p-3 rounded border border-slate-300 bg-slate-50">
              <div>
                <p className="font-bold text-slate-950 text-xs">
                  Mengetahui & Menyetujui:
                </p>
                <p className="text-[11px] text-slate-700 font-medium">
                  {company}
                </p>
              </div>

              <div>
                <p className="font-black underline text-slate-950 text-xs">
                  MANAJER KOMUNIKASI & TJSL
                </p>
                <p className="text-[10px] text-slate-700">{unit}</p>
                <p className="text-[9px] text-slate-500 font-mono">{company}</p>
              </div>
            </div>
          </div>

          {/* Document Footer Note */}
          <div className="pt-2 text-center text-[9px] text-slate-500 font-mono border-t border-slate-200">
            Dokumen ini dicetak secara sah sebagai Laporan Evaluasi Terpadu SROI & 9 Unsur IKM Permenpan-RB No. 14 Tahun 2017 • {company} {unit}
          </div>
        </div>
      )}
    </div>
  );
};
