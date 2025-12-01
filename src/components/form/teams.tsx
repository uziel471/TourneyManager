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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from 'lucide-react'
import { teamSchema, type TeamFormData } from "@/lib/validations/team"

interface Team {
  id: string
  name: string
  logo?: string
  category: string
  coach: string
  coachPhone: string
  coachEmail: string
  foundedYear: number
  homeVenue: string
  status: string
}

interface TeamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team
  onSave: (teamData: TeamFormData) => void
}

export function TeamFormDialog({ open, onOpenChange, team, onSave }: TeamFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TeamFormData>({
    resolver: yupResolver(teamSchema),
    defaultValues: {
      name: "",
      logo: "",
      category: "Primera",
      coach: "",
      coachPhone: "",
      coachEmail: "",
      foundedYear: new Date().getFullYear(),
      homeVenue: "",
      status: "active",
    },
  })

  const formData = watch()

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        logo: team.logo || "",
        category: team.category as TeamFormData['category'],
        coach: team.coach,
        coachPhone: team.coachPhone,
        coachEmail: team.coachEmail,
        foundedYear: team.foundedYear,
        homeVenue: team.homeVenue,
        status: team.status as TeamFormData['status'],
      })
    } else {
      reset({
        name: "",
        logo: "",
        category: "Primera",
        coach: "",
        coachPhone: "",
        coachEmail: "",
        foundedYear: new Date().getFullYear(),
        homeVenue: "",
        status: "active",
      })
    }
  }, [team, reset, open])

  const onSubmit = (data: TeamFormData) => {
    onSave(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{team ? "Editar Equipo" : "Crear Nuevo Equipo"}</DialogTitle>
          <DialogDescription>
            {team
              ? "Modifica la información del equipo seleccionado."
              : "Completa la información para registrar un nuevo equipo."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo y Nombre */}
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2">
              <Avatar className="h-16 w-16">
                <AvatarImage src={formData.logo || "/placeholder.svg"} alt={formData.name} />
                <AvatarFallback>
                  {formData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase() || "EQ"}
                </AvatarFallback>
              </Avatar>
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Logo
              </Button>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Equipo *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ej: Real Madrid FC"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setValue("category", value as TeamFormData['category'])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primera">Primera División</SelectItem>
                      <SelectItem value="Segunda">Segunda División</SelectItem>
                      <SelectItem value="Juvenil">Juvenil</SelectItem>
                      <SelectItem value="Infantil">Infantil</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <Label htmlFor="foundedYear">Año de Fundación *</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    {...register("foundedYear", { valueAsNumber: true })}
                    min="1800"
                    max={new Date().getFullYear()}
                    className={errors.foundedYear ? "border-red-500" : ""}
                  />
                  {errors.foundedYear && <p className="text-sm text-red-500 mt-1">{errors.foundedYear.message}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Información del Entrenador */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Información del Entrenador</h4>

            <div>
              <Label htmlFor="coach">Nombre del Entrenador *</Label>
              <Input
                id="coach"
                {...register("coach")}
                placeholder="Ej: Carlos Ancelotti"
                className={errors.coach ? "border-red-500" : ""}
              />
              {errors.coach && <p className="text-sm text-red-500 mt-1">{errors.coach.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coachEmail">Email del Entrenador *</Label>
                <Input
                  id="coachEmail"
                  type="email"
                  {...register("coachEmail")}
                  placeholder="entrenador@equipo.com"
                  className={errors.coachEmail ? "border-red-500" : ""}
                />
                {errors.coachEmail && <p className="text-sm text-red-500 mt-1">{errors.coachEmail.message}</p>}
              </div>

              <div>
                <Label htmlFor="coachPhone">Teléfono del Entrenador *</Label>
                <Input
                  id="coachPhone"
                  {...register("coachPhone")}
                  placeholder="+34 123 456 789"
                  className={errors.coachPhone ? "border-red-500" : ""}
                />
                {errors.coachPhone && <p className="text-sm text-red-500 mt-1">{errors.coachPhone.message}</p>}
              </div>
            </div>
          </div>

          {/* Información del Equipo */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm">Información del Equipo</h4>

            <div>
              <Label htmlFor="homeVenue">Sede Local *</Label>
              <Input
                id="homeVenue"
                {...register("homeVenue")}
                placeholder="Ej: Santiago Bernabéu"
                className={errors.homeVenue ? "border-red-500" : ""}
              />
              {errors.homeVenue && <p className="text-sm text-red-500 mt-1">{errors.homeVenue.message}</p>}
            </div>

            <div>
              <Label htmlFor="status">Estado del Equipo</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setValue("status", value as TeamFormData['status'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{team ? "Actualizar Equipo" : "Crear Equipo"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
