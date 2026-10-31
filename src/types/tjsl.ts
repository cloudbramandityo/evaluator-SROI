export type Region = string;

export interface ConsultantProfile {
  firmName: string;
  leadConsultant: string;
  registrationNumber: string;
  position: string;
  contactEmail?: string;
  evaluationDate: string;
}

export interface FinancialProxyItem {
  id: string;
  description: string;
  stakeholder: string;
  quantity: number;
  unit: string;
  unitProxy: number; // in IDR
  subtotal: number;  // quantity * unitProxy
  methodology?: string;
}

export interface IkmUnsurScores {
  u1: number; // Persyaratan
  u2: number; // Prosedur
  u3: number; // Waktu Pelayanan / Penyelesaian
  u4: number; // Biaya / Tarif
  u5: number; // Produk Spesifikasi Jenis Pelayanan
  u6: number; // Kompetensi Pelaksana
  u7: number; // Perilaku Pelaksana
  u8: number; // Penanganan Pengaduan, Saran dan Masukan
  u9: number; // Sarana dan Prasarana
}

export interface IkmResult {
  averageWeighted: number; // scale 1 - 4
  convertedScore: number;  // scale 25 - 100
  grade: 'A' | 'B' | 'C' | 'D';
  performance: 'Sangat Baik' | 'Baik' | 'Kurang Baik' | 'Tidak Baik';
}

export interface SroiResult {
  totalInvestment: number;
  totalBenefit: number;
  ratio: number;
  val1000: number;
  interpretationText: string;
}

export interface EvaluationData {
  id?: string;
  programName: string;
  companyName: string;
  unitBranch: string;
  region: string;
  up3Unit?: string;
  year: number;
  pillar: string;
  beneficiariesCount: number;
  investmentInput: number;
  benefitOutput: number;
  proxies: FinancialProxyItem[];
  ikmScores: IkmUnsurScores;
  qualitativeNotes: string;
  reportMarkdown?: string;
  consultantProfile?: ConsultantProfile;
}
