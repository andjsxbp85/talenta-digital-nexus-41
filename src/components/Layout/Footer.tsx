
import React from 'react';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const socialMedia = [
    { name: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
    { name: 'Twitter', url: 'https://twitter.com', icon: '🐦' },
    { name: 'Instagram', url: 'https://instagram.com', icon: '📷' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
    { name: 'TikTok', url: 'https://tiktok.com', icon: '🎵' },
    { name: 'Website', url: 'https://komdigi.go.id', icon: '🌐' },
  ];

  const staffMembers = {
    leadership: [
      { name: 'Dr. Said Mirza Pahlevi', role: 'Kepala Pusat Pengembangan Talenta Digital' },
      { name: 'Anny Triana', role: 'Ketua Tim Pengembangan Materi Standar Pelatihan dan Pembelajaran' },
    ],
    members: [
      'Anjas Muhammad Bangun',
      'Gustriani Utami',
      'Hendrika Astrid Dwiastuti',
      'Iwan Setyawan',
      'M. Nanda Fachrisal',
      'Deki Firmansyah',
      'Riski Fahreza',
      'Agung Rachmat',
      'Ryan Ramel',
      'Multyvano Rizal',
    ],
  };

  return (
    <footer className="bg-gray-900 text-white static">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Column 1: Logo and Contact */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="w-32 h-16 bg-white rounded-lg flex items-center justify-center">
                <img 
                  src="./assets/pusbangtaldig.png" 
                  alt="Logo Komdigi" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-blue-300">
                  Pusat Pengembangan Talenta Digital
                </h3>
                <p className="text-gray-300">BPSDM Komdigi</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-blue-300 mb-3">Kontak Kami</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-blue-400" />
                  <span className="text-sm">0213810678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <span className="text-sm">081901777719</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-red-400" />
                  <span className="text-sm">fga.dtskominfo@gmail.com</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-blue-300">Follow Us</h4>
              <div className="flex space-x-3">
                {socialMedia.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 hover:bg-blue-500 rounded-full flex items-center justify-center transition-colors duration-200"
                    title={social.name}
                  >
                    <span className="text-lg">{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Location and Maps */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-300 mb-2">Lokasi Kami</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    Jl. Medan Merdeka Barat No.9 2, RT.2/RW.3, Gambir, 
                    Kecamatan Gambir, Kota Jakarta Pusat, 
                    Daerah Khusus Ibukota Jakarta 10110
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d276.9942561810362!2d106.82133181971314!3d-6.175044325712825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f53c4609fd3f%3A0x1f3f7d19294ba74f!2sJl.%20Medan%20Merdeka%20Barat%20No.9%202%2C%20RT.2%2FRW.3%2C%20Gambir%2C%20Kecamatan%20Gambir%2C%20Kota%20Jakarta%20Pusat%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2010110!5e0!3m2!1sen!2sid!4v1750834212153!5m2!1sen!2sid" 
                width="100%" 
                height="250" 
                className="border-0 rounded-lg" 
                allowFullScreen={true}
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Lokasi BPSDM Komdigi"
              />
            </div>
          </div>

          {/* Column 3: Staff Information */}
          <div className="space-y-6">
            <h4 className="font-medium text-blue-300">Our Beloved Staff</h4>
            
            {/* Leadership */}
            <div className="space-y-3">
              {staffMembers.leadership.map((staff, index) => (
                <div key={index} className="space-y-1">
                  <Badge 
                    variant="secondary" 
                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-3 py-1"
                  >
                    {staff.name}
                  </Badge>
                  <p className="text-xs text-gray-400 ml-1">{staff.role}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-gray-700" />

            {/* Team Members */}
            <div className="space-y-3">
              <h5 className="text-sm font-medium text-gray-300">Tim Anggota</h5>
              <div className="flex flex-wrap gap-2">
                {staffMembers.members.map((member, index) => (
                  <Badge 
                    key={index}
                    variant="outline" 
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs px-2 py-1"
                  >
                    {member}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="border-t border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              © 2025 Tim Pengembangan Materi Standar Pelatihan dan Pembelajaran - BPSDM Komdigi. All Rights Reserved
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
