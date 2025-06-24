
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Configure PDF.js worker with CDN fallback
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${getDocument.version}/build/pdf.worker.min.js`;

export const readPdfContent = async (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    
    fileReader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const pdf = await getDocument({ data: typedArray }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const strings = content.items.map(item => item.str);
          fullText += strings.join(' ') + '\n\n';
        }

        resolve(fullText.trim() || `Tidak dapat membaca teks dari file PDF ${file.name}`);
      } catch (error) {
        console.error('PDF reading error:', error);
        reject(`Error membaca PDF ${file.name}: ${error}`);
      }
    };
    
    fileReader.onerror = () => {
      reject(`Error reading file ${file.name}`);
    };
    
    fileReader.readAsArrayBuffer(file);
  });
};
