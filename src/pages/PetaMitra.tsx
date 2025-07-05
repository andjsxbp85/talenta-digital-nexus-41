import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, MapPin, Users, Building } from 'lucide-react';

const PetaMitra = () => {
  const mitraData = [
    {
      id: 1,
      nama: "Microsoft",
      learningPath: "Software Development",
      daftarUK: ["UK001 - Menganalisis Kebutuhan Sistem", "UK002 - Merancang Arsitektur Aplikasi", "UK003 - Implementasi Database"],
      status: "Tersedia di LMS",
      jumlahPeserta: 150
    },
    {
      id: 2,
      nama: "DQLab",
      learningPath: "Data Analytics",
      daftarUK: ["UK004 - Analisis Data Statistik", "UK005 - Visualisasi Data", "UK006 - Machine Learning Dasar"],
      status: "Sedang Dikembangkan",
      jumlahPeserta: 89
    },
    {
      id: 3,
      nama: "Binar Academy",
      learningPath: "Full Stack Development",
      daftarUK: ["UK007 - Frontend Development", "UK008 - Backend Development", "UK009 - DevOps Implementation"],
      status: "Akan Dikembangkan",
      jumlahPeserta: 67
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Tersedia di LMS':
        return 'bg-green-100 text-green-800';
      case 'Sedang Dikembangkan':
        return 'bg-blue-100 text-blue-800';
      case 'Akan Dikembangkan':
        return 'bg-yellow-100 text-yellow-800';
      case 'Selesai - Ditutup':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Peta Mitra</h2>
          <p className="text-gray-600">Visualisasi dan manajemen mitra pelatihan digital</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Mitra</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mitraData.length}</div>
              <p className="text-xs text-muted-foreground">
                Lembaga pelatihan terdaftar
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mitra Aktif</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mitraData.filter(m => m.status === 'Aktif').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Sedang beroperasi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Peserta</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mitraData.reduce((sum, m) => sum + m.jumlahPeserta, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Peserta pelatihan
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Okupasi</CardTitle>
              <Map className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                Bidang keahlian
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Mitra Pelatihan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Nama Mitra</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Learning Path</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Daftar UK</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Peserta</th>
                  </tr>
                </thead>
                <tbody>
                  {mitraData.map((mitra) => (
                    <tr key={mitra.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 font-medium">
                        {mitra.nama}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          {mitra.learningPath}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="space-y-1">
                          {mitra.daftarUK.map((uk, index) => (
                            <div
                              key={index}
                              className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded border"
                            >
                              {uk}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${getStatusColor(mitra.status)}`}
                        >
                          {mitra.status}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {mitra.jumlahPeserta}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PetaMitra;
