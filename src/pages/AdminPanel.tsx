
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, UserPlus, Users, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminPanel = () => {
  const { user, registeredUsers, addUser, deleteUser } = useAuth();
  const { toast } = useToast();
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });

  // Redirect jika bukan admin
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUser.email || !newUser.password) {
      toast({
        title: "Error",
        description: "Email dan password harus diisi",
        variant: "destructive"
      });
      return;
    }

    // Check if user already exists
    const userExists = registeredUsers.find(u => u.email === newUser.email);
    if (userExists) {
      toast({
        title: "Error",
        description: "Email sudah terdaftar",
        variant: "destructive"
      });
      return;
    }

    addUser(newUser);
    setNewUser({ email: '', password: '', role: 'user' });
    
    toast({
      title: "Berhasil",
      description: `User ${newUser.email} berhasil ditambahkan`
    });
  };

  const handleDeleteUser = (userId: string, email: string) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus user ${email}?`)) {
      deleteUser(userId);
      toast({
        title: "Berhasil",
        description: `User ${email} berhasil dihapus`
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-8 h-8" />
            Admin Panel
          </h2>
          <p className="text-gray-600">Manajemen pengguna sistem administrasi PPTD</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Tambah User Baru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Password minimal 6 karakter"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                <Button type="submit" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Tambah User
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Statistik User
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span className="font-medium">Total User</span>
                  <span className="text-2xl font-bold text-blue-600">{registeredUsers.length}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                  <span className="font-medium">Admin</span>
                  <span className="text-2xl font-bold text-green-600">
                    {registeredUsers.filter(u => u.role === 'admin').length}
                  </span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                  <span className="font-medium">User Biasa</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {registeredUsers.filter(u => u.role === 'user').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Daftar User
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                    <th className="border border-gray-300 px-4 py-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((userData) => (
                    <tr key={userData.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2">{userData.email}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            userData.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {userData.role}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        {userData.email !== user?.email && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(userData.id, userData.email)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
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

export default AdminPanel;
