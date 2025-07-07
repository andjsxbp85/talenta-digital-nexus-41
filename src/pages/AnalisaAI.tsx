import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, MessageSquare, Plus, Send, Loader2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import * as mammoth from 'mammoth';
import { readPdfContent } from '@/components/PdfReader';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

interface CSVRow {
  'AREA FUNGSI KUNCI': string;
  'KODE OKUPASI': string;
  'OKUPASI': string;
  'LEVEL': string;
  'KLASIFIKASI UK': string;
  'KODE UK': string;
  'JUDUL UK': string;
  'JUDUL EK': string;
  'JUDUL KUK': string;
  'Aspek Kritis': string;
  fileId?: string;
}

interface UploadedFileInfo {
  name: string;
  id: string;
  dataCount: number;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  isRendering?: boolean;
}

const AnalisaAI = () => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileInfo[]>([]);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [syllabusFiles, setSyllabusFiles] = useState<File[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const { toast } = useToast();

  // Configure marked for better rendering
  marked.setOptions({
    breaks: true,
    gfm: true
  });

  // Chat suggestions
  const chatSuggestions = [
    "Buatkan saran perbaikan materi untuk okupasi SQA Engineer dengan PDF Silabus dan CSV peta materi SKKNI ini",
    "Buatkan silabus materi baru untuk SQA Engineer dengan referensi PDF Silabus berikut",
    "Buatkan silabus materi baru untuk SQA Engineer dengan referensi peta materi CSV SKKNI ini"
  ];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('csvData');
    const savedFiles = localStorage.getItem('uploadedFiles');
    
    if (savedData) {
      setCsvData(JSON.parse(savedData));
    }
    
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
  }, []);

  // Save data to localStorage whenever csvData or uploadedFiles changes
  useEffect(() => {
    localStorage.setItem('csvData', JSON.stringify(csvData));
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [csvData, uploadedFiles]);

  // Hide suggestions when chat history exists
  useEffect(() => {
    if (chatHistory.length > 0) {
      setShowSuggestions(false);
    }
  }, [chatHistory]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const csvFiles = Array.from(files).filter(file => 
      file.name.toLowerCase().endsWith('.csv')
    );
    
    if (csvFiles.length === 0) {
      toast({
        title: "Error",
        description: "Harap upload file CSV saja",
        variant: "destructive"
      });
      return;
    }
    
    // Parse all CSV files
    let newUploadedFiles: UploadedFileInfo[] = [];
    let allNewData: CSVRow[] = [];
    let filesProcessed = 0;
    
    csvFiles.forEach(file => {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
          
          const validData = results.data.filter((row: any) => 
            row['OKUPASI'] && row['KODE UK'] && row['JUDUL UK']
          ).map((row: any) => ({
            ...row,
            fileId: fileId
          })) as CSVRow[];
          
          const fileInfo: UploadedFileInfo = {
            name: file.name,
            id: fileId,
            dataCount: validData.length
          };
          
          newUploadedFiles.push(fileInfo);
          allNewData = [...allNewData, ...validData];
          filesProcessed++;
          
          if (filesProcessed === csvFiles.length) {
            setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
            setCsvData(prev => [...prev, ...allNewData]);
            toast({
              title: "Berhasil",
              description: `${csvFiles.length} file CSV berhasil diupload dan digabungkan. Total ${allNewData.length} baris data baru.`
            });
          }
        },
        error: (error) => {
          toast({
            title: "Error",
            description: `Error parsing file ${file.name}: ${error.message}`,
            variant: "destructive"
          });
        }
      });
    });
  };

  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (!fileToRemove) return;

    // Remove file from uploadedFiles
    const updatedFiles = uploadedFiles.filter(f => f.id !== fileId);
    setUploadedFiles(updatedFiles);

    // Remove corresponding data from csvData based on fileId
    const updatedCsvData = csvData.filter(row => row.fileId !== fileId);
    setCsvData(updatedCsvData);

    // Reset pagination if needed
    const totalPages = Math.ceil(updatedCsvData.length / rowsPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    toast({
      title: "File Dihapus",
      description: `File ${fileToRemove.name} dan semua datanya telah dihapus.`,
    });
  };

  const handleSyllabusUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setSyllabusFiles(prev => [...prev, ...newFiles]);
    
    toast({
      title: "Berhasil",
      description: `${newFiles.length} file silabus berhasil diupload`
    });
  };

  const readFileContent = async (file: File): Promise<string> => {
    if (file.name.toLowerCase().endsWith('.pdf')) {
      // Use the new Gemini-based PDF reader
      try {
        const content = await readPdfContent(file);
        return content;
      } catch (error) {
        console.error('PDF reading error:', error);
        return `Error membaca PDF ${file.name}: ${error}`;
      }
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            resolve(result.value || `No text content found in ${file.name}`);
          } catch (error) {
            resolve(`Error extracting DOCX content from ${file.name}: ${error}`);
          }
        };
        reader.readAsArrayBuffer(file);
        reader.onerror = () => {
          resolve(`Error reading file ${file.name}`);
        };
      });
    } else {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          resolve(content);
        };
        reader.readAsText(file);
        reader.onerror = () => {
          resolve(`Error reading file ${file.name}`);
        };
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setChatMessage(suggestion);
    setShowSuggestions(false);
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) {
      toast({
        title: "Error",
        description: "Harap hubungkan ke Gemini AI terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Prepare context from CSV data
      const csvContext = csvData.length > 0 
        ? `Data SKKNI yang tersedia (${csvData.length} baris):\n${JSON.stringify(csvData, null, 2)}` 
        : '';
      
      // Prepare context from syllabus files
      let syllabusContext = '';
      if (syllabusFiles.length > 0) {
        syllabusContext = 'Silabus mitra yang tersedia:\n';
        
        // Process all files sequentially to avoid Promise issues
        for (const file of syllabusFiles) {
          const content = await readFileContent(file);
          syllabusContext += `\n--- ${file.name} ---\n${content}\n`;
        }
      }
      
      const fullContext = `${csvContext}\n\n${syllabusContext}`;
      const fullPrompt = `${fullContext}\n\nPertanyaan: ${chatMessage}`;
      
      // Add user message to chat
      const newChatHistory = [...chatHistory, { role: 'user' as const, content: chatMessage }];
      setChatHistory(newChatHistory);
      setChatMessage('');
      
      // Call Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghubungi Gemini API');
      }
      
      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      // Add AI response with rendering flag
      const aiMessage: ChatMessage = { role: 'assistant', content: aiResponse, isRendering: true };
      setChatHistory([...newChatHistory, aiMessage]);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal mengirim pesan ke Gemini AI",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
  };

  const totalPages = Math.ceil(csvData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = csvData.slice(startIndex, endIndex);

  // Function to render markdown content safely
  const renderMarkdown = (content: string) => {
    const htmlContent = marked(content);
    const sanitizedContent = DOMPurify.sanitize(htmlContent);
    return { __html: sanitizedContent };
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Analisa AI</h2>
          <p className="text-purple-100 text-lg">Upload dan analisis file SKKNI dengan AI</p>
        </div>

        {/* File Upload Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <Upload className="w-6 h-6 text-blue-600" />
              Upload File CSV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer bg-blue-50 hover:bg-blue-100"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              <FileText className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <p className="text-xl font-semibold text-gray-900 mb-3">
                Drag & drop file CSV atau klik untuk browse
              </p>
              <p className="text-gray-600 mb-4">
                Mendukung multiple file CSV dengan header standar SKKNI
              </p>
              <p className="text-sm text-gray-500">
                Header: AREA FUNGSI KUNCI, KODE OKUPASI, OKUPASI, LEVEL, KLASIFIKASI UK, KODE UK, JUDUL UK, JUDUL EK, JUDUL KUK, Aspek Kritis
              </p>
              <input
                id="file-input"
                type="file"
                multiple
                accept=".csv"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-800 mb-3">File yang diupload:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center gap-2 text-green-700 bg-white p-2 rounded border">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm flex-1">{file.name}</span>
                      <span className="text-xs text-gray-500">({file.dataCount} rows)</span>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Hapus file"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl text-gray-800">
              <MessageSquare className="w-6 h-6 text-green-600" />
              Chat dengan Gemini AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chat History */}
            {chatHistory.length > 0 && (
              <div 
                className="min-h-96 max-h-[600px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg border resize-y"
                style={{ resize: 'vertical' }}
              >
                {chatHistory.map((message, index) => (
                  <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl p-4 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-gray-800 border shadow-sm'
                    }`}>
                      {message.role === 'user' ? (
                        <pre className="whitespace-pre-wrap font-sans">{message.content}</pre>
                      ) : (
                        <div 
                          className="prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-strong:text-gray-900 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-100 prose-pre:border prose-ul:text-gray-700 prose-ol:text-gray-700"
                          dangerouslySetInnerHTML={renderMarkdown(message.content)}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Silabus Button */}
            <div className="flex gap-2">
              <Button
                onClick={() => document.getElementById('syllabus-input')?.click()}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Upload Silabus
              </Button>
              <input
                id="syllabus-input"
                type="file"
                multiple
                accept=".pdf,.docx,.txt,.doc"
                className="hidden"
                onChange={(e) => handleSyllabusUpload(e.target.files)}
              />
            </div>

            {/* Syllabus Files Display */}
            {syllabusFiles.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">File Silabus Terlampir:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {syllabusFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-yellow-700 bg-white p-2 rounded border">
                      <FileText className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Suggestions */}
            {showSuggestions && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-3">Saran Pertanyaan:</h4>
                <div className="space-y-2">
                  {chatSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full text-left p-3 bg-white rounded-lg border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
              
            {/* Chat Input */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Textarea
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder={showSuggestions ? "Tanyakan sesuatu tentang data SKKNI atau analisis silabus..." : ""}
                  className="min-h-[100px] resize-y"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !chatMessage.trim()}
                className="self-end bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Preview */}
        {csvData.length > 0 && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-gray-800">Preview Data SKKNI</CardTitle>
                <div className="flex items-center gap-4">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => {
                      setRowsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border rounded-lg px-3 py-2 bg-white"
                  >
                    <option value={10}>10 per halaman</option>
                    <option value={25}>25 per halaman</option>
                    <option value={50}>50 per halaman</option>
                    <option value={100}>100 per halaman</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    Total: {csvData.length} baris
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-lg border">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">OKUPASI</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">LEVEL</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">KODE UK</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">JUDUL UK</th>
                      <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">JUDUL EK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, index) => (
                      <tr key={index} className="hover:bg-blue-50 transition-colors">
                        <td className="border border-gray-200 px-4 py-3 text-sm">{row.OKUPASI}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">{row.LEVEL}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm font-mono text-blue-600">{row['KODE UK']}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">{row['JUDUL UK']}</td>
                        <td className="border border-gray-200 px-4 py-3 text-sm">{row['JUDUL EK']}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-600">
                  Menampilkan {startIndex + 1}-{Math.min(endIndex, csvData.length)} dari {csvData.length} data
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Sebelumnya
                  </Button>
                  <span className="flex items-center px-3 py-1 text-sm">
                    Halaman {currentPage} dari {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Selanjutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AnalisaAI;
