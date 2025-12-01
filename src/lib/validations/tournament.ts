import * as yup from "yup"

export const tournamentSchema = yup.object().shape({
  name: yup.string().required("El nombre es obligatorio").min(3, "El nombre debe tener al menos 3 caracteres"),
  description: yup.string().default(""),
  startDate: yup.string().required("La fecha de inicio es obligatoria"),
  endDate: yup.string().required("La fecha de finalización es obligatoria"),
  location: yup.string().required("La ubicación es obligatoria"),
  category: yup
    .string()
    .oneOf(["Primera", "Segunda", "Juvenil", "Infantil"] as const)
    .required("La categoría es obligatoria"),
  maxTeams: yup
    .number()
    .min(2, "Mínimo 2 equipos")
    .max(64, "Máximo 64 equipos")
    .required("El número máximo de equipos es obligatorio"),
  format: yup
    .string()
    .oneOf(["league", "knockout", "group_knockout"] as const)
    .required("El formato es obligatorio"),
  status: yup
    .string()
    .oneOf(["planned", "registration", "in_progress", "finished", "cancelled"] as const)
    .default("planned"),
  registrationDeadline: yup.string().default(""),
  entryFee: yup.number().min(0, "La cuota debe ser 0 o mayor").default(0),
  prizePool: yup.number().min(0, "El premio debe ser 0 o mayor").default(0),
  rules: yup.string().default(""),
}) as yup.ObjectSchema<{
  name: string
  description: string
  startDate: string
  endDate: string
  location: string
  category: "Primera" | "Segunda" | "Juvenil" | "Infantil"
  maxTeams: number
  format: "league" | "knockout" | "group_knockout"
  status: "planned" | "registration" | "in_progress" | "finished" | "cancelled"
  registrationDeadline: string
  entryFee: number
  prizePool: number
  rules: string
}>

export type TournamentFormData = yup.InferType<typeof tournamentSchema>
