'use client';

import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { UserFormDialog } from '@/components/form/users';
import { Loader2, UserPlus, Phone, Mail, Calendar } from 'lucide-react';
import Image from 'next/image';
import type { UserFormData } from '@/lib/validations/user';

export default function UsersPage() {
  const { users, loading, error, refetch, createUserFromForm } = useUsers();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSaveUser = async (userData: UserFormData) => {
    try {
      console.log('Guardando usuario:', userData);
      const result = await createUserFromForm(userData);
      if (result.success) {
        setIsDialogOpen(false);
        // Mostrar mensaje de éxito (puedes implementar un toast aquí)
        console.log('Usuario creado exitosamente:', result.data);
      } else {
        // Mostrar mensaje de error
        console.error('Error al crear usuario:', result.error);
        alert('Error al crear usuario: ' + result.error);
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado al crear usuario');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Cargando usuarios...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={refetch}>Reintentar</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Usuarios</h1>
          <p className="text-gray-600">Total: {users.length} usuarios</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Nuevo Usuario
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  {user.photo ? (
                    <Image src={user.photo} alt={user.name} width={48} height={48} className="rounded-full" />
                  ) : (
                    <div className="bg-blue-500 text-white flex items-center justify-center h-full text-lg font-semibold">
                      {user.name.charAt(0)}{user.last_name.charAt(0)}
                    </div>
                  )}
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">
                    {user.name} {user.last_name}
                  </CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      {user.role.name}
                    </Badge>
                    <Badge variant="outline">
                      {user.category.name}
                    </Badge>
                    {user.active && (
                      <Badge className="bg-green-500">
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-2">
                {user.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {user.email}
                  </div>
                )}

                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {user.cellphone}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(user.birth_date).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Ver Perfil
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <UserPlus className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay usuarios</h3>
          <p className="text-gray-500">Comienza agregando tu primer usuario</p>
          <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Usuario
          </Button>
        </div>
      )}

      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveUser}
      />
    </div>
  );
}