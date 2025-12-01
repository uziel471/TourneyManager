"use client"

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
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Users, X } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Team {
  id: string
  name: string
  logo?: string
  category: string
  playersCount: number
  status: string
}

interface AssignTeamsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tournament: {
    id: string
    name: string
    maxTeams: number
    category: string
    assignedTeamIds?: string[]
  }
  availableTeams: Team[]
  onSave: (tournamentId: string, teamIds: string[]) => void
}

export function AssignTeamsDialog({ open, onOpenChange, tournament, availableTeams, onSave }: AssignTeamsDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTeamIds, setSelectedTeamIds] = useState<string[]>([])

  useEffect(() => {
    if (open) {
      setSelectedTeamIds(tournament.assignedTeamIds || [])
      setSearchTerm("")
    }
  }, [open, tournament.assignedTeamIds])

  const filteredTeams = availableTeams.filter((team) => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = tournament.category === "all" || team.category === tournament.category
    const isActive = team.status === "active"
    return matchesSearch && matchesCategory && isActive
  })

  const handleToggleTeam = (teamId: string) => {
    setSelectedTeamIds((prev) => {
      if (prev.includes(teamId)) {
        return prev.filter((id) => id !== teamId)
      } else {
        if (prev.length >= tournament.maxTeams) {
          return prev
        }
        return [...prev, teamId]
      }
    })
  }

  const handleRemoveTeam = (teamId: string) => {
    setSelectedTeamIds((prev) => prev.filter((id) => id !== teamId))
  }

  const handleSave = () => {
    onSave(tournament.id, selectedTeamIds)
    onOpenChange(false)
  }

  const selectedTeams = availableTeams.filter((team) => selectedTeamIds.includes(team.id))
  const canAddMore = selectedTeamIds.length < tournament.maxTeams

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Asignar Equipos al Torneo</DialogTitle>
          <DialogDescription>
            {tournament.name} - Máximo {tournament.maxTeams} equipos ({selectedTeamIds.length} seleccionados)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Selected Teams */}
          {selectedTeams.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Equipos Seleccionados</div>
              <div className="flex flex-wrap gap-2">
                {selectedTeams.map((team) => (
                  <Badge key={team.id} variant="secondary" className="px-3 py-1.5 gap-2">
                    <Avatar className="h-4 w-4">
                      <AvatarImage src={team.logo || "/placeholder.svg"} alt={team.name} />
                      <AvatarFallback className="text-[8px]">
                        {team.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {team.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeam(team.id)}
                      className="hover:bg-secondary-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {!canAddMore && (
            <p className="text-sm text-amber-600">
              Se alcanzó el límite máximo de {tournament.maxTeams} equipos para este torneo
            </p>
          )}
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar equipos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* Available Teams List */}
          <ScrollArea className="flex-1 border rounded-md">
            <div className="p-4 space-y-2">
              {filteredTeams.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No se encontraron equipos</p>
                </div>
              ) : (
                filteredTeams.map((team) => {
                  const isSelected = selectedTeamIds.includes(team.id)
                  const isDisabled = !isSelected && !canAddMore

                  return (
                    <div
                      key={team.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                        isSelected
                          ? "bg-primary/5 border-primary"
                          : isDisabled
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-muted cursor-pointer"
                      }`}
                      onClick={() => !isDisabled && handleToggleTeam(team.id)}
                    >
                      <Checkbox
                        checked={isSelected}
                        disabled={isDisabled}
                        onCheckedChange={() => !isDisabled && handleToggleTeam(team.id)}
                      />
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={team.logo || "/placeholder.svg"} alt={team.name} />
                        <AvatarFallback>
                          {team.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">{team.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {team.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {team.playersCount} jugadores
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar Asignación</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
