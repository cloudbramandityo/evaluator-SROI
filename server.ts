import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Engine Client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Endpoint: Evaluasi Komprehensif TJSL
app.post('/api/evaluate', async (req: Request, res: Response) => {
  try {
    const {
      programName,
      companyName,
      unitBranch,
      region,
      up3Unit,
      year,
      pillar,
      investmentInput,
      benefitOutput,
      proxies,
      ikmScores,
      ikmConverted,
      ikmGrade,
      ikmPerformance,
      qualitativeNotes,
      consultantProfile,
    } = req.body;

    const company = companyName || 'PT PLN (PERSERO)';
    const unit = unitBranch || 'UID SULSELRABAR';
    const compLabel = company.toUpperCase().includes('PLN') ? 'PLN' : company;

    const ratio =
      investmentInput > 0
        ? Number((benefitOutput / investmentInput).toFixed(2))
        : 0;
    const val1000 = Math.round(ratio * 1000);
    const ratioFormatted = ratio.toFixed(2);
    const outputFormatted = Math.round(benefitOutput).toLocaleString('id-ID');
    const inputFormatted = Math.round(investmentInput).toLocaleString('id-ID');
    const val1000Formatted = val1000.toLocaleString('id-ID');

    if (!ai) {
      // Deterministic calculation for professional evaluator
      const text = `# LAPORAN EVALUASI PROGRAM TJSL ${company.toUpperCase()} ${unit.toUpperCase()}
**Nama Program:** ${programName || 'Program TJSL'}
**Wilayah Cakupan:** ${region || 'Sulawesi Selatan'}

### 1. ANALISIS SROI (Social Return on Investment)
- **Total Investasi (Input):** Rp ${inputFormatted}
- **Total Dampak Kemanfaatan (Output/Outcome):** Rp ${outputFormatted}
- **Rasio SROI:** 1 : ${ratioFormatted}
- **Makna Angka:** Artinya, setiap Rp1.000,- yang diinvestasikan oleh ${compLabel} dalam program ini, memberikan dampak atau manfaat sosial bernilai Rp${val1000Formatted},- bagi masyarakat.

### 2. ANALISIS IKM (Indeks Kepuasan Masyarakat)
- **Nilai IKM Konversi:** ${Number(ikmConverted).toFixed(2)}
- **Mutu Pelayanan:** Mutu ${ikmGrade}
- **Kinerja Unit:** ${ikmPerformance}

### 3. KESIMPULAN INTEGRATIF & REKOMENDASI STRATEGIS
- Berdasarkan integrasi evaluasi oleh konsultan profesional, program ini mencatatkan rasio SROI 1 : ${ratioFormatted} yang menunjukkan efektivitas penciptaan nilai sosial dan ekonomi yang berkelanjutan di wilayah ${region}, didukung oleh kepuasan pemangku kepentingan dengan IKM ${Number(ikmConverted).toFixed(2)} (${ikmPerformance}). Tingginya kemanfaatan finansial selaras dengan persepsi positif penerima manfaat terhadap komitmen ${compLabel}.
- Rekomendasi 1: Memperluas skala intervensi program secara bertahap pada klaster sasaran serupa di unit kerja ${unit} dengan mempertahankan standar pendampingan teknis.
- Rekomendasi 2: Memperkuat sistem pemantauan dampak berkala dan integrasi saluran pengaduan serta saran masukan (U8) guna memastikan retensi kemanfaatan aset jangka panjang.`;

      return res.json({
        reportMarkdown: text,
        ratio,
        val1000,
        ikmConverted,
        ikmGrade,
        ikmPerformance,
      });
    }

    const prompt = `Anda adalah Evaluator Ahli TJSL untuk ${company} ${unit}.
Tugas utama Anda adalah menyusun Laporan Evaluasi Komprehensif untuk konsultan profesional yang mengintegrasikan dua alat ukur: Social Return on Investment (SROI) dan Indeks Kepuasan Masyarakat (IKM).

Data Program TJSL yang dievaluasi:
- Instansi/Perusahaan: ${company}
- Unit/Cabang: ${unit}
- Nama Program: ${programName}
- Wilayah Cakupan: ${region} ${up3Unit ? `(Unit: ${up3Unit})` : ''}
- Tahun Pelaksanaan: ${year || 2024}
- Pilar TJSL: ${pillar || 'Pemberdayaan Ekonomi / Lingkungan'}
- Total Investasi (Input): Rp ${investmentInput}
- Total Dampak Kemanfaatan (Output/Outcome): Rp ${benefitOutput}
- Rincian Proxy Finansial / Dampak: ${JSON.stringify(proxies || [])}
- Skor 9 Unsur IKM (Skala 1-4): ${JSON.stringify(ikmScores || {})}
- Nilai IKM Konversi Dihitung: ${Number(ikmConverted).toFixed(2)}
- Mutu Pelayanan: ${ikmGrade}
- Kinerja Unit: ${ikmPerformance}
- Catatan Kualitatif Tambahan: ${qualitativeNotes || 'Tidak ada catatan tambahan'}
- Profil Konsultan Penyusun: ${JSON.stringify(consultantProfile || {})}

PANDUAN PERHITUNGAN DAN ATURAN WAJIB:
1. SROI:
   - Rasio SROI = Total Nilai Dampak Kemanfaatan (Financial Proxy) / Total Investasi (Input).
   - Tampilkan Rasio dalam format "1 : [Hasil Rasio dengan 2 desimal]".
   - Makna Angka WAJIB PERSIS BERIKUT:
     "Artinya, setiap Rp1.000,- yang diinvestasikan oleh ${compLabel} dalam program ini, memberikan dampak atau manfaat sosial bernilai Rp[Hasil Perhitungan Rasio x 1.000],- bagi masyarakat." (format angka dengan pemisah ribuan).

2. IKM (9 Unsur Permenpan-RB Nomor 14 Tahun 2017):
   - Nilai IKM Konversi: ${Number(ikmConverted).toFixed(2)}
   - Mutu Pelayanan: Mutu ${ikmGrade}
   - Kinerja Unit: ${ikmPerformance}

3. FORMAT OUTPUT HARUS SELALU STRUKTUR BERIKUT (JANGAN UBAH SUSUNAN HEADER / FORMAT INI):
---
# LAPORAN EVALUASI PROGRAM TJSL ${company.toUpperCase()} ${unit.toUpperCase()}
**Nama Program:** [Nama Program]
**Wilayah Cakupan:** [Wilayah Cakupan]

### 1. ANALISIS SROI (Social Return on Investment)
- **Total Investasi (Input):** Rp [Angka pemisah ribuan]
- **Total Dampak Kemanfaatan (Output/Outcome):** Rp [Angka pemisah ribuan]
- **Rasio SROI:** 1 : [Hasil Rasio]
- **Makna Angka:** [Kalimat interpretasi Rp 1.000]

### 2. ANALISIS IKM (Indeks Kepuasan Masyarakat)
- **Nilai IKM Konversi:** [Angka Skala 100 dengan 2 desimal]
- **Mutu Pelayanan:** Mutu [A/B/C/D]
- **Kinerja Unit:** [Sangat Baik / Baik / Kurang Baik / Tidak Baik]

### 3. KESIMPULAN INTEGRATIF & REKOMENDASI STRATEGIS
- [Tulis analisis mendalam dan ringkas korelasi antara dampak finansial SROI dengan persepsi kepuasan IKM khusus konteks kearifan lokal & ekonomi wilayah ${region}]
- [Berikan 2 rekomendasi taktis bernomor untuk keberlanjutan program]
---

Tulis laporan resmi dan profesional langsung dalam format yang ditentukan di atas tanpa kata AI, tanpa basa-basi pembuka atau penutup tambahan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Anda adalah Lead Evaluator TJSL dan SROI Konsultan Profesional. Berikan laporan evaluasi yang tajam, akuntabel, matematis presisi, berstandar ISO 26000, BUMN, dan Permenpan-RB. Jangan gunakan kata AI dalam teks laporan.',
      },
    });

    const reportMarkdown = response.text || '';

    return res.json({
      reportMarkdown,
      ratio,
      val1000,
      ikmConverted,
      ikmGrade,
      ikmPerformance,
    });
  } catch (error: any) {
    console.error('Error generating evaluation:', error);
    return res.status(500).json({
      error: error.message || 'Gagal memproses evaluasi',
    });
  }
});

// Endpoint: Konversi Narasi Kualitatif ke Financial Proxy
app.post('/api/convert-proxy', async (req: Request, res: Response) => {
  try {
    const { qualitativeStory, region, programName, companyName } = req.body;
    const company = companyName || 'PT PLN (PERSERO)';

    if (!ai) {
      return res.json({
        suggestedProxies: [
          {
            description: 'Peningkatan pendapatan penerima manfaat per tahun',
            stakeholder: 'Masyarakat / Pelaku Usaha Lokal',
            quantity: 25,
            unitProxy: 12000000,
            subtotal: 300000000,
            methodology: 'Survei baseline vs endline pendapatan kotor',
          },
          {
            description: 'Penghematan biaya operasional energi vs metode konvensional',
            stakeholder: 'Kelompok Binaan / Masyarakat',
            quantity: 50,
            unitProxy: 3600000,
            subtotal: 180000000,
            methodology: 'Konversi selisih konsumsi energi operasional',
          },
        ],
        estimatedInvestment: 250000000,
        suggestedIkm: {
          u1: 3.6,
          u2: 3.5,
          u3: 3.4,
          u4: 3.8,
          u5: 3.7,
          u6: 3.6,
          u7: 3.8,
          u8: 3.4,
          u9: 3.5,
        },
      });
    }

    const prompt = `Pengguna memberikan narasi kualitatif mengenai program TJSL ${company}:
Nama Program: ${programName || 'Program TJSL'}
Wilayah: ${region || 'Sulawesi Selatan'}
Narasi Kualitatif:
"${qualitativeStory}"

Tugas Konsultan Evaluator:
1. Konversi input kualitatif tersebut menjadi daftar indikator Financial Proxy (dampak kemanfaatan sosial/ekonomi yang dimonetisasi).
2. Tentukan estimasi total investasi input (jika disebutkan atau buat estimasi wajar dalam Rupiah).
3. Buat estimasi skor 9 Unsur IKM (skala 1-4) berdasarkan sentimen kepuasan pada narasi (u1 s/d u9).

Kembalikan jawaban HANYA DALAM FORMAT JSON murni sesuai schema berikut:
{
  "estimatedInvestment": number (nominal rupiah),
  "suggestedProxies": [
    {
      "description": string,
      "stakeholder": string,
      "quantity": number,
      "unitProxy": number (nilai nominal rupiah per unit per periode),
      "subtotal": number (quantity * unitProxy),
      "methodology": string (penjelasan singkat bagaimana proxy ini dimonetisasi)
    }
  ],
  "suggestedIkm": {
    "u1": number (1.0 - 4.0),
    "u2": number,
    "u3": number,
    "u4": number,
    "u5": number,
    "u6": number,
    "u7": number,
    "u8": number,
    "u9": number
  },
  "narrativeSummary": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error converting proxy:', error);
    return res.status(500).json({
      error: error.message || 'Gagal mengonversi narasi kualitatif',
    });
  }
});

// Setup Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Evaluator TJSL SROI & IKM server running on port ${port}`);
  });
}

startServer();
