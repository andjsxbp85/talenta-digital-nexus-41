
import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import GeminiConnection from '@/components/GeminiConnection';

const UploadSKKNI = () => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const { toast } = useToast();

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
    
    setUploadedFiles(prev => [...prev, ...csvFiles]);
    toast({
      title: "Berhasil",
      description: `${csvFiles.length} file CSV berhasil diupload`
    });
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Unggah SKKNI</h2>
          <p className="text-gray-600">Upload dan analisis file SKKNI dengan AI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload File CSV
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Drag & drop file CSV atau klik untuk browse
                </p>
                <p className="text-sm text-gray-500">
                  Mendukung multiple file CSV dengan kolom: OKUPASI, LEVEL, KODE UK, JUDUL UK, JUDUL EK
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
                <div className="mt-4">
                  <h4 className="font-medium mb-2">File yang diupload:</h4>
                  <ul className="space-y-1">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Koneksi Gemini AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GeminiConnection />
            </CardContent>
          </Card>
        </div>

        {csvData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview Data SKKNI</CardTitle>
              <div className="flex items-center gap-4">
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="border rounded px-3 py-1"
                >
                  <option value={10}>10 per halaman</option>
                  <option value={25}>25 per halaman</option>
                  <option value={50}>50 per halaman</option>
                  <option value={100}>100 per halaman</option>
                </select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 px-4 py-2 text-left">OKUPASI</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">LEVEL</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">KODE UK</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">JUDUL UK</th>
                      <th className="border border-gray-300 px-4 py-2 text-left">JUDUL EK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{row.OKUPASI}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.LEVEL}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.KODE_UK}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.JUDUL_UK}</td>
                        <td className="border border-gray-300 px-4 py-2">{row.JUDUL_EK}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex items-center justify-between mt-4">
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

export default UploadSKKNI;
