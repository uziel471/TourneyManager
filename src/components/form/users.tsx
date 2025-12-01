"use client"

import { useEffect } from "react"
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
import { Switch } from "@/components/ui/switch"
import { userSchema, type UserFormData } from "@/lib/validations/user"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: string
  status: string
  team?: string
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
  onSave: (userData: UserFormData) => void
}

export function UserFormDialog({ open, onOpenChange, user, onSave }: UserFormDialogProps) {
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
      email: "",
      phone: "",
      role: "player",
      team: "",
      sendWelcomeEmail: true,
    },
  })

  const role = watch("role")

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role as UserFormData['role'],
        team: user.team || "",
        sendWelcomeEmail: false,
      })
    } else {
      reset({
        name: "",
        email: "",
        phone: "",
        role: "player",
        team: "",
        sendWelcomeEmail: true,
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
              <Label htmlFor="phone" className="text-right">
                Teléfono
              </Label>
              <div className="col-span-3">
                <Input
                  id="phone"
                  {...register("phone")}
                  placeholder="+34 666 123 456"
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol
              </Label>
              <div className="col-span-3">
                <Select
                  value={role}
                  onValueChange={(value) => setValue("role", value as UserFormData['role'])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="player">Jugador</SelectItem>
                    <SelectItem value="referee">Árbitro</SelectItem>
                    <SelectItem value="organizer">Organizador</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
              </div>
            </div>
            {role === "player" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="team" className="text-right">
                  Equipo
                </Label>
                <div className="col-span-3">
                  <Input
                    id="team"
                    {...register("team")}
                    placeholder="Nombre del equipo"
                  />
                </div>
              </div>
            )}
            {!isEditing && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="welcome-email" className="text-right">
                  Email de Bienvenida
                </Label>
                <div className="col-span-3">
                  <Switch
                    id="welcome-email"
                    checked={watch("sendWelcomeEmail")}
                    onCheckedChange={(checked) => setValue("sendWelcomeEmail", checked)}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Enviar credenciales de acceso por email</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Guardar Cambios" : "Crear Usuario"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}