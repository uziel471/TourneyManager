"use client"

import { useState, useMemo } from "react"
import { Trophy, TrendingUp, TrendingDown, Minus, Award, Target, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Match {
  id: string
  tournament_id: string
  home_team_id: string
  away_team_id: string
  home_score?: number
  away_score?: number
  status: string
}

interface Tournament {
  id: string
  name: string
  format: string
}

interface Team {
  id: string
  name: string
  logo?: string
}

interface Standing {
  position: number
  teamId: string
  teamName: string
  played: number
  wins: number
  draws: number
  losses: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
  points: number
  form: string[]
  lastPosition?: number
}

export default function StandingsPage() {
  const [tournaments] = useState<Tournament[]>([
    { id: "1", name: "Copa Primavera 2024", format: "group_knockout" },
    { id: "2", name: "Liga Juvenil Verano", format: "league" },
    { id: "3", name: "Torneo Relámpago", format: "knockout" },
  ])

  const [teams] = useState<Team[]>([
    { id: "1", name: "FC Barcelona B", logo: "/placeholder.svg" },
    { id: "2", name: "Real Madrid C", logo: "/placeholder.svg" },
    { id: "3", name: "Atlético Madrid B", logo: "/placeholder.svg" },
    { id: "4", name: "Valencia CF Juvenil", logo: "/placeholder.svg" },
    { id: "5", name: "Sevilla FC Juvenil", logo: "/placeholder.svg" },
    { id: "6", name: "Betis Deportivo", logo: "/placeholder.svg" },
    { id: "7", name: "Espanyol B", logo: "/placeholder.svg" },
    { id: "8", name: "Villarreal B", logo: "/placeholder.svg" },
  ])

  const [matches] = useState<Match[]>([
    {
      id: "1",
      tournament_id: "1",
      home_team_id: "1",
      away_team_id: "2",
      home_score: 2,
      away_score: 1,
      status: "finished",
    },
    {
      id: "2",
      tournament_id: "1",
      home_team_id: "3",
      away_team_id: "1",
      home_score: 1,
      away_score: 1,
      status: "finished",
    },
    {
      id: "3",
      tournament_id: "1",
      home_team_id: "2",
      away_team_id: "3",
      home_score: 0,
      away_score: 2,
      status: "finished",
    },
    {
      id: "4",
      tournament_id: "2",
      home_team_id: "4",
      away_team_id: "5",
      home_score: 3,
      away_score: 1,
      status: "finished",
    },
    {
      id: "5",
      tournament_id: "2",
      home_team_id: "6",
      away_team_id: "7",
      home_score: 2,
      away_score: 2,
      status: "finished",
    },
    {
      id: "6",
      tournament_id: "2",
      home_team_id: "4",
      away_team_id: "6",
      home_score: 1,
      away_score: 0,
      status: "finished",
    },
    {
      id: "7",
      tournament_id: "2",
      home_team_id: "5",
      away_team_id: "7",
      home_score: 2,
      away_score: 3,
      status: "finished",
    },
    {
      id: "8",
      tournament_id: "1",
      home_team_id: "1",
      away_team_id: "8",
      home_score: 4,
      away_score: 0,
      status: "finished",
    },
    {
      id: "9",
      tournament_id: "1",
      home_team_id: "8",
      away_team_id: "2",
      home_score: 1,
      away_score: 3,
      status: "finished",
    },
  ])

  const [selectedTournament, setSelectedTournament] = useState<string>("1")

  const calculateStandings = (tournamentId: string): Standing[] => {
    const tournamentMatches = matches.filter((m) => m.tournament_id === tournamentId && m.status === "finished")

    const standingsMap = new Map<string, Standing>()

    // Inicializar equipos
    tournamentMatches.forEach((match) => {
      ;[match.home_team_id, match.away_team_id].forEach((teamId) => {
        if (!standingsMap.has(teamId)) {
          const team = teams.find((t) => t.id === teamId)
          standingsMap.set(teamId, {
            position: 0,
            teamId,
            teamName: team?.name || "Desconocido",
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
            form: [],
          })
        }
      })
    })

    // Calcular estadísticas
    tournamentMatches.forEach((match) => {
      const homeTeam = standingsMap.get(match.home_team_id)!
      const awayTeam = standingsMap.get(match.away_team_id)!

      const homeScore = match.home_score ?? 0
      const awayScore = match.away_score ?? 0

      homeTeam.played++
      awayTeam.played++

      homeTeam.goalsFor += homeScore
      homeTeam.goalsAgainst += awayScore
      awayTeam.goalsFor += awayScore
      awayTeam.goalsAgainst += homeScore

      if (homeScore > awayScore) {
        homeTeam.wins++
        homeTeam.points += 3
        homeTeam.form.push("W")
        awayTeam.losses++
        awayTeam.form.push("L")
      } else if (homeScore < awayScore) {
        awayTeam.wins++
        awayTeam.points += 3
        awayTeam.form.push("W")
        homeTeam.losses++
        homeTeam.form.push("L")
      } else {
        homeTeam.draws++
        awayTeam.draws++
        homeTeam.points++
        awayTeam.points++
        homeTeam.form.push("D")
        awayTeam.form.push("D")
      }

      homeTeam.goalDifference = homeTeam.goalsFor - homeTeam.goalsAgainst
      awayTeam.goalDifference = awayTeam.goalsFor - awayTeam.goalsAgainst

      // Mantener solo los últimos 5 resultados
      if (homeTeam.form.length > 5) homeTeam.form.shift()
      if (awayTeam.form.length > 5) awayTeam.form.shift()
    })

    // Ordenar por puntos, diferencia de goles, goles a favor
    const standings = Array.from(standingsMap.values()).sort((a, b) => {
      if (b.points !== a.points) return b.points - a.points
      if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference
      return b.goalsFor - a.goalsFor
    })

    // Asignar posiciones
    standings.forEach((standing, index) => {
      standing.position = index + 1
    })

    return standings
  }

  const standings = useMemo(() => calculateStandings(selectedTournament), [selectedTournament, matches])

  const selectedTournamentData = tournaments.find((t) => t.id === selectedTournament)

  const stats = useMemo(() => {
    if (standings.length === 0) {
      return {
        totalMatches: 0,
        totalGoals: 0,
        topScorer: null,
        bestDefense: null,
      }
    }

    const totalMatches = standings.reduce((sum, s) => sum + s.played, 0) / 2
    const totalGoals = standings.reduce((sum, s) => sum + s.goalsFor, 0)
    const topScorer = standings.reduce((prev, current) => (prev.goalsFor > current.goalsFor ? prev : current))
    const bestDefense = standings.reduce((prev, current) => (prev.goalsAgainst < current.goalsAgainst ? prev : current))

    return {
      totalMatches,
      totalGoals,
      topScorer,
      bestDefense,
    }
  }, [standings])

  const getFormBadgeColor = (result: string) => {
    switch (result) {
      case "W":
        return "bg-green-500"
      case "D":
        return "bg-yellow-500"
      case "L":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getFormLabel = (result: string) => {
    switch (result) {
      case "W":
        return "Victoria"
      case "D":
        return "Empate"
      case "L":
        return "Derrota"
      default:
        return ""
    }
  }

  const getPositionTrend = (standing: Standing) => {
    if (!standing.lastPosition) return null
    if (standing.position < standing.lastPosition) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (standing.position > standing.lastPosition) return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-gray-400" />
  }

  const getPositionBadgeColor = (position: number) => {
    if (position <= 3) return "bg-yellow-100 text-yellow-800 border-yellow-300"
    if (position <= 6) return "bg-blue-100 text-blue-800 border-blue-300"
    return "bg-gray-100 text-gray-800 border-gray-300"
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clasificaciones</h1>
          <p className="text-muted-foreground">Consulta las tablas de posiciones de todos los torneos</p>
        </div>
        <Trophy className="h-12 w-12 text-yellow-500" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partidos Jugados</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMatches}</div>
            <p className="text-xs text-muted-foreground">En este torneo</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goles Totales</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              Promedio: {(stats.totalGoals / Math.max(stats.totalMatches, 1)).toFixed(1)} por partido
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Ataque</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.topScorer?.goalsFor || 0}</div>
            <p className="text-xs text-muted-foreground">{stats.topScorer?.teamName || "-"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejor Defensa</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bestDefense?.goalsAgainst || 0}</div>
            <p className="text-xs text-muted-foreground">{stats.bestDefense?.teamName || "-"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tournament Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Torneo</CardTitle>
          <CardDescription>Elige el torneo para ver su tabla de clasificación</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedTournament} onValueChange={setSelectedTournament}>
            <SelectTrigger className="w-full md:w-[300px]">
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
        </CardContent>
      </Card>

      {/* Standings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {selectedTournamentData?.name}
          </CardTitle>
          <CardDescription>Clasificación actualizada basada en resultados de partidos finalizados</CardDescription>
        </CardHeader>
        <CardContent>
          {standings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No hay datos disponibles</p>
              <p className="text-sm text-muted-foreground">
                Los resultados aparecerán cuando se completen los partidos
              </p>
            </div>
          ) : (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="table">Tabla General</TabsTrigger>
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              </TabsList>
              <TabsContent value="table" className="space-y-4">
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16 text-center">Pos</TableHead>
                        <TableHead>Equipo</TableHead>
                        <TableHead className="text-center">PJ</TableHead>
                        <TableHead className="text-center">G</TableHead>
                        <TableHead className="text-center">E</TableHead>
                        <TableHead className="text-center">P</TableHead>
                        <TableHead className="text-center">GF</TableHead>
                        <TableHead className="text-center">GC</TableHead>
                        <TableHead className="text-center">DG</TableHead>
                        <TableHead className="text-center">Pts</TableHead>
                        <TableHead className="text-center">Forma</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standings.map((standing) => (
                        <TableRow key={standing.teamId} className="hover:bg-muted/50">
                          <TableCell className="text-center">
                            <Badge variant="outline" className={getPositionBadgeColor(standing.position)}>
                              {standing.position}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{standing.teamName}</TableCell>
                          <TableCell className="text-center">{standing.played}</TableCell>
                          <TableCell className="text-center text-green-600 font-medium">{standing.wins}</TableCell>
                          <TableCell className="text-center text-yellow-600 font-medium">{standing.draws}</TableCell>
                          <TableCell className="text-center text-red-600 font-medium">{standing.losses}</TableCell>
                          <TableCell className="text-center">{standing.goalsFor}</TableCell>
                          <TableCell className="text-center">{standing.goalsAgainst}</TableCell>
                          <TableCell className="text-center font-medium">
                            {standing.goalDifference > 0 && "+"}
                            {standing.goalDifference}
                          </TableCell>
                          <TableCell className="text-center font-bold text-lg">{standing.points}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 justify-center">
                              {standing.form.map((result, idx) => (
                                <div
                                  key={idx}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${getFormBadgeColor(result)}`}
                                  title={getFormLabel(result)}
                                >
                                  {result}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">PJ:</span> Partidos Jugados
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">G:</span> Ganados
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">E:</span> Empatados
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">P:</span> Perdidos
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">GF:</span> Goles a Favor
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">GC:</span> Goles en Contra
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">DG:</span> Diferencia de Goles
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Pts:</span> Puntos
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Top Scorers */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Mejores Ataques
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {standings
                          .slice()
                          .sort((a, b) => b.goalsFor - a.goalsFor)
                          .slice(0, 5)
                          .map((standing, idx) => (
                            <div
                              key={standing.teamId}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground w-6">{idx + 1}.</span>
                                <span className="font-medium">{standing.teamName}</span>
                              </div>
                              <Badge variant="secondary">{standing.goalsFor} goles</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Defenses */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Mejores Defensas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {standings
                          .slice()
                          .sort((a, b) => a.goalsAgainst - b.goalsAgainst)
                          .slice(0, 5)
                          .map((standing, idx) => (
                            <div
                              key={standing.teamId}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground w-6">{idx + 1}.</span>
                                <span className="font-medium">{standing.teamName}</span>
                              </div>
                              <Badge variant="secondary">{standing.goalsAgainst} goles</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Most Wins */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        Más Victorias
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {standings
                          .slice()
                          .sort((a, b) => b.wins - a.wins)
                          .slice(0, 5)
                          .map((standing, idx) => (
                            <div
                              key={standing.teamId}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground w-6">{idx + 1}.</span>
                                <span className="font-medium">{standing.teamName}</span>
                              </div>
                              <Badge variant="secondary">{standing.wins} victorias</Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Best Goal Difference */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Trophy className="h-4 w-4" />
                        Mejor Diferencia
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {standings
                          .slice()
                          .sort((a, b) => b.goalDifference - a.goalDifference)
                          .slice(0, 5)
                          .map((standing, idx) => (
                            <div
                              key={standing.teamId}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-muted"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground w-6">{idx + 1}.</span>
                                <span className="font-medium">{standing.teamName}</span>
                              </div>
                              <Badge variant="secondary">
                                {standing.goalDifference > 0 && "+"}
                                {standing.goalDifference}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
