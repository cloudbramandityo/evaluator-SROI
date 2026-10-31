import { ConsultantProfile, IkmResult, IkmUnsurScores, SroiResult } from '../types/tjsl';

export const UNSUR_IKM_META = [
  {
    key: 'u1' as keyof IkmUnsurScores,
    name: 'Persyaratan',
    desc: 'Kesesuaian persyaratan bantuan/program TJSL dengan ketentuan',
    indicator: 'Kejelasan administrasi & syarat calon penerima manfaat',
  },
  {
    key: 'u2' as keyof IkmUnsurScores,
    name: 'Prosedur',
    desc: 'Kemudahan alur dan tahapan pengajuan hingga realisasi program',
    indicator: 'Proses birokrasi & kejelasan SOP',
  },
  {
    key: 'u3' as keyof IkmUnsurScores,
    name: 'Waktu Pelayanan / Penyelesaian',
    desc: 'Ketepatan jadwal penyaluran bantuan dan pelaksanaan kegiatan',
    indicator: 'Timeline penyaluran & ketepatan janji layanan',
  },
  {
    key: 'u4' as keyof IkmUnsurScores,
    name: 'Biaya / Tarif',
    desc: 'Transparansi bahwa seluruh program TJSL bebas pungutan / 100% gratis',
    indicator: 'Akuntabilitas tanpa potongan bagi penerima',
  },
  {
    key: 'u5' as keyof IkmUnsurScores,
    name: 'Produk Spesifikasi Jenis Pelayanan',
    desc: 'Kualitas dan kesesuaian sarana, alat kerja, atau bantuan yang diterima',
    indicator: 'Kesesuaian spek barang/bantuan dengan kebutuhan penerima',
  },
  {
    key: 'u6' as keyof IkmUnsurScores,
    name: 'Kompetensi Pelaksana',
    desc: 'Keahlian, kecakapan, dan penguasaan materi tim pendamping TJSL',
    indicator: 'Kapasitas teknis & pemahaman tim lapangan',
  },
  {
    key: 'u7' as keyof IkmUnsurScores,
    name: 'Perilaku Pelaksana',
    desc: 'Sikap ramah, komunikatif, solutif, dan integritas petugas TJSL',
    indicator: 'Etika, keramahan, dan responsivitas petugas',
  },
  {
    key: 'u8' as keyof IkmUnsurScores,
    name: 'Penanganan Pengaduan, Saran & Masukan',
    desc: 'Kecepatan tindak lanjut keluhan, masukan, dan evaluasi berkala',
    indicator: 'Saluran pengaduan & evaluasi dua arah',
  },
  {
    key: 'u9' as keyof IkmUnsurScores,
    name: 'Sarana dan Prasarana',
    desc: 'Kenyamanan fasilitas koordinasi, keandalan teknologi dan infrastruktur pendukung',
    indicator: 'Kelayakan sarana sosialisasi & platform monitoring',
  },
];

export function calculateSroi(
  investmentInput: number,
  benefitOutput: number,
  companyName: string = 'PLN'
): SroiResult {
  const safeInvestment = Math.max(0, investmentInput);
  const safeBenefit = Math.max(0, benefitOutput);

  const ratio = safeInvestment > 0 ? Number((safeBenefit / safeInvestment).toFixed(2)) : 0;
  const val1000 = Math.round(ratio * 1000);

  const val1000Formatted = val1000.toLocaleString('id-ID');

  const compLabel = companyName.toUpperCase().includes('PLN') ? 'PLN' : companyName;

  const interpretationText = `Artinya, setiap Rp1.000,- yang diinvestasikan oleh ${compLabel} dalam program ini, memberikan dampak atau manfaat sosial bernilai Rp${val1000Formatted},- bagi masyarakat.`;

  return {
    totalInvestment: safeInvestment,
    totalBenefit: safeBenefit,
    ratio,
    val1000,
    interpretationText,
  };
}

export function calculateIkm(scores: IkmUnsurScores): IkmResult {
  const values = Object.values(scores).map((v) => Number(v) || 0);
  const sum = values.reduce((acc, curr) => acc + curr, 0);

  // Permenpan-RB: Rata-rata tertimbang = sum / 9
  const averageWeighted = Number((sum / 9).toFixed(3));

  // Nilai IKM Konversi = Rata-rata tertimbang * 25 (skala 25 - 100)
  const convertedScore = Number((averageWeighted * 25).toFixed(2));

  let grade: 'A' | 'B' | 'C' | 'D' = 'D';
  let performance: 'Sangat Baik' | 'Baik' | 'Kurang Baik' | 'Tidak Baik' = 'Tidak Baik';

  if (convertedScore >= 88.31) {
    grade = 'A';
    performance = 'Sangat Baik';
  } else if (convertedScore >= 76.61) {
    grade = 'B';
    performance = 'Baik';
  } else if (convertedScore >= 65.00) {
    grade = 'C';
    performance = 'Kurang Baik';
  } else {
    grade = 'D';
    performance = 'Tidak Baik';
  }

  return {
    averageWeighted,
    convertedScore,
    grade,
    performance,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumberIndo(val: number): string {
  return new Intl.NumberFormat('id-ID').format(val);
}

export function generateStandardReportText(params: {
  programName: string;
  region: string;
  companyName?: string;
  unitBranch?: string;
  investmentInput: number;
  benefitOutput: number;
  ratio: number;
  val1000: number;
  ikmConverted: number;
  ikmGrade: string;
  ikmPerformance: string;
  conclusionParagraph: string;
  recommendations: string[];
  consultantProfile?: ConsultantProfile;
}): string {
  const inputFormatted = formatNumberIndo(Math.round(params.investmentInput));
  const outputFormatted = formatNumberIndo(Math.round(params.benefitOutput));
  const val1000Formatted = formatNumberIndo(params.val1000);
  const ratioFormatted = params.ratio.toFixed(2);
  const ikmFormatted = params.ikmConverted.toFixed(2);

  const company = params.companyName || 'PT PLN (PERSERO)';
  const unit = params.unitBranch || 'UID SULSELRABAR';
  const companyShort = company.toUpperCase().includes('PLN') ? 'PLN' : company;

  const recsFormatted = params.recommendations
    .map((r, i) => `- ${r.startsWith(`Rekomendasi ${i + 1}`) ? r : `Rekomendasi ${i + 1}: ${r}`}`)
    .join('\n');

  return `# LAPORAN EVALUASI PROGRAM TJSL ${company.toUpperCase()} ${unit.toUpperCase()}
**Nama Program:** ${params.programName}
**Wilayah Cakupan:** ${params.region}

### 1. ANALISIS SROI (Social Return on Investment)
- **Total Investasi (Input):** Rp ${inputFormatted}
- **Total Dampak Kemanfaatan (Output/Outcome):** Rp ${outputFormatted}
- **Rasio SROI:** 1 : ${ratioFormatted}
- **Makna Angka:** Artinya, setiap Rp1.000,- yang diinvestasikan oleh ${companyShort} dalam program ini, memberikan dampak atau manfaat sosial bernilai Rp${val1000Formatted},- bagi masyarakat.

### 2. ANALISIS IKM (Indeks Kepuasan Masyarakat)
- **Nilai IKM Konversi:** ${ikmFormatted}
- **Mutu Pelayanan:** Mutu ${params.ikmGrade}
- **Kinerja Unit:** ${params.ikmPerformance}

### 3. KESIMPULAN INTEGRATIF & REKOMENDASI STRATEGIS
- ${params.conclusionParagraph}
${recsFormatted}`;
}
