import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

function Header({
  handleCreateUser,
}: {
  handleCreateUser: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
        <p className="text-muted-foreground">Administra usuarios, roles y permisos del sistema</p>
      </div>
      <Button onClick={handleCreateUser}>
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Usuario
      </Button>
    </div>
  )
}

export default Header