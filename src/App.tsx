/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Zap,
  Calculator,
  Award,
  FileCheck,
  RefreshCw,
  Building,
  Bookmark,
  Compass,
  UserCheck,
  Settings,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  FileText,
} from 'lucide-react';

import { ConsultantProfile, EvaluationData, FinancialProxyItem, IkmUnsurScores, Region } from './types/tjsl';
import { DEFAULT_PRESET_PROGRAMS, DEFAULT_REGIONS } from './data/presets';
import { calculateIkm, calculateSroi, generateStandardReportText } from './utils/sroiIkmCalc';
import { Navbar } from './components/Navbar';
import { SroiCalculator } from './components/SroiCalculator';
import { IkmCalculator } from './components/IkmCalculator';
import { QualitativeAssistant } from './components/QualitativeAssistant';
import { ReportView } from './components/ReportView';
import { MatrixQuadrant } from './components/MatrixQuadrant';
import { MethodologyModal } from './components/MethodologyModal';
import { ConsultantProfileModal } from './components/ConsultantProfileModal';
import { ScopeSettingsModal } from './components/ScopeSettingsModal';

export default function App() {
  // Configurable Scope State
  const [companyName, setCompanyName] = useState<string>('PT PLN (PERSERO)');
  const [unitBranch, setUnitBranch] = useState<string>('UID Sulselrabar');
  const [regions, setRegions] = useState<string[]>([...DEFAULT_REGIONS]);
  const [presetPrograms, setPresetPrograms] = useState<EvaluationData[]>([...DEFAULT_PRESET_PROGRAMS]);

  // Consultant Profile State
  const [consultantProfile, setConsultantProfile] = useState<ConsultantProfile>({
    firmName: 'Konsultan Evaluasi TJSL & Keberlanjutan Independen',
    leadConsultant: 'Ir. Bramandityo, S.T., M.Env., CSRS, CSRA',
    registrationNumber: 'CSRA-SROI/IDN-2024/0988',
    position: 'Lead Sustainability & SROI Evaluator',
    contactEmail: 'evaluator.tjsl@konsultan-berkelanjutan.id',
    evaluationDate: '31 Oktober 2024',
  });

  // Active Program State
  const initialPreset = presetPrograms[0];
  const [programName, setProgramName] = useState<string>(initialPreset.programName);
  const [region, setRegion] = useState<string>(initialPreset.region || regions[0]);
  const [up3Unit, setUp3Unit] = useState<string>(initialPreset.up3Unit || '');
  const [year, setYear] = useState<number>(initialPreset.year || 2024);
  const [pillar, setPillar] = useState<string>(initialPreset.pillar || 'Pemberdayaan Ekonomi & Lingkungan');
  const [beneficiariesCount, setBeneficiariesCount] = useState<number>(initialPreset.beneficiariesCount || 50);
  const [investmentInput, setInvestmentInput] = useState<number>(initialPreset.investmentInput || 320000000);
  const [proxies, setProxies] = useState<FinancialProxyItem[]>(initialPreset.proxies || []);
  const [ikmScores, setIkmScores] = useState<IkmUnsurScores>(initialPreset.ikmScores);
  const [qualitativeNotes, setQualitativeNotes] = useState<string>(initialPreset.qualitativeNotes || '');

  // UI Flow State
  const [activeTab, setActiveTab] = useState<'form' | 'qualitative' | 'matrix'>('form');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportMarkdown, setReportMarkdown] = useState<string>('');

  // Modals
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);
  const [showConsultantProfileModal, setShowConsultantProfileModal] = useState(false);
  const [showScopeSettingsModal, setShowScopeSettingsModal] = useState(false);

  // Compute total benefit dynamically from proxies
  const totalBenefit = useMemo(() => {
    return proxies.reduce((acc, curr) => acc + (curr.subtotal || 0), 0);
  }, [proxies]);

  // Realtime calculations
  const sroiResult = useMemo(() => {
    return calculateSroi(investmentInput, totalBenefit, companyName);
  }, [investmentInput, totalBenefit, companyName]);

  const ikmResult = useMemo(() => {
    return calculateIkm(ikmScores);
  }, [ikmScores]);

  // Auto-generate standard baseline report on mount
  useEffect(() => {
    const defaultReport = generateStandardReportText({
      programName: initialPreset.programName,
      companyName,
      unitBranch,
      region: initialPreset.region || regions[0],
      investmentInput: initialPreset.investmentInput,
      benefitOutput: initialPreset.benefitOutput,
      ratio: sroiResult.ratio,
      val1000: sroiResult.val1000,
      ikmConverted: ikmResult.convertedScore,
      ikmGrade: ikmResult.grade,
      ikmPerformance: ikmResult.performance,
      conclusionParagraph:
        'Korelasi antara capaian SROI 1 : ' +
        sroiResult.ratio.toFixed(2) +
        ' dengan nilai IKM ' +
        ikmResult.convertedScore.toFixed(2) +
        ' (' +
        ikmResult.performance +
        ') mencerminkan bahwa intervensi TJSL ' +
        companyName +
        ' di wilayah ' +
        region +
        ' tidak hanya berhasil menciptakan multiplier effect finansial nyata bagi penerima manfaat, tetapi juga dieksekusi dengan tata kelola pelayanan yang transparan dan akuntabel.',
      recommendations: [
        'Memperluas replikasi program pada klaster produktif sejenis dengan pendampingan teknis intensif dan monitoring multi-tahun.',
        'Mengoptimalkan saluran penanganan saran masukan (U8) dan survei kepuasan berkala guna mempertahankan mutu kepuasan prima.',
      ],
      consultantProfile,
    });
    setReportMarkdown(defaultReport);
  }, []);

  // Preset selection handler
  const handleLoadPreset = (preset: EvaluationData) => {
    setProgramName(preset.programName);
    if (preset.region) setRegion(preset.region);
    if (preset.up3Unit) setUp3Unit(preset.up3Unit);
    setYear(preset.year || 2024);
    setPillar(preset.pillar || 'Pemberdayaan Ekonomi');
    setBeneficiariesCount(preset.beneficiariesCount || 50);
    setInvestmentInput(preset.investmentInput);
    setProxies(preset.proxies || []);
    setIkmScores(preset.ikmScores);
    setQualitativeNotes(preset.qualitativeNotes || '');

    const b = (preset.proxies || []).reduce((a, c) => a + c.subtotal, 0);
    const sroi = calculateSroi(preset.investmentInput, b, companyName);
    const ikm = calculateIkm(preset.ikmScores);

    const updatedText = generateStandardReportText({
      programName: preset.programName,
      companyName,
      unitBranch,
      region: preset.region || region,
      investmentInput: preset.investmentInput,
      benefitOutput: b,
      ratio: sroi.ratio,
      val1000: sroi.val1000,
      ikmConverted: ikm.convertedScore,
      ikmGrade: ikm.grade,
      ikmPerformance: ikm.performance,
      conclusionParagraph:
        'Korelasi antara capaian SROI 1 : ' +
        sroi.ratio.toFixed(2) +
        ' dengan nilai IKM ' +
        ikm.convertedScore.toFixed(2) +
        ' (' +
        ikm.performance +
        ') mencerminkan bahwa intervensi TJSL ' +
        companyName +
        ' di wilayah ' +
        (preset.region || region) +
        ' memberikan multiplier effect finansial tinggi yang sejalan dengan apresiasi positif penerima manfaat.',
      recommendations: [
        'Memperluas skala intervensi program secara terukur dengan melibatkan asosiasi/koperasi lokal.',
        'Memperkuat mekanisme pemeliharaan infrastruktur dan evaluasi kepuasan pasca-bantuan.',
      ],
      consultantProfile,
    });
    setReportMarkdown(updatedText);
  };

  // Reset form
  const handleReset = () => {
    setProgramName('Program TJSL Pemberdayaan Masyarakat');
    setRegion(regions[0] || 'Sulawesi Selatan');
    setUp3Unit('');
    setYear(new Date().getFullYear());
    setPillar('Pemberdayaan Ekonomi');
    setBeneficiariesCount(25);
    setInvestmentInput(100000000);
    setProxies([
      {
        id: 'p-default',
        description: 'Dampak peningkatan pendapatan usaha binaan',
        stakeholder: 'Pelaku Usaha Lokal',
        quantity: 25,
        unit: 'orang/thn',
        unitProxy: 8000000,
        subtotal: 200000000,
        methodology: 'Survei baseline vs endline penerima',
      },
    ]);
    setIkmScores({
      u1: 3.5,
      u2: 3.4,
      u3: 3.3,
      u4: 3.8,
      u5: 3.6,
      u6: 3.5,
      u7: 3.7,
      u8: 3.2,
      u9: 3.4,
    });
    setQualitativeNotes('Catatan narasi kualitatif awal program.');
  };

  // Generate Comprehensive Report
  const handleGenerateEvaluation = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programName,
          companyName,
          unitBranch,
          region,
          up3Unit,
          year,
          pillar,
          investmentInput,
          benefitOutput: totalBenefit,
          proxies,
          ikmScores,
          ikmConverted: ikmResult.convertedScore,
          ikmGrade: ikmResult.grade,
          ikmPerformance: ikmResult.performance,
          qualitativeNotes,
          consultantProfile,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal memproses evaluasi');
      }

      const data = await response.json();
      if (data.reportMarkdown) {
        setReportMarkdown(data.reportMarkdown);
      }

      // Celebrate success
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#0072B5', '#FFDE00', '#ED1C24', '#10B981'],
        });
      } catch (e) {
        // ignore
      }

      // Smooth scroll to report
      setTimeout(() => {
        const reportEl = document.getElementById('laporan-evaluasi-section');
        if (reportEl) {
          reportEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (error) {
      console.warn('Fallback to local report generation:', error);
      const fallbackReport = generateStandardReportText({
        programName,
        companyName,
        unitBranch,
        region,
        investmentInput,
        benefitOutput: totalBenefit,
        ratio: sroiResult.ratio,
        val1000: sroiResult.val1000,
        ikmConverted: ikmResult.convertedScore,
        ikmGrade: ikmResult.grade,
        ikmPerformance: ikmResult.performance,
        conclusionParagraph: `Berdasarkan analisis integratif, program ${programName} di wilayah ${region} menghasilkan rasio SROI 1 : ${sroiResult.ratio.toFixed(2)} yang menunjukkan pengembalian nilai kemanfaatan yang efektif dan efisien. Capaian ini sejalan dengan hasil IKM sebesar ${ikmResult.convertedScore.toFixed(2)} (Mutu ${ikmResult.grade} - ${ikmResult.performance}), menandakan kepuasan penerima manfaat terhadap transparansi dan kompetensi pelaksanaan TJSL ${companyName} ${unitBranch} berada pada level yang sangat memuaskan.`,
        recommendations: [
          'Memperluas program ke wilayah kabupaten/unit kerja lain dengan mempertahankan kemitraan strategis dengan pemda dan komunitas sasaran.',
          'Melakukan evaluasi berkala terhadap instrumen penanganan keluhan (U8) dan memastikan sarana bantuan dipelihara secara berkelanjutan.',
        ],
        consultantProfile,
      });
      setReportMarkdown(fallbackReport);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-[#0072B5] selection:text-white">
      {/* Top Navigation */}
      <Navbar
        companyName={companyName}
        unitBranch={unitBranch}
        regions={regions}
        selectedRegion={region}
        onSelectRegion={setRegion}
        onOpenConsultantProfile={() => setShowConsultantProfileModal(true)}
        onOpenSettings={() => setShowScopeSettingsModal(true)}
        onOpenMethodology={() => setShowMethodologyModal(true)}
        onReset={handleReset}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#003865] via-[#005B94] to-[#0072B5] text-white p-6 sm:p-10 shadow-xl border border-sky-400/20">
          {/* Subtle Background Pattern */}
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Zap className="w-96 h-96 text-white" />
          </div>

          <div className="relative z-10 max-w-4xl space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-[#FFDE00]">
                <Building className="w-3.5 h-3.5" />
                <span>{companyName} — {unitBranch}</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-semibold text-emerald-300">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Konsultan: {consultantProfile.leadConsultant.split(',')[0]}</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Sistem Evaluator TJSL Terpadu: <br className="hidden sm:inline" />
              SROI & 9 Unsur IKM Permenpan-RB
            </h1>

            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed max-w-2xl font-medium">
              Moda input evaluasi untuk konsultan profesional dalam mengukur akuntabilitas program Tanggung Jawab Sosial dan Lingkungan (TJSL). Mengintegrasikan kalkulasi rasio kemanfaatan finansial (SROI) dengan indeks kepuasan masyarakat Permenpan-RB No. 14/2017.
            </p>
          </div>

          {/* Quick Real Preset Programs */}
          <div className="mt-6 pt-5 border-t border-white/15">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-200">
                Daftar Program Nyata TJSL (Klik untuk Memuat):
              </span>
              <button
                type="button"
                onClick={() => setShowScopeSettingsModal(true)}
                className="text-[11px] font-bold text-[#FFDE00] hover:underline inline-flex items-center gap-1"
              >
                <Settings className="w-3 h-3" />
                <span>Kelola Program & Wilayah</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {presetPrograms.map((p, idx) => {
                const isCurrent = programName === p.programName;
                return (
                  <button
                    key={p.id || idx}
                    type="button"
                    onClick={() => handleLoadPreset(p)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-medium transition flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-[#FFDE00] text-slate-900 font-bold shadow-md'
                        : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-xs border border-white/15'
                    }`}
                  >
                    <Bookmark className="w-3 h-3" />
                    <span className="truncate max-w-[200px] sm:max-w-xs">{p.programName}</span>
                    <span className="text-[10px] opacity-80">({p.region || 'Nasional'})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation for Workflow */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'form'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-4 h-4 text-[#FFDE00]" />
              <span>Kalkulator Rinci (SROI & IKM)</span>
            </button>

            <button
              onClick={() => setActiveTab('qualitative')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'qualitative'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4 text-[#FFDE00]" />
              <span>Konversi Narasi Kualitatif</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
                activeTab === 'matrix'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-purple-300" />
              <span>Matriks Kuadran TJSL</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-semibold">
            <span>Rasio SROI: <strong className="text-[#0072B5]">1 : {sroiResult.ratio.toFixed(2)}</strong></span>
            <span>•</span>
            <span>IKM: <strong className="text-emerald-700">{ikmResult.convertedScore.toFixed(2)} (Mutu {ikmResult.grade})</strong></span>
          </div>
        </div>

        {/* Tab Content: Qualitative Assistant */}
        {activeTab === 'qualitative' && (
          <QualitativeAssistant
            programName={programName}
            region={region}
            companyName={companyName}
            onApplyConversion={({ estimatedInvestment, proxies: newProxies, ikmScores: newScores }) => {
              if (estimatedInvestment && estimatedInvestment > 0) {
                setInvestmentInput(estimatedInvestment);
              }
              if (newProxies && newProxies.length > 0) {
                setProxies(newProxies);
              }
              if (newScores) {
                setIkmScores((prev) => ({ ...prev, ...newScores }));
              }
              setActiveTab('form');
            }}
          />
        )}

        {/* Tab Content: Matrix Quadrant */}
        {activeTab === 'matrix' && (
          <MatrixQuadrant
            sroiResult={sroiResult}
            ikmResult={ikmResult}
            programName={programName}
            companyName={companyName}
            region={region}
          />
        )}

        {/* Tab Content: Detailed Form Builder */}
        {activeTab === 'form' && (
          <div className="space-y-8">
            {/* Program Identity Section (Customizable Instansi, Unit, & Daerah) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#0072B5]" />
                  Identitas & Profil Program TJSL
                </h3>

                <button
                  type="button"
                  onClick={() => setShowScopeSettingsModal(true)}
                  className="text-xs font-bold text-[#0072B5] hover:text-[#005B94] flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Kustomisasi Instansi & Wilayah</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Instansi / Perusahaan */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Instansi / Perusahaan:</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Contoh: PT PLN (PERSERO)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  />
                </div>

                {/* Unit / Cabang */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Unit / Cabang:</label>
                  <input
                    type="text"
                    value={unitBranch}
                    onChange={(e) => setUnitBranch(e.target.value)}
                    placeholder="Contoh: UID Sulselrabar"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  />
                </div>

                {/* Wilayah Cakupan */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">Wilayah Cakupan:</label>
                    <button
                      type="button"
                      onClick={() => setShowScopeSettingsModal(true)}
                      className="text-[10px] text-[#0072B5] font-semibold hover:underline"
                    >
                      + Tambah/Edit
                    </button>
                  </div>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  >
                    {regions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit Pelaksana / Wilayah Detail */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Unit Pelaksana / Wilayah Detail:</label>
                  <input
                    type="text"
                    value={up3Unit}
                    onChange={(e) => setUp3Unit(e.target.value)}
                    placeholder="Contoh: UP3 Pinrang / ULP Enrekang"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  />
                </div>

                {/* Program Name */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Program TJSL:</label>
                  <input
                    type="text"
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder="Contoh: Electrifying Agriculture Pompa Air Listrik"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  />
                </div>

                {/* Pilar TJSL */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Pilar TJSL:</label>
                  <input
                    type="text"
                    value={pillar}
                    onChange={(e) => setPillar(e.target.value)}
                    placeholder="Contoh: Pemberdayaan Ekonomi & Ketahanan Pangan"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  />
                </div>

                {/* Tahun */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Tahun Pelaksanaan:</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value) || 2024)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0072B5]"
                  />
                </div>
              </div>

              {/* Active Consultant Profile Badge Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Konsultan Penyusun Laporan:
                    </span>
                    <p className="font-extrabold text-slate-900">
                      {consultantProfile.leadConsultant}
                      <span className="text-slate-500 font-normal ml-1">({consultantProfile.firmName})</span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConsultantProfileModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 transition self-start sm:self-auto text-xs"
                >
                  Ubah Profil Konsultan
                </button>
              </div>
            </div>

            {/* SROI Calculator Component */}
            <SroiCalculator
              investmentInput={investmentInput}
              onInvestmentChange={setInvestmentInput}
              proxies={proxies}
              onProxiesChange={setProxies}
              sroiResult={sroiResult}
              companyName={companyName}
            />

            {/* IKM Permenpan-RB Calculator Component */}
            <IkmCalculator
              scores={ikmScores}
              onScoreChange={(key, val) => setIkmScores((prev) => ({ ...prev, [key]: val }))}
              ikmResult={ikmResult}
            />

            {/* Narasi Kualitatif Program TJSL */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 block">
                  Narasi Kualitatif Program TJSL & Catatan Lapangan:
                </label>
                <span className="text-[11px] text-slate-400">
                  Gunakan narasi lapangan untuk melengkapi laporan evaluasi
                </span>
              </div>
              <textarea
                rows={3}
                value={qualitativeNotes}
                onChange={(e) => setQualitativeNotes(e.target.value)}
                placeholder="Tuliskan testimoni penerima manfaat, dampak kualitatif, tantangan geografis, efisiensi operasional..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0072B5]"
              />
            </div>
          </div>
        )}

        {/* Generate Button Sticky Bar */}
        <div className="sticky bottom-6 z-30 flex items-center justify-center">
          <div className="bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3">
            <div className="hidden sm:block pl-2">
              <span className="text-[11px] text-slate-400 block font-medium">Status Kompilasi:</span>
              <span className="text-xs text-white font-bold">
                SROI 1:{sroiResult.ratio.toFixed(2)} | IKM {ikmResult.convertedScore.toFixed(2)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleGenerateEvaluation}
              disabled={isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-[#0072B5] to-[#00A2E8] hover:from-[#005B94] hover:to-[#0085CA] text-white font-extrabold text-sm rounded-xl shadow-lg transition flex items-center gap-2.5 active:scale-95 disabled:opacity-70"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#FFDE00]" />
                  <span>Menyusun Laporan Evaluasi...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-[#FFDE00] fill-[#FFDE00]" />
                  <span>SUSUN LAPORAN EVALUASI RESMI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Official Report Display Section */}
        <div id="laporan-evaluasi-section" className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              Laporan Evaluasi Komprehensif TJSL {companyName} {unitBranch}
            </h2>
            <span className="text-xs font-semibold text-slate-500">
              Format Standar Baku BUMN & Permenpan-RB
            </span>
          </div>

          <ReportView
            reportMarkdown={reportMarkdown}
            programName={programName}
            companyName={companyName}
            unitBranch={unitBranch}
            region={region}
            up3Unit={up3Unit}
            year={year}
            sroiResult={sroiResult}
            ikmResult={ikmResult}
            consultantProfile={consultantProfile}
            proxies={proxies}
            ikmScores={ikmScores}
          />
        </div>
      </main>

      {/* Methodology Modal */}
      <MethodologyModal
        isOpen={showMethodologyModal}
        onClose={() => setShowMethodologyModal(false)}
        companyName={companyName}
        unitBranch={unitBranch}
      />

      {/* Consultant Profile Modal */}
      <ConsultantProfileModal
        isOpen={showConsultantProfileModal}
        onClose={() => setShowConsultantProfileModal(false)}
        profile={consultantProfile}
        onSaveProfile={setConsultantProfile}
      />

      {/* Scope Settings Modal (Company, Unit, Regions, Presets) */}
      <ScopeSettingsModal
        isOpen={showScopeSettingsModal}
        onClose={() => setShowScopeSettingsModal(false)}
        companyName={companyName}
        unitBranch={unitBranch}
        regions={regions}
        presets={presetPrograms}
        onSave={({ companyName: newCompany, unitBranch: newUnit, regions: newRegions, presets: newPresets }) => {
          setCompanyName(newCompany);
          setUnitBranch(newUnit);
          setRegions(newRegions);
          setPresetPrograms(newPresets);
          if (!newRegions.includes(region) && newRegions.length > 0) {
            setRegion(newRegions[0]);
          }
        }}
      />

      {/* Footer */}
      <footer className="mt-16 bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-bold text-slate-700">
            {companyName} — {unitBranch}
          </p>
          <p className="text-[11px] text-slate-400">
            Sistem Evaluasi TJSL Terpadu Konsultan Profesional • Berbasis SROI & IKM 9 Unsur Permenpan-RB No. 14/2017
          </p>
        </div>
      </footer>
    </div>
  );
}
