"use client"

import { useState } from "react"
import {
  Calendar,
  Plus,
  Search,
  Edit,
  Trash2,
  MapPin,
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock3,
  PlayCircle,
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
import { MatchFormDialog } from "@/components/form/match"

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
  created_at: string
}

interface Tournament {
  id: string
  name: string
}

interface Team {
  id: string
  name: string
  logo?: string
}

interface User {
  id: string
  first_name: string
  last_name: string
  role: string
}

const statusLabels: Record<string, string> = {
  scheduled: "Programado",
  in_progress: "En Progreso",
  finished: "Finalizado",
  postponed: "Pospuesto",
  cancelled: "Cancelado",
}

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  in_progress: "bg-green-100 text-green-800",
  finished: "bg-gray-100 text-gray-800",
  postponed: "bg-yellow-100 text-yellow-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusIcons: Record<string, any> = {
  scheduled: Clock3,
  in_progress: PlayCircle,
  finished: CheckCircle2,
  postponed: Clock,
  cancelled: XCircle,
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: "1",
      tournament_id: "1",
      home_team_id: "1",
      away_team_id: "2",
      match_date: "2024-03-20",
      match_time: "18:00",
      venue: "Estadio Municipal",
      round: "Jornada 1",
      home_score: 2,
      away_score: 1,
      status: "finished",
      referee_id: "ref1",
      notes: "Partido con gran asistencia",
      created_at: "2024-01-15T10:00:00Z",
    },
    {
      id: "2",
      tournament_id: "1",
      home_team_id: "3",
      away_team_id: "1",
      match_date: "2024-03-22",
      match_time: "20:00",
      venue: "Estadio Municipal",
      round: "Jornada 2",
      status: "scheduled",
      referee_id: "ref2",
      created_at: "2024-01-15T11:00:00Z",
    },
    {
      id: "3",
      tournament_id: "2",
      home_team_id: "4",
      away_team_id: "5",
      match_date: "2024-02-10",
      match_time: "16:00",
      venue: "Complejo Deportivo Norte",
      round: "Semifinal",
      home_score: 1,
      away_score: 1,
      status: "in_progress",
      referee_id: "ref1",
      notes: "Tiempo extra en juego",
      created_at: "2024-01-20T14:00:00Z",
    },
  ])

  const [tournaments] = useState<Tournament[]>([
    { id: "1", name: "Copa Primavera 2024" },
    { id: "2", name: "Liga Juvenil Verano" },
    { id: "3", name: "Torneo Relámpago" },
  ])

  const [teams] = useState<Team[]>([
    { id: "1", name: "FC Barcelona B", logo: "/placeholder.svg" },
    { id: "2", name: "Real Madrid C", logo: "/placeholder.svg" },
    { id: "3", name: "Atlético Madrid B", logo: "/placeholder.svg" },
    { id: "4", name: "Valencia CF Juvenil", logo: "/placeholder.svg" },
    { id: "5", name: "Sevilla FC Juvenil", logo: "/placeholder.svg" },
  ])

  const [referees] = useState<User[]>([
    { id: "ref1", first_name: "Carlos", last_name: "Martínez", role: "referee" },
    { id: "ref2", first_name: "Ana", last_name: "García", role: "referee" },
    { id: "ref3", first_name: "Luis", last_name: "Rodríguez", role: "referee" },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [tournamentFilter, setTournamentFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMatch, setSelectedMatch] = useState<Match>()

  const filteredMatches = matches.filter((match) => {
    const homeTeam = teams.find((t) => t.id === match.home_team_id)
    const awayTeam = teams.find((t) => t.id === match.away_team_id)
    const tournament = tournaments.find((t) => t.id === match.tournament_id)

    const matchesSearch =
      homeTeam?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      awayTeam?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tournament?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.venue.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesTournament = tournamentFilter === "all" || match.tournament_id === tournamentFilter
    const matchesStatus = statusFilter === "all" || match.status === statusFilter

    return matchesSearch && matchesTournament && matchesStatus
  })

  const handleCreateMatch = () => {
    setSelectedMatch(undefined)
    setIsDialogOpen(true)
  }

  const handleEditMatch = (match: Match) => {
    setSelectedMatch(match)
    setIsDialogOpen(true)
  }

  const handleDeleteMatch = (matchId: string) => {
    setMatches(matches.filter((m) => m.id !== matchId))
  }

  const handleSaveMatch = (matchData: any) => {
    if (selectedMatch) {
      setMatches(
        matches.map((m) =>
          m.id === selectedMatch.id
            ? {
                ...m,
                tournament_id: matchData.tournamentId,
                home_team_id: matchData.homeTeamId,
                away_team_id: matchData.awayTeamId,
                match_date: matchData.matchDate,
                match_time: matchData.matchTime,
                venue: matchData.venue,
                round: matchData.round,
                home_score: matchData.homeScore,
                away_score: matchData.awayScore,
                status: matchData.status,
                referee_id: matchData.refereeId || undefined,
                notes: matchData.notes,
              }
            : m,
        ),
      )
    } else {
      const newMatch: Match = {
        id: Math.random().toString(36).substr(2, 9),
        tournament_id: matchData.tournamentId,
        home_team_id: matchData.homeTeamId,
        away_team_id: matchData.awayTeamId,
        match_date: matchData.matchDate,
        match_time: matchData.matchTime,
        venue: matchData.venue,
        round: matchData.round,
        home_score: matchData.homeScore,
        away_score: matchData.awayScore,
        status: matchData.status,
        referee_id: matchData.refereeId || undefined,
        notes: matchData.notes,
        created_at: new Date().toISOString(),
      }
      setMatches([newMatch, ...matches])
    }
    setIsDialogOpen(false)
  }

  const stats = {
    total: matches.length,
    scheduled: matches.filter((m) => m.status === "scheduled").length,
    inProgress: matches.filter((m) => m.status === "in_progress").length,
    finished: matches.filter((m) => m.status === "finished").length,
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Partidos</h1>
          <p className="text-muted-foreground">Administra y da seguimiento a todos los partidos de los torneos</p>
        </div>
        <Button onClick={handleCreateMatch}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Partido
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partidos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Registrados en el sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programados</CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.scheduled}</div>
            <p className="text-xs text-muted-foreground">Próximos partidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <PlayCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Actualmente jugando</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.finished}</div>
            <p className="text-xs text-muted-foreground">Partidos completados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros y Búsqueda</CardTitle>
          <CardDescription>Encuentra partidos específicos usando los filtros disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipos, torneo o lugar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={tournamentFilter} onValueChange={setTournamentFilter}>
              <SelectTrigger className="w-full md:w-[220px]">
                <SelectValue placeholder="Filtrar por torneo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los torneos</SelectItem>
                {tournaments.map((tournament) => (
                  <SelectItem key={tournament.id} value={tournament.id}>
                    {tournament.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="scheduled">Programado</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="finished">Finalizado</SelectItem>
                <SelectItem value="postponed">Pospuesto</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Matches List */}
      <div className="space-y-4">
        {filteredMatches.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No se encontraron partidos</p>
              <p className="text-sm text-muted-foreground">Intenta ajustar los filtros o crea un nuevo partido</p>
            </CardContent>
          </Card>
        ) : (
          filteredMatches.map((match) => {
            const homeTeam = teams.find((t) => t.id === match.home_team_id)
            const awayTeam = teams.find((t) => t.id === match.away_team_id)
            const tournament = tournaments.find((t) => t.id === match.tournament_id)
            const referee = referees.find((r) => r.id === match.referee_id)
            const StatusIcon = statusIcons[match.status]

            return (
              <Card key={match.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Match Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={statusColors[match.status]}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusLabels[match.status]}
                        </Badge>
                        <Badge variant="outline">{tournament?.name}</Badge>
                        {match.round && <Badge variant="secondary">{match.round}</Badge>}
                      </div>

                      {/* Teams and Score */}
                      <div className="flex items-center gap-4">
                        <div className="flex-1 text-right">
                          <p className="font-semibold text-lg">{homeTeam?.name}</p>
                          <p className="text-xs text-muted-foreground">Local</p>
                        </div>

                        <div className="flex items-center gap-2 px-4">
                          {match.status === "finished" || match.status === "in_progress" ? (
                            <div className="text-center">
                              <div className="text-3xl font-bold">
                                {match.home_score ?? 0} - {match.away_score ?? 0}
                              </div>
                            </div>
                          ) : (
                            <div className="text-2xl font-bold text-muted-foreground">VS</div>
                          )}
                        </div>

                        <div className="flex-1">
                          <p className="font-semibold text-lg">{awayTeam?.name}</p>
                          <p className="text-xs text-muted-foreground">Visitante</p>
                        </div>
                      </div>

                      {/* Match Details */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(match.match_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{match.match_time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{match.venue}</span>
                        </div>
                        {referee && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs">
                              Árbitro: {referee.first_name} {referee.last_name}
                            </span>
                          </div>
                        )}
                      </div>

                      {match.notes && (
                        <p className="text-sm text-muted-foreground border-l-2 pl-3 border-muted">{match.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trophy className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditMatch(match)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteMatch(match.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      <MatchFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveMatch}
        match={selectedMatch}
        tournaments={tournaments}
        teams={teams}
        referees={referees}
      />
    </div>
  )
}
