"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { matchSchema, type MatchFormData } from "@/lib/validations/match"
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

interface Match {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  match_date: string
  match_time: string
  venue: string
  round?: string
  home_score?: number
  away_score?: number
  status: string
  referee_id?: string
  notes?: string
}

interface Tournament {
  id: string
  name: string
}

interface Team {
  id: string
  name: string
}

interface User {
  id: string
  first_name: string
  last_name: string
  role: string
}

interface MatchFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (data: MatchFormData) => void
  match?: Match
  tournaments: Tournament[]
  teams: Team[]
  referees: User[]
}

export function MatchFormDialog({
  open,
  onOpenChange,
  onSave,
  match,
  tournaments,
  teams,
  referees,
}: MatchFormDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<MatchFormData>({
    resolver: yupResolver(matchSchema),
    defaultValues: {
      tournamentId: "",
      homeTeamId: "",
      awayTeamId: "",
      matchDate: "",
      matchTime: "",
      venue: "",
      round: "",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      refereeId: "",
      notes: "",
    },
  })

  const selectedStatus = watch("status")

  useEffect(() => {
    if (match) {
      setValue("tournamentId", match.tournament_id)
      setValue("homeTeamId", match.home_team_id)
      setValue("awayTeamId", match.away_team_id)
      setValue("matchDate", match.match_date)
      setValue("matchTime", match.match_time)
      setValue("venue", match.venue)
      setValue("round", match.round || "")
      setValue("homeScore", match.home_score ?? null)
      setValue("awayScore", match.away_score ?? null)
      setValue("status", match.status as any)
      setValue("refereeId", match.referee_id || "")
      setValue("notes", match.notes || "")
    } else {
      reset()
    }
  }, [match, setValue, reset])

  const onSubmit = (data: MatchFormData) => {
    onSave(data)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{match ? "Editar Partido" : "Nuevo Partido"}</DialogTitle>
          <DialogDescription>
            {match ? "Modifica los datos del partido" : "Completa los datos para crear un nuevo partido"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="tournamentId">
                Torneo <span className="text-red-500">*</span>
              </Label>
              <Select value={watch("tournamentId")} onValueChange={(value) => setValue("tournamentId", value)}>
                <SelectTrigger id="tournamentId">
                  <SelectValue placeholder="Selecciona un torneo" />
                </SelectTrigger>
                <SelectContent>
                  {tournaments.map((tournament) => (
                    <SelectItem key={tournament.id} value={tournament.id}>
                      {tournament.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tournamentId && <p className="text-sm text-red-500">{errors.tournamentId.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="homeTeamId">
                  Equipo Local <span className="text-red-500">*</span>
                </Label>
                <Select value={watch("homeTeamId")} onValueChange={(value) => setValue("homeTeamId", value)}>
                  <SelectTrigger id="homeTeamId">
                    <SelectValue placeholder="Equipo local" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.homeTeamId && <p className="text-sm text-red-500">{errors.homeTeamId.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="awayTeamId">
                  Equipo Visitante <span className="text-red-500">*</span>
                </Label>
                <Select value={watch("awayTeamId")} onValueChange={(value) => setValue("awayTeamId", value)}>
                  <SelectTrigger id="awayTeamId">
                    <SelectValue placeholder="Equipo visitante" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.awayTeamId && <p className="text-sm text-red-500">{errors.awayTeamId.message}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="matchDate">
                  Fecha <span className="text-red-500">*</span>
                </Label>
                <Input id="matchDate" type="date" {...register("matchDate")} />
                {errors.matchDate && <p className="text-sm text-red-500">{errors.matchDate.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="matchTime">
                  Hora <span className="text-red-500">*</span>
                </Label>
                <Input id="matchTime" type="time" {...register("matchTime")} />
                {errors.matchTime && <p className="text-sm text-red-500">{errors.matchTime.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="venue">
                Lugar <span className="text-red-500">*</span>
              </Label>
              <Input id="venue" placeholder="Estadio o cancha" {...register("venue")} />
              {errors.venue && <p className="text-sm text-red-500">{errors.venue.message}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="round">Jornada/Fase</Label>
                <Input id="round" placeholder="Ej: Jornada 1, Semifinal" {...register("round")} />
                {errors.round && <p className="text-sm text-red-500">{errors.round.message}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">
                  Estado <span className="text-red-500">*</span>
                </Label>
                <Select value={watch("status")} onValueChange={(value) => setValue("status", value as any)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Programado</SelectItem>
                    <SelectItem value="in_progress">En Progreso</SelectItem>
                    <SelectItem value="finished">Finalizado</SelectItem>
                    <SelectItem value="postponed">Pospuesto</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-sm text-red-500">{errors.status.message}</p>}
              </div>
            </div>

            {(selectedStatus === "finished" || selectedStatus === "in_progress") && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="homeScore">Marcador Local</Label>
                  <Input
                    id="homeScore"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("homeScore", { valueAsNumber: true })}
                  />
                  {errors.homeScore && <p className="text-sm text-red-500">{errors.homeScore.message}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="awayScore">Marcador Visitante</Label>
                  <Input
                    id="awayScore"
                    type="number"
                    min="0"
                    placeholder="0"
                    {...register("awayScore", { valueAsNumber: true })}
                  />
                  {errors.awayScore && <p className="text-sm text-red-500">{errors.awayScore.message}</p>}
                </div>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="refereeId">Árbitro</Label>
              <Select value={watch("refereeId")} onValueChange={(value) => setValue("refereeId", value)}>
                <SelectTrigger id="refereeId">
                  <SelectValue placeholder="Selecciona un árbitro (opcional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no_referee">Sin asignar</SelectItem>
                  {referees.map((referee) => (
                    <SelectItem key={referee.id} value={referee.id}>
                      {referee.first_name} {referee.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.refereeId && <p className="text-sm text-red-500">{errors.refereeId.message}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea id="notes" placeholder="Información adicional del partido" rows={3} {...register("notes")} />
              {errors.notes && <p className="text-sm text-red-500">{errors.notes.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">{match ? "Actualizar" : "Crear"} Partido</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
