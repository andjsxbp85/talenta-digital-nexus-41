import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center overflow-hidden">
      <div className="relative text-center px-6 max-w-4xl mx-auto">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-accent/10 rounded-full animate-pulse delay-1000"></div>
        </div>

        {/* Main Content */}
        <div className="animate-fade-in">
          {/* Logo/Title */}
          <div className="mb-8 animate-scale-in">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Pusbang
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Talenta Digital
            </h2>
          </div>

          {/* Coming Soon Text */}
          <div className="mb-12 animate-fade-in delay-300">
            <h3 className="text-2xl md:text-4xl font-semibold text-foreground/80 mb-4">
              Coming Soon
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Kami sedang mempersiapkan platform revolusioner untuk pengembangan talenta digital Indonesia. 
              Bersiaplah untuk masa depan yang lebih cerah!
            </p>
          </div>

          {/* Animated Progress Bar */}
          <div className="mb-12 animate-fade-in delay-500">
            <div className="w-full max-w-md mx-auto bg-muted rounded-full h-2">
              <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full animate-pulse"></div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">Platform sedang dalam pengembangan...</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in delay-700">
            <Button 
              onClick={() => navigate('/login')}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-foreground px-8 py-3 text-lg font-semibold hover-scale"
            >
              Login Portal
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-2 border-primary/30 hover:border-primary/50 px-8 py-3 text-lg font-semibold hover-scale"
            >
              Daftar Update
            </Button>
          </div>

          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-4 h-4 bg-primary/30 rounded-full animate-bounce delay-200"></div>
            <div className="absolute bottom-32 left-20 w-3 h-3 bg-secondary/40 rounded-full animate-bounce delay-500"></div>
            <div className="absolute top-40 right-16 w-5 h-5 bg-accent/30 rounded-full animate-bounce delay-700"></div>
            <div className="absolute bottom-20 right-32 w-2 h-2 bg-primary/50 rounded-full animate-bounce delay-1000"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ComingSoon;