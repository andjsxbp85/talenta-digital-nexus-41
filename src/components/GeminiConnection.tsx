
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle } from 'lucide-react';

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
          title: "Koneksi Berhasil!",
          description: "API Key Gemini telah tersimpan dan terhubung",
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isConnected ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertCircle className="w-5 h-5 text-orange-600" />
          )}
          <span>Gemini AI Connection</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="gemini-key">Gemini API Key</Label>
              <Input
                id="gemini-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Masukkan API Key Gemini"
              />
            </div>
            <Button 
              onClick={handleConnect} 
              className="w-full"
              disabled={isChecking}
            >
              {isChecking ? 'Memeriksa...' : 'Connect'}
            </Button>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Terhubung ke Gemini AI</span>
            </div>
            <Button 
              onClick={handleDisconnect} 
              variant="outline"
              className="w-full"
            >
              Disconnect
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GeminiConnection;
