"use client"

import { useState } from "react"
import {
  Trophy,
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Award,
  TrendingUp,
  UserPlus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TournamentFormDialog } from "@/components/form/tournament"
import { AssignTeamsDialog } from "@/components/form/assignTeams"
interface Tournament {
  id: string
  name: string
  description?: string
  startDate: string
  endDate: string
  location: string
  category: string
  maxTeams: number
  currentTeams: number
  format: string
  status: string
  registrationDeadline?: string
  entryFee?: number
  prizePool?: number
  rules?: string
  createdAt: string
  assignedTeamIds?: string[]
}

interface Team {
  id: string
  name: string
  logo?: string
  category: string
  playersCount: number
  status: string
}

const statusLabels: Record<string, string> = {
  planned: "Planificado",
  registration: "Inscripciones",
  in_progress: "En Curso",
  finished: "Finalizado",
  cancelled: "Cancelado",
}

const statusColors: Record<string, string> = {
  planned: "bg-blue-100 text-blue-800",
  registration: "bg-green-100 text-green-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  finished: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
}

const formatLabels: Record<string, string> = {
  league: "Liga",
  knockout: "Eliminación Directa",
  group_knockout: "Grupos + Eliminación",
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: "1",
      name: "Copa Primavera 2024",
      description: "Torneo clasificatorio para la liga profesional",
      startDate: "2024-03-15",
      endDate: "2024-04-20",
      location: "Estadio Municipal",
      category: "Primera",
      maxTeams: 16,
      currentTeams: 12,
      format: "group_knockout",
      status: "registration",
      registrationDeadline: "2024-03-10",
      entryFee: 500,
      prizePool: 5000,
      rules: "Formato FIFA estándar",
      createdAt: "2024-01-15T10:00:00Z",
      assignedTeamIds: ["1", "2", "3"],
    },
    {
      id: "2",
      name: "Liga Juvenil Verano",
      description: "Competición para categorías juveniles",
      startDate: "2024-06-01",
      endDate: "2024-07-30",
      location: "Complejo Deportivo Norte",
      category: "Juvenil",
      maxTeams: 12,
      currentTeams: 8,
      format: "league",
      status: "planned",
      registrationDeadline: "2024-05-20",
      entryFee: 300,
      prizePool: 2000,
      rules: "Reglamento juvenil RFEF",
      createdAt: "2024-01-20T14:30:00Z",
      assignedTeamIds: ["4", "5"],
    },
    {
      id: "3",
      name: "Torneo Relámpago",
      description: "Competición de eliminación directa en un día",
      startDate: "2024-02-10",
      endDate: "2024-02-10",
      location: "Polideportivo Central",
      category: "Segunda",
      maxTeams: 8,
      currentTeams: 8,
      format: "knockout",
      status: "in_progress",
      entryFee: 200,
      prizePool: 1000,
      rules: "Partidos de 30 minutos",
      createdAt: "2024-01-05T09:00:00Z",
      assignedTeamIds: ["6", "7", "8", "9", "10", "11", "12", "13"],
    },
  ])

  const [availableTeams] = useState<Team[]>([
    {
      id: "1",
      name: "FC Barcelona B",
      logo: "/placeholder.svg",
      category: "Primera",
      playersCount: 25,
      status: "active",
    },
    {
      id: "2",
      name: "Real Madrid C",
      logo: "/placeholder.svg",
      category: "Primera",
      playersCount: 23,
      status: "active",
    },
    {
      id: "3",
      name: "Atlético Madrid B",
      logo: "/placeholder.svg",
      category: "Primera",
      playersCount: 22,
      status: "active",
    },
    {
      id: "4",
      name: "Valencia CF Juvenil",
      logo: "/placeholder.svg",
      category: "Juvenil",
      playersCount: 20,
      status: "active",
    },
    {
      id: "5",
      name: "Sevilla FC Juvenil",
      logo: "/placeholder.svg",
      category: "Juvenil",
      playersCount: 21,
      status: "active",
    },
    {
      id: "6",
      name: "Betis Deportivo",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 24,
      status: "active",
    },
    { id: "7", name: "Espanyol B", logo: "/placeholder.svg", category: "Segunda", playersCount: 22, status: "active" },
    {
      id: "8",
      name: "Villarreal B",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 23,
      status: "active",
    },
    {
      id: "9",
      name: "Athletic Club B",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 25,
      status: "active",
    },
    {
      id: "10",
      name: "Real Sociedad B",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 21,
      status: "active",
    },
    {
      id: "11",
      name: "Celta de Vigo B",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 20,
      status: "active",
    },
    {
      id: "12",
      name: "Granada CF B",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 22,
      status: "active",
    },
    {
      id: "13",
      name: "Getafe CF B",
      logo: "/placeholder.svg",
      category: "Segunda",
      playersCount: 23,
      status: "active",
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<Tournament>()
  const [isAssignTeamsOpen, setIsAssignTeamsOpen] = useState(false)
  const [tournamentForTeamAssignment, setTournamentForTeamAssignment] = useState<Tournament>()

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || tournament.category === categoryFilter
    const matchesStatus = statusFilter === "all" || tournament.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCreateTournament = () => {
    setSelectedTournament(undefined)
    setIsDialogOpen(true)
  }

  const handleEditTournament = (tournament: Tournament) => {
    setSelectedTournament(tournament)
    setIsDialogOpen(true)
  }

  const handleDeleteTournament = (tournamentId: string) => {
    setTournaments(tournaments.filter((t) => t.id !== tournamentId))
  }

  const handleSaveTournament = (tournamentData: Tournament) => {
    if (selectedTournament) {
      setTournaments(
        tournaments.map((t) =>
          t.id === selectedTournament.id
            ? {
                ...t,
                name: tournamentData.name,
                description: tournamentData.description,
                startDate: tournamentData.startDate,
                endDate: tournamentData.endDate,
                location: tournamentData.location,
                category: tournamentData.category,
                maxTeams: tournamentData.maxTeams,
                format: tournamentData.format,
                status: tournamentData.status,
                registrationDeadline: tournamentData.registrationDeadline,
                entryFee: tournamentData.entryFee,
                prizePool: tournamentData.prizePool,
                rules: tournamentData.rules,
              }
            : t,
        ),
      )
    } else {
      const newTournament: Tournament = {
        id: Math.random().toString(36).substr(2, 9),
        name: tournamentData.name,
        description: tournamentData.description,
        startDate: tournamentData.startDate,
        endDate: tournamentData.endDate,
        location: tournamentData.location,
        category: tournamentData.category,
        maxTeams: tournamentData.maxTeams,
        currentTeams: 0,
        format: tournamentData.format,
        status: tournamentData.status,
        registrationDeadline: tournamentData.registrationDeadline,
        entryFee: tournamentData.entryFee,
        prizePool: tournamentData.prizePool,
        rules: tournamentData.rules,
        createdAt: new Date().toISOString(),
      }
      setTournaments([newTournament, ...tournaments])
    }
    setIsDialogOpen(false)
  }

  const handleAssignTeams = (tournament: Tournament) => {
    setTournamentForTeamAssignment(tournament)
    setIsAssignTeamsOpen(true)
  }

  const handleSaveTeamAssignment = (tournamentId: string, teamIds: string[]) => {
    setTournaments(
      tournaments.map((t) =>
        t.id === tournamentId
          ? {
              ...t,
              assignedTeamIds: teamIds,
              currentTeams: teamIds.length,
            }
          : t,
      ),
    )
  }

  const stats = {
    total: tournaments.length,
    active: tournaments.filter((t) => t.status === "in_progress").length,
    registration: tournaments.filter((t) => t.status === "registration").length,
    totalPrize: tournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0),
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Torneos</h1>
          <p className="text-muted-foreground">Administra torneos, inscripciones y seguimiento de competiciones</p>
        </div>
        <Button onClick={handleCreateTournament}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Torneo
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Torneos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">En curso actualmente</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inscripciones Abiertas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.registration}</div>
            <p className="text-xs text-muted-foreground">Disponibles para registro</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premio Total</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPrize.toFixed(0)}€</div>
            <p className="text-xs text-muted-foreground">En premios acumulados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra torneos específicos usando los filtros disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o ubicación..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="Primera">Primera</SelectItem>
                <SelectItem value="Segunda">Segunda</SelectItem>
                <SelectItem value="Juvenil">Juvenil</SelectItem>
                <SelectItem value="Infantil">Infantil</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="planned">Planificado</SelectItem>
                <SelectItem value="registration">Inscripciones</SelectItem>
                <SelectItem value="in_progress">En Curso</SelectItem>
                <SelectItem value="finished">Finalizado</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tournaments Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTournaments.map((tournament) => {
          const assignedTeams = availableTeams.filter((team) => tournament.assignedTeamIds?.includes(team.id))

          return (
            <Card key={tournament.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{tournament.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tournament.description || "Sin descripción"}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <span className="sr-only">Abrir menú</span>
                        <Trophy className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleAssignTeams(tournament)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Asignar Equipos
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditTournament(tournament)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTournament(tournament.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className={statusColors[tournament.status]}>{statusLabels[tournament.status]}</Badge>
                  <Badge variant="outline">{tournament.category}</Badge>
                  <Badge variant="secondary">{formatLabels[tournament.format]}</Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(tournament.startDate).toLocaleDateString()} -{" "}
                      {new Date(tournament.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{tournament.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>
                      {tournament.currentTeams} / {tournament.maxTeams} equipos
                    </span>
                  </div>
                  {tournament.prizePool && tournament.prizePool > 0 && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Premio: {tournament.prizePool}€</span>
                    </div>
                  )}
                </div>

                {assignedTeams.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Equipos inscritos:</p>
                    <div className="flex flex-wrap gap-1">
                      {assignedTeams.slice(0, 3).map((team) => (
                        <Badge key={team.id} variant="secondary" className="text-xs">
                          {team.name}
                        </Badge>
                      ))}
                      {assignedTeams.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{assignedTeams.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {tournament.registrationDeadline && tournament.status === "registration" && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Inscripciones hasta:{" "}
                      <span className="font-medium">
                        {new Date(tournament.registrationDeadline).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTournaments.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron torneos</h3>
            <p className="text-muted-foreground text-center mb-4">
              No hay torneos que coincidan con los filtros seleccionados
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setCategoryFilter("all")
                setStatusFilter("all")
              }}
            >
              Limpiar filtros
            </Button>
          </CardContent>
        </Card>
      )}

      <TournamentFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tournament={selectedTournament}
        onSave={handleSaveTournament}
      />

      {tournamentForTeamAssignment && (
        <AssignTeamsDialog
          open={isAssignTeamsOpen}
          onOpenChange={setIsAssignTeamsOpen}
          tournament={tournamentForTeamAssignment}
          availableTeams={availableTeams}
          onSave={handleSaveTeamAssignment}
        />
      )}
    </div>
  )
}
