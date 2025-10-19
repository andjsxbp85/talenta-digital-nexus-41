
import { GoogleGenerativeAI } from '@google/generative-ai';

export const readPdfContent = async (file: File): Promise<string> => {
  try {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      throw new Error('API Key Gemini tidak ditemukan. Silakan hubungkan ke Gemini AI terlebih dahulu.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Convert file to base64 for Gemini API
    const fileData = await fileToGenerativePart(file);
    
    const result = await model.generateContent([
      fileData,
      "Ekstrak semua teks dari dokumen PDF ini. Berikan dalam format yang mudah dibaca dan terstruktur."
    ]);

    const response = await result.response;
    const text = response.text();

    return text || `Tidak dapat membaca teks dari file PDF ${file.name}`;

  } catch (error: any) {
    console.error('PDF reading error with Gemini:', error);
    
    if (error.message.includes('API Key')) {
      throw new Error(error.message);
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      throw new Error(`Kuota API Gemini habis atau terbatas: ${error.message}`);
    } else if (error.message.includes('permission') || error.message.includes('403')) {
      throw new Error(`Tidak memiliki izin untuk menggunakan Gemini File API: ${error.message}`);
    } else {
      throw new Error(`Error membaca PDF ${file.name} dengan Gemini: ${error.message}`);
    }
  }
};

// Helper function to convert file to GenerativePart
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
}
