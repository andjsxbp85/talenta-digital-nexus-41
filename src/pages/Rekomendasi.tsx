import React, { useState } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lightbulb, Download, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Rekomendasi = () => {
  const [selectedOkupasi, setSelectedOkupasi] = useState('');
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const okupasiOptions = [
    'Software QA Engineer',
    'Web Developer',
    'Data Analyst',
    'UI/UX Designer',
    'Full Stack Developer',
    'DevOps Engineer',
    'Mobile Developer',
    'Data Scientist'
  ];

  const handleGenerateRecommendations = async () => {
    if (!selectedOkupasi) {
      toast({
        title: "Pilih Okupasi",
        description: "Harap pilih okupasi terlebih dahulu",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulasi proses generate rekomendasi
    setTimeout(() => {
      const mockRecommendations = [
        {
          kodeUK: 'J.62SQA00.009.1',
          judulUK: 'Melakukan Pengujian Automated Testing',
          status: 'Belum Dikembangkan',
          prioritas: 'Tinggi',
          mitraExisting: '-',
          rekomendasi: 'Disarankan menggunakan tools Selenium dan Cypress untuk automated testing'
        },
        {
          kodeUK: 'J.62SQA00.010.1',
          judulUK: 'Menerapkan API Testing',
          status: 'Sudah Dikembangkan',
          prioritas: 'Sedang',
          mitraExisting: 'PT Digital Training Center',
          rekomendasi: 'Mitra baru bisa fokus pada tools K6 atau REST Assured'
        },
        {
          kodeUK: 'J.62SQA00.011.1',
          judulUK: 'Performance Testing',
          status: 'Belum Dikembangkan',
          prioritas: 'Tinggi',
          mitraExisting: '-',
          rekomendasi: 'Opportunity untuk mengembangkan materi JMeter dan LoadRunner'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsGenerating(false);
      
      toast({
        title: "Rekomendasi Generated",
        description: `Berhasil generate ${mockRecommendations.length} rekomendasi untuk ${selectedOkupasi}`
      });
    }, 2000);
  };

  const exportToExcel = () => {
    toast({
      title: "Export Excel",
      description: "Fitur export Excel akan segera tersedia"
    });
  };

  const exportToPDF = () => {
    toast({
      title: "Export PDF",
      description: "Fitur export PDF akan segera tersedia"
    });
  };

  const belumDikembangkan = recommendations.filter(r => r.status === 'Belum Dikembangkan').length;
  const sudahDikembangkan = recommendations.filter(r => r.status === 'Sudah Dikembangkan').length;
  const prioritasTinggi = recommendations.filter(r => r.prioritas === 'Tinggi').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Daftar Okupasi</h2>
          <p className="text-gray-600">Generate rekomendasi pengembangan materi pelatihan untuk mitra baru</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5" />
              Generate Rekomendasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Select value={selectedOkupasi} onValueChange={setSelectedOkupasi}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Okupasi" />
                  </SelectTrigger>
                  <SelectContent>
                    {okupasiOptions.map((okupasi) => (
                      <SelectItem key={okupasi} value={okupasi}>
                        {okupasi}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerateRecommendations}
                disabled={isGenerating}
                className="min-w-[150px]"
              >
                {isGenerating ? 'Generating...' : 'Generate Rekomendasi'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {recommendations.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total UK</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{recommendations.length}</div>
                  <p className="text-xs text-muted-foreground">Unit Kompetensi</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sudah Dikembangkan</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{sudahDikembangkan}</div>
                  <p className="text-xs text-muted-foreground">Oleh mitra existing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Belum Dikembangkan</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">{belumDikembangkan}</div>
                  <p className="text-xs text-muted-foreground">Opportunity area</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Prioritas Tinggi</CardTitle>
                  <Lightbulb className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{prioritasTinggi}</div>
                  <p className="text-xs text-muted-foreground">Urgent development</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detail Rekomendasi - {selectedOkupasi}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportToExcel}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={exportToPDF}>
                      <Download className="w-4 h-4 mr-2" />
                      Export PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 px-4 py-2 text-left">Kode UK</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Judul UK</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Prioritas</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Mitra Existing</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.map((rec, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 font-mono text-sm">
                            {rec.kodeUK}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{rec.judulUK}</td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                rec.status === 'Sudah Dikembangkan'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-orange-100 text-orange-800'
                              }`}
                            >
                              {rec.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                rec.prioritas === 'Tinggi'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {rec.prioritas}
                            </span>
                          </td>
                          <td className="border border-gray-300 px-4 py-2">{rec.mitraExisting}</td>
                          <td className="border border-gray-300 px-4 py-2 text-sm">
                            {rec.rekomendasi}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Rekomendasi;
