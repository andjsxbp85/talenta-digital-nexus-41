
import React from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Users, FileText, Settings } from 'lucide-react';
import GeminiConnection from '@/components/GeminiConnection';

const Dashboard = () => {
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
