
import { GoogleGenerativeAI } from '@google/generative-ai';

export const readPdfContent = async (file) => {
  try {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      throw new Error('API Key Gemini tidak ditemukan. Silakan hubungkan ke Gemini AI terlebih dahulu.');
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Upload file to Gemini
    console.log('Uploading file to Gemini...');
    const uploadResponse = await genAI.files.upload({
      file: file,
      config: { 
        mimeType: file.type || 'application/pdf',
        displayName: file.name 
      },
    });

    console.log('File uploaded successfully:', uploadResponse.file.uri);

    // Generate content using the uploaded file
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent([
      {
        fileData: {
          mimeType: uploadResponse.file.mimeType,
          fileUri: uploadResponse.file.uri
        }
      },
      "Ekstrak semua teks dari dokumen PDF ini. Berikan dalam format yang mudah dibaca dan terstruktur."
    ]);

    const response = await result.response;
    const text = response.text();

    // Delete the uploaded file after processing
    try {
      await genAI.files.delete(uploadResponse.file.name);
      console.log('Temporary file deleted from Gemini');
    } catch (deleteError) {
      console.warn('Failed to delete temporary file:', deleteError);
    }

    return text || `Tidak dapat membaca teks dari file PDF ${file.name}`;

  } catch (error) {
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
