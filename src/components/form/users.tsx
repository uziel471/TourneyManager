"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { userSchema, type UserFormData } from "@/lib/validations/user"

interface Role {
  id: string
  name: string
}

interface Category {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  last_name: string
  email: string
  cellphone: string
  role_id: string
  category_id: string
  birth_date: string
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onSave: (userData: UserFormData) => void
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
  const [roles, setRoles] = useState<Role[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<UserFormData>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      cellphone: "",
      role_id: "",
      category_id: "",
      birth_date: "",
      active: true,
    },
  })

  const role_id = watch("role_id")
  const category_id = watch("category_id")

  // Cargar roles y categorías
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [rolesResponse, categoriesResponse] = await Promise.all([
          fetch("/api/roles"),
          fetch("/api/categories")
        ])

        const rolesData = await rolesResponse.json()
        const categoriesData = await categoriesResponse.json()

        if (rolesData.success) {
          setRoles(rolesData.data)
        }

        if (categoriesData.success) {
          setCategories(categoriesData.data)
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        last_name: user.last_name,
        email: user.email || "",
        cellphone: user.cellphone,
        role_id: user.role_id,
        category_id: user.category_id,
        birth_date: user.birth_date,
        active: true,
      })
    } else {
      reset({
        name: "",
        last_name: "",
        email: "",
        cellphone: "",
        role_id: "",
        category_id: "",
        birth_date: "",
        active: true,
      })
    }
  }, [user, reset])

  const onSubmit = (data: UserFormData) => {
    onSave(data)
    reset()
  }

  const isEditing = !!user

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del usuario seleccionado."
              : "Completa los datos para crear un nuevo usuario en el sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <div className="col-span-3">
                <Input
                  id="name"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="last_name" className="text-right">
                Apellido
              </Label>
              <div className="col-span-3">
                <Input
                  id="last_name"
                  {...register("last_name")}
                  className={errors.last_name ? "border-red-500" : ""}
                />
                {errors.last_name && <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <div className="col-span-3">
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cellphone" className="text-right">
                Teléfono
              </Label>
              <div className="col-span-3">
                <Input
                  id="cellphone"
                  {...register("cellphone")}
                  placeholder="+34 666 123 456"
                  className={errors.cellphone ? "border-red-500" : ""}
                />
                {errors.cellphone && <p className="text-sm text-red-500 mt-1">{errors.cellphone.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birth_date" className="text-right">
                Fecha Nacimiento
              </Label>
              <div className="col-span-3">
                <Input
                  id="birth_date"
                  type="date"
                  {...register("birth_date")}
                  className={errors.birth_date ? "border-red-500" : ""}
                />
                {errors.birth_date && <p className="text-sm text-red-500 mt-1">{errors.birth_date.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role_id" className="text-right">
                Rol
              </Label>
              <div className="col-span-3">
                <Select
                  value={role_id}
                  onValueChange={(value) => setValue("role_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar rol" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.role_id && <p className="text-sm text-red-500 mt-1">{errors.role_id.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category_id" className="text-right">
                Categoría
              </Label>
              <div className="col-span-3">
                <Select
                  value={category_id}
                  onValueChange={(value) => setValue("category_id", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category_id && <p className="text-sm text-red-500 mt-1">{errors.category_id.message}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {isEditing ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}