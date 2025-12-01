import * as yup from "yup"

export const matchSchema = yup.object().shape({
  tournamentId: yup.string().required("El torneo es requerido"),
  homeTeamId: yup.string().required("El equipo local es requerido"),
  awayTeamId: yup
    .string()
    .required("El equipo visitante es requerido")
    .test("different-teams", "Los equipos deben ser diferentes", function (value) {
      return value !== this.parent.homeTeamId
    }),
  matchDate: yup.string().required("La fecha del partido es requerida"),
  matchTime: yup
    .string()
    .required("La hora del partido es requerida")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Formato de hora inválido (HH:MM)"),
  venue: yup.string().required("El lugar es requerido"),
  round: yup.string().optional().default(""),
  homeScore: yup.number().optional().min(0, "El marcador no puede ser negativo").nullable().default(null),
  awayScore: yup.number().optional().min(0, "El marcador no puede ser negativo").nullable().default(null),
  status: yup
    .string()
    .oneOf(["scheduled", "in_progress", "finished", "postponed", "cancelled"] as const)
    .required("El estado es requerido")
    .default("scheduled"),
  refereeId: yup.string().optional().default(""),
  notes: yup.string().optional().default(""),
})

export type MatchFormData = yup.InferType<typeof matchSchema>
