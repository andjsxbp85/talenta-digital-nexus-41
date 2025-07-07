
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, FileText, Settings } from 'lucide-react';
import GeminiConnection from '@/components/GeminiConnection';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total SKKNI',
      value: '1,234',
      icon: FileText,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Mitra Aktif',
      value: '89',
      icon: Users,
      change: '+8%',
      color: 'text-green-600'
    },
    {
      title: 'Okupasi',
      value: '45',
      icon: TrendingUp,
      change: '+15%',
      color: 'text-purple-600'
    },
    {
      title: 'Rekomendasi',
      value: '156',
      icon: Settings,
      change: '+23%',
      color: 'text-orange-600'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Selamat Datang di Dashboard Pusbang Talenta Digital!</h2>
          <p className="text-blue-100 text-xl">Kelola Data Pelatihan dengan mudah menggunakan AI</p>
        </div>

        {/* Gemini Connection Section - Full Width */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Koneksi Gemini AI</CardTitle>
          </CardHeader>
          <CardContent>
            <GeminiConnection />
          </CardContent>
        </Card>

        {/* Stats Overview - Full Width Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className={`text-sm font-medium ${stat.color}`}>{stat.change} dari bulan lalu</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gray-50`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Looker Studio Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div style={{ position: 'relative', paddingBottom: '168.75%', height: 0, overflow: 'hidden' }}>
              <iframe 
                src="https://lookerstudio.google.com/embed/reporting/78d58971-02ce-445c-83b8-cde8d84c714c/page/KPcNF"
                frameBorder="0"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allowFullScreen
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                className="rounded-b-lg"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
