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
import { Textarea } from "@/components/ui/textarea"
import { tournamentSchema, type TournamentFormData } from "@/lib/validations/tournament"

interface Tournament {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  location: string
  category: string
  maxTeams: number
  format: string
  status: string
  registrationDeadline?: string
  entryFee?: number
  prizePool?: number
  rules?: string
}

interface TournamentFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament?: Tournament
  onSave: (tournamentData: TournamentFormData) => void
}

export function TournamentFormDialog({ open, onOpenChange, tournament, onSave }: TournamentFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TournamentFormData>({
    resolver: yupResolver(tournamentSchema),
    defaultValues: {
      name: "",
      description: "",
      startDate: "",
      endDate: "",
      location: "",
      category: "Primera",
      maxTeams: 16,
      format: "league",
      status: "planned",
      registrationDeadline: "",
      entryFee: 0,
      prizePool: 0,
      rules: "",
    },
  })

  const category = watch("category")
  const format = watch("format")
  const status = watch("status")

  useEffect(() => {
    if (tournament) {
      reset({
        name: tournament.name,
        description: tournament.description || "",
        startDate: tournament.startDate.split("T")[0],
        endDate: tournament.endDate.split("T")[0],
        location: tournament.location,
        category: tournament.category as TournamentFormData["category"],
        maxTeams: tournament.maxTeams,
        format: tournament.format as TournamentFormData["format"],
        status: tournament.status as TournamentFormData["status"],
        registrationDeadline: tournament.registrationDeadline ? tournament.registrationDeadline.split("T")[0] : "",
        entryFee: tournament.entryFee || 0,
        prizePool: tournament.prizePool || 0,
        rules: tournament.rules || "",
      })
    } else {
      reset({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        location: "",
        category: "Primera",
        maxTeams: 16,
        format: "league",
        status: "planned",
        registrationDeadline: "",
        entryFee: 0,
        prizePool: 0,
        rules: "",
      })
    }
  }, [tournament, reset])

  const onSubmit = (data: TournamentFormData) => {
    onSave(data)
    reset()
  }

  const isEditing = !!tournament

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Torneo" : "Crear Nuevo Torneo"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica la información del torneo seleccionado."
              : "Completa los datos para crear un nuevo torneo en el sistema."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Información Básica</h3>

              <div className="grid gap-2">
                <Label htmlFor="name">Nombre del Torneo *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ej: Copa de Verano 2024"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Descripción del torneo..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setValue("category", value as TournamentFormData["category"])}
                  >
                    <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Primera">Primera</SelectItem>
                      <SelectItem value="Segunda">Segunda</SelectItem>
                      <SelectItem value="Juvenil">Juvenil</SelectItem>
                      <SelectItem value="Infantil">Infantil</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="location">Ubicación *</Label>
                  <Input
                    id="location"
                    {...register("location")}
                    placeholder="Ciudad o estadio"
                    className={errors.location ? "border-red-500" : ""}
                  />
                  {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
                </div>
              </div>
            </div>

            {/* Fechas */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Fechas</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startDate">Fecha de Inicio *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    {...register("startDate")}
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && <p className="text-sm text-red-500">{errors.startDate.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="endDate">Fecha de Finalización *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    {...register("endDate")}
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && <p className="text-sm text-red-500">{errors.endDate.message}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="registrationDeadline">Fecha Límite de Inscripción</Label>
                <Input id="registrationDeadline" type="date" {...register("registrationDeadline")} />
              </div>
            </div>

            {/* Configuración del torneo */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Configuración del Torneo</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="format">Formato *</Label>
                  <Select
                    value={format}
                    onValueChange={(value) => setValue("format", value as TournamentFormData["format"])}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="league">Liga (Todos contra todos)</SelectItem>
                      <SelectItem value="knockout">Eliminación directa</SelectItem>
                      <SelectItem value="group_knockout">Grupos + Eliminación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="maxTeams">Equipos Máximos *</Label>
                  <Input
                    id="maxTeams"
                    type="number"
                    {...register("maxTeams", { valueAsNumber: true })}
                    min={2}
                    max={64}
                    className={errors.maxTeams ? "border-red-500" : ""}
                  />
                  {errors.maxTeams && <p className="text-sm text-red-500">{errors.maxTeams.message}</p>}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setValue("status", value as TournamentFormData["status"])}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planificado</SelectItem>
                    <SelectItem value="registration">Inscripciones Abiertas</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Información económica */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Información Económica</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="entryFee">Cuota de Inscripción ($)</Label>
                  <Input
                    id="entryFee"
                    type="number"
                    {...register("entryFee", { valueAsNumber: true })}
                    min={0}
                    step={0.01}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="prizePool">Premio Total ($)</Label>
                  <Input
                    id="prizePool"
                    type="number"
                    {...register("prizePool", { valueAsNumber: true })}
                    min={0}
                    step={0.01}
                  />
                </div>
              </div>
            </div>

            {/* Reglas */}
            <div className="grid gap-2">
              <Label htmlFor="rules">Reglas del Torneo</Label>
              <Textarea id="rules" {...register("rules")} placeholder="Reglas y normativas específicas..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{isEditing ? "Guardar Cambios" : "Crear Torneo"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
