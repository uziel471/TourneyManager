"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import Loader from "@/components/ui/Loader"
import { UserFormDialog } from "@/components/form/users"

import { useUsers, useCreateUser, useUpdateUser, useDeleteUser } from "./services/useUsers"
import { User } from './entities/user';
import Header from "./components/Header"
import StatsCards from "./components/StatsCards"
import UsersFilters from "./components/UsersFilters"
import UsersTable from "./components/UsersTable"

export default function UsersPage() {
  const { data, isLoading, error } = useUsers()
  const createUserMutation = useCreateUser()
  const updateUserMutation = useUpdateUser()
  const deleteUserMutation = useDeleteUser()

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User>()
  const users = data?.data || []
  const filteredUsers = useMemo(() => {
    return users?.filter((user) => {
      const fullName = `${user.name} ${user.last_name}`.toLowerCase()
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || user.role.name === roleFilter
      const matchesStatus = statusFilter === "all" || (user.active ? "active" : "inactive") === statusFilter

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchTerm, roleFilter, statusFilter])

  const handleCreateUser = () => {
    setEditingUser(undefined)
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user)
    setIsDialogOpen(true)
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserMutation.mutateAsync(userId)
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  const handleToggleStatus = async (user: User) => {
    try {
      await updateUserMutation.mutateAsync({
        id: user.id,
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        cellphone: user.cellphone,
        role_id: user.role.id,
        birth_date: user.birth_date,
        category_id: user.category.id,
        active: !user.active,
      })
    } catch (error) {
      console.error('Error updating user status:', error)
    }
  }

  const handleSaveUser = async (userData: {
    name: string;
    last_name: string;
    email?: string;
    cellphone: string;
    role_id: string;
    birth_date: string;
    category_id: string;
    active?: boolean;
  }) => {
    try {
      if (editingUser) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id,
          ...userData,
        })
      } else {
        await createUserMutation.mutateAsync(userData)
      }
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error saving user:', error)
    }
  }

  const stats = useMemo(() => ({
    total: users.length,
    active: users.filter((u) => u.active).length,
    admins: users.filter((u) => u.role.name === "Admin").length,
    players: users.filter((u) => u.role.name === "Player").length,
  }), [users])

  if (isLoading) {
    return (
      <Loader message="Cargando usuarios..." />
    )
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-2">Error al cargar usuarios</p>
            <Button onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Header handleCreateUser={handleCreateUser} />

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Filters */}
      <UsersFilters
        searchTerm={searchTerm}
        roleFilter={roleFilter}
        statusFilter={statusFilter}
        onSearchChange={setSearchTerm}
        onRoleFilterChange={setRoleFilter}
        onStatusFilterChange={setStatusFilter}
        filteredCount={filteredUsers.length}
      />

      {/* Users Table */}
      <UsersTable
        users={filteredUsers}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        onToggleStatus={handleToggleStatus}
      />
      <UserFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={editingUser ? {
          id: editingUser.id,
          name: editingUser.name,
          last_name: editingUser.last_name,
          email: editingUser.email || '',
          cellphone: editingUser.cellphone,
          role_id: editingUser.role_id,
          category_id: editingUser.category_id,
          birth_date: editingUser.birth_date
        } : undefined}
        onSave={handleSaveUser}
      />
    </div>
  )
}
