
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Map, MapPin, Users, Building } from 'lucide-react';

const PetaMitra = () => {
  const mitraData = [
    {
      id: 1,
      nama: "PT Digital Training Center",
      lokasi: "Jakarta Selatan",
      okupasi: ["Software QA Engineer", "Web Developer"],
      status: "Aktif",
      jumlahPeserta: 150
    },
    {
      id: 2,
      nama: "CV Tech Academy",
      lokasi: "Bandung",
      okupasi: ["Data Analyst", "UI/UX Designer"],
      status: "Aktif",
      jumlahPeserta: 89
    },
    {
      id: 3,
      nama: "Bootcamp Indonesia",
      lokasi: "Surabaya",
      okupasi: ["Full Stack Developer", "DevOps Engineer"],
      status: "Pending",
      jumlahPeserta: 67
    }
  ];

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
                    <th className="border border-gray-300 px-4 py-2 text-left">Lokasi</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Okupasi</th>
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
                          {mitra.lokasi}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          {mitra.okupasi.map((occ, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                            >
                              {occ}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            mitra.status === 'Aktif'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
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
