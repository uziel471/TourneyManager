"use client"

import { useState } from "react"
import { Users, Plus, Search, Filter, Edit, Trash2, Eye, Trophy, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TeamFormDialog } from "@/components/from/teams"
import { Team, TeamCategory, TeamStatus } from "@/app/utils/teams"

const mockTeams: Team[] = [
  {
    id: "1",
    name: "Real Madrid FC",
    logo: "/real-madrid-crest.png",
    category: TeamCategory.Primera,
    coach: "Carlos Ancelotti",
    coachPhone: "+34 123 456 789",
    coachEmail: "carlos@realmadrid.com",
    playersCount: 25,
    foundedYear: 1902,
    homeVenue: "Santiago Bernabéu",
    status: TeamStatus.Active,
    tournaments: ["Liga Española", "Champions League"],
    wins: 18,
    draws: 4,
    losses: 2,
    goalsFor: 45,
    goalsAgainst: 18,
    points: 58,
  },
  {
    id: "2",
    name: "FC Barcelona",
    logo: "/barcelona-crest.png",
    category: TeamCategory.Primera,
    coach: "Xavi Hernández",
    coachPhone: "+34 987 654 321",
    coachEmail: "xavi@fcbarcelona.com",
    playersCount: 24,
    foundedYear: 1899,
    homeVenue: "Camp Nou",
    status: TeamStatus.Active,
    tournaments: ["Liga Española", "Copa del Rey"],
    wins: 16,
    draws: 6,
    losses: 2,
    goalsFor: 42,
    goalsAgainst: 20,
    points: 54,
  },
  {
    id: "3",
    name: "Atlético Madrid",
    logo: "/atletico-madrid-logo.png",
    category: TeamCategory.Primera,
    coach: "Diego Simeone",
    coachPhone: "+34 555 123 456",
    coachEmail: "simeone@atleticomadrid.com",
    playersCount: 23,
    foundedYear: 1903,
    homeVenue: "Wanda Metropolitano",
    status: TeamStatus.Active,
    tournaments: ["Liga Española"],
    wins: 14,
    draws: 8,
    losses: 2,
    goalsFor: 35,
    goalsAgainst: 15,
    points: 50,
  },
  {
    id: "4",
    name: "Sevilla FC",
    logo: "/generic-football-club-badge.png",
    category: TeamCategory.Primera,
    coach: "José Luis Mendilibar",
    coachPhone: "+34 666 789 123",
    coachEmail: "mendilibar@sevillafc.com",
    playersCount: 22,
    foundedYear: 1890,
    homeVenue: "Ramón Sánchez Pizjuán",
    status: TeamStatus.Active,
    tournaments: ["Liga Española", "Europa League"],
    wins: 12,
    draws: 6,
    losses: 6,
    goalsFor: 32,
    goalsAgainst: 28,
    points: 42,
  },
  {
    id: "5",
    name: "Valencia CF",
    logo: "/generic-soccer-club-badge.png",
    category: TeamCategory.Segunda,
    coach: "Rubén Baraja",
    coachPhone: "+34 777 456 789",
    coachEmail: "baraja@valenciacf.com",
    playersCount: 20,
    foundedYear: 1919,
    homeVenue: "Mestalla",
    status: TeamStatus.Suspended,
    tournaments: ["Segunda División"],
    wins: 8,
    draws: 4,
    losses: 10,
    goalsFor: 24,
    goalsAgainst: 35,
    points: 28,
  },
]

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>(mockTeams)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team>()

  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.coach.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || team.category === categoryFilter
    const matchesStatus = statusFilter === "all" || team.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleCreateTeam = () => {
    setSelectedTeam(undefined)
    setIsDialogOpen(true)
  }

  const handleEditTeam = (team: Team) => {
    setSelectedTeam(team)
    setIsDialogOpen(true)
  }

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter((team) => team.id !== teamId))
  }

  const getStatusBadge = (status: Team["status"]) => {
    switch (status) {
      case TeamStatus.Active:
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Activo
          </Badge>
        )
      case "inactive":
        return <Badge variant="secondary">Inactivo</Badge>
      case TeamStatus.Suspended:
        return <Badge variant="destructive">Suspendido</Badge>
    }
  }

  const totalTeams = teams.length
  const activeTeams = teams.filter((t) => t.status === TeamStatus.Active).length
  const totalPlayers = teams.reduce((sum, team) => sum + team.playersCount, 0)
  const avgGoalsPerTeam = teams.reduce((sum, team) => sum + team.goalsFor, 0) / teams.length

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Equipos</h1>
          <p className="text-muted-foreground">Administra equipos, entrenadores y estadísticas</p>
        </div>
        <Button onClick={handleCreateTeam}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Equipo
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTeams}</div>
            <p className="text-xs text-muted-foreground">{activeTeams} activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jugadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              Promedio: {Math.round(totalPlayers / totalTeams)} por equipo
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goles Promedio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgGoalsPerTeam.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Por equipo esta temporada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Torneos Activos</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">En diferentes categorías</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Equipos</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar equipos o entrenadores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    <SelectItem value={TeamCategory.Primera}>Primera</SelectItem>
                    <SelectItem value={TeamCategory.Segunda}>Segunda</SelectItem>
                    <SelectItem value={TeamCategory.Juvenil}>Juvenil</SelectItem>
                    <SelectItem value={TeamCategory.Infantil}>Infantil</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value={TeamStatus.Active}>Activo</SelectItem>
                    <SelectItem value={TeamStatus.Inactive}>Inactivo</SelectItem>
                    <SelectItem value={TeamStatus.Suspended}>Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Teams Table */}
          <Card>
            <CardHeader>
              <CardTitle>Equipos ({filteredTeams.length})</CardTitle>
              <CardDescription>Lista completa de equipos registrados en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Equipo</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Entrenador</TableHead>
                    <TableHead>Jugadores</TableHead>
                    <TableHead>Estadísticas</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTeams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
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
                          <div>
                            <div className="font-medium">{team.name}</div>
                            <div className="text-sm text-muted-foreground">Fundado: {team.foundedYear}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{team.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{team.coach}</div>
                          <div className="text-sm text-muted-foreground">{team.coachEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          {team.playersCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>PJ: {team.wins + team.draws + team.losses}</div>
                          <div className="text-muted-foreground">
                            {team.wins}G {team.draws}E {team.losses}P
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(team.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <Filter className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditTeam(team)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteTeam(team.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Equipos por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[TeamCategory.Primera, TeamCategory.Segunda, "Juvenil", "Infantil"].map((category) => {
                    const count = teams.filter((t) => t.category === category).length
                    const percentage = (count / totalTeams) * 100
                    return (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-secondary rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">{count}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top 5 Goleadores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teams
                    .sort((a, b) => b.goalsFor - a.goalsFor)
                    .slice(0, 5)
                    .map((team, index) => (
                      <div key={team.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold w-4">#{index + 1}</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={team.logo || "/placeholder.svg"} alt={team.name} />
                            <AvatarFallback className="text-xs">
                              {team.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{team.name}</span>
                        </div>
                        <Badge variant="outline">{team.goalsFor} goles</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <TeamFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        team={selectedTeam}
        onSave={(teamData) => {
          if (selectedTeam) {
            // Editar equipo existente
            setTeams(teams.map((t) => (t.id === selectedTeam.id ? { ...t, ...teamData } : t)))
          } else {
            // Crear nuevo equipo
            const newTeam: Team = {
              id: Date.now().toString(),
              ...teamData,
              playersCount: 0,
              wins: 0,
              draws: 0,
              losses: 0,
              goalsFor: 0,
              goalsAgainst: 0,
              points: 0,
              tournaments: [],
            }
            setTeams([...teams, newTeam])
          }
          setIsDialogOpen(false)
        }}
      />
    </div>
  )
}
