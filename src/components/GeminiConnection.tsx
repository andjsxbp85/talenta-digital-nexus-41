
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react';

const GeminiConnection = () => {
  const [apiKey, setApiKey] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if API key exists in localStorage
    const storedKey = localStorage.getItem('geminiApiKey');
    if (storedKey) {
      setApiKey(storedKey);
      setIsConnected(true);
    }
  }, []);

  const handleConnect = async () => {
    if (!apiKey.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan masukkan API Key Gemini",
      });
      return;
    }

    setIsChecking(true);

    try {
      // Test connection to Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      
      if (response.ok) {
        localStorage.setItem('geminiApiKey', apiKey);
        setIsConnected(true);
        toast({
          title: "Koneksi Berhasil! 🎉",
          description: "API Key Gemini telah tersimpan dan siap digunakan",
        });
      } else {
        throw new Error('Invalid API Key');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Koneksi Gagal",
        description: "API Key tidak valid atau terjadi kesalahan koneksi",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('geminiApiKey');
    setApiKey('');
    setIsConnected(false);
    toast({
      title: "Terputus",
      description: "Koneksi Gemini telah diputus",
    });
  };

  return (
    <div className="space-y-6">
      {!isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span className="font-semibold text-gray-800">Setup Gemini AI</span>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="gemini-key" className="text-sm font-medium text-gray-700">
              Gemini API Key
            </Label>
            <Input
              id="gemini-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Masukkan API Key Gemini"
              className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-500">
              Dapatkan API Key dari Google AI Studio
            </p>
          </div>
          
          <Button 
            onClick={handleConnect} 
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
            disabled={isChecking}
          >
            {isChecking ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Memeriksa koneksi...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Hubungkan ke Gemini</span>
              </div>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Terhubung ke Gemini AI</p>
              <p className="text-sm text-green-600">Siap untuk analisis dan rekomendasi</p>
            </div>
          </div>
          
          <Button 
            onClick={handleDisconnect} 
            variant="outline"
            className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            Putuskan Koneksi
          </Button>
        </div>
      )}
    </div>
  );
};

export default GeminiConnection;
