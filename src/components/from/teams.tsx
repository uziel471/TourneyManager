"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Upload } from "lucide-react"

import { Team, TeamFormData, TeamCategory, TeamStatus } from "@/app/utils/teams"

interface TeamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team
  onSave: (teamData: TeamFormData) => void
}

export function TeamFormDialog({ open, onOpenChange, team, onSave }: TeamFormDialogProps) {
  const [formData, setFormData] = useState<TeamFormData>({
    name: "",
    logo: "",
    category: TeamCategory.Primera,
    coach: "",
    coachPhone: "",
    coachEmail: "",
    foundedYear: new Date().getFullYear(),
    homeVenue: "",
    status: TeamStatus.Active,
  })

  const [errors, setErrors] = useState<Partial<TeamFormData>>({})

  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        logo: team.logo || "",
        category: team.category,
        coach: team.coach,
        coachPhone: team.coachPhone,
        coachEmail: team.coachEmail,
        foundedYear: team.foundedYear,
        homeVenue: team.homeVenue,
        status: team.status,
      })
    } else {
      setFormData({
        name: "",
        logo: "",
        category: TeamCategory.Primera,
        coach: "",
        coachPhone: "",
        coachEmail: "",
        foundedYear: new Date().getFullYear(),
        homeVenue: "",
        status: TeamStatus.Active,
      })
    }
    setErrors({})
  }, [team, open])

  const validateForm = (): boolean => {
    const newErrors: Partial<TeamFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del equipo es requerido"
    }

    if (!formData.coach.trim()) {
      newErrors.coach = "El nombre del entrenador es requerido"
    }

    if (!formData.coachEmail.trim()) {
      newErrors.coachEmail = "El email del entrenador es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.coachEmail)) {
      newErrors.coachEmail = "El email no es válido"
    }

    if (!formData.coachPhone.trim()) {
      newErrors.coachPhone = "El teléfono del entrenador es requerido"
    }

    if (!formData.homeVenue.trim()) {
      newErrors.homeVenue = "La sede local es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSave(formData)
    }
  }

  const handleInputChange = (field: keyof TeamFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
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

        <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Ej: Real Madrid FC"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: TeamCategory) => handleInputChange("category", value)}
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
                </div>

                <div>
                  <Label htmlFor="foundedYear">Año de Fundación *</Label>
                  <Input
                    id="foundedYear"
                    type="number"
                    value={formData.foundedYear}
                    onChange={(e) => handleInputChange("foundedYear", Number.parseInt(e.target.value))}
                    min="1800"
                    max={new Date().getFullYear()}
                    className={errors.foundedYear ? "border-red-500" : ""}
                  />
                  {errors.foundedYear && <p className="text-sm text-red-500 mt-1">{errors.foundedYear}</p>}
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
                value={formData.coach}
                onChange={(e) => handleInputChange("coach", e.target.value)}
                placeholder="Ej: Carlos Ancelotti"
                className={errors.coach ? "border-red-500" : ""}
              />
              {errors.coach && <p className="text-sm text-red-500 mt-1">{errors.coach}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="coachEmail">Email del Entrenador *</Label>
                <Input
                  id="coachEmail"
                  type="email"
                  value={formData.coachEmail}
                  onChange={(e) => handleInputChange("coachEmail", e.target.value)}
                  placeholder="entrenador@equipo.com"
                  className={errors.coachEmail ? "border-red-500" : ""}
                />
                {errors.coachEmail && <p className="text-sm text-red-500 mt-1">{errors.coachEmail}</p>}
              </div>

              <div>
                <Label htmlFor="coachPhone">Teléfono del Entrenador *</Label>
                <Input
                  id="coachPhone"
                  value={formData.coachPhone}
                  onChange={(e) => handleInputChange("coachPhone", e.target.value)}
                  placeholder="+34 123 456 789"
                  className={errors.coachPhone ? "border-red-500" : ""}
                />
                {errors.coachPhone && <p className="text-sm text-red-500 mt-1">{errors.coachPhone}</p>}
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
                value={formData.homeVenue}
                onChange={(e) => handleInputChange("homeVenue", e.target.value)}
                placeholder="Ej: Santiago Bernabéu"
                className={errors.homeVenue ? "border-red-500" : ""}
              />
              {errors.homeVenue && <p className="text-sm text-red-500 mt-1">{errors.homeVenue}</p>}
            </div>

            <div>
              <Label htmlFor="status">Estado del Equipo</Label>
              <Select value={formData.status} onValueChange={(value: TeamStatus) => handleInputChange("status", value)}>
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
