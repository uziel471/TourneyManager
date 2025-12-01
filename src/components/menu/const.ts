import {
  Trophy,
  Users,
  Calendar,
  BarChart3,
  Settings,
  User,
  Home,
  Medal,
  Clock,
  MapPin,
  FileText,
  Shield,
  Bell,
} from "lucide-react"

export enum Role {
  Admin = "admin",
  Organizer = "organizer",
  Referee = "referee",
  Player = "player",
}

export const menuCategories = {
  main: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["admin", "organizer", "referee", "player"],
    },
  ],
  tournaments: [
    {
      title: "Torneos",
      href: "/admin/tournaments",
      icon: Trophy,
      roles: ["admin", "organizer", "referee", "player"],
    },
    {
      title: "Equipos",
      href: "/teams",
      icon: Users,
      roles: ["admin", "organizer", "referee", "player"],
    },
    {
      title: "Partidos",
      href: "/matches",
      icon: Calendar,
      roles: ["admin", "organizer", "referee", "player"],
    },
    {
      title: "Clasificaciones",
      href: "/standings",
      icon: Medal,
      roles: ["admin", "organizer", "referee", "player"],
    },
  ],
  management: [
    {
      title: "Horarios",
      href: "/schedule",
      icon: Clock,
      roles: ["admin", "organizer", "referee", "player"],
    },
    {
      title: "Sedes",
      href: "/venues",
      icon: MapPin,
      roles: ["admin", "organizer"],
    },
    {
      title: "Estadísticas",
      href: "/statistics",
      icon: BarChart3,
      roles: ["admin", "organizer", "referee"],
    },
    {
      title: "Reportes",
      href: "/reports",
      icon: FileText,
      roles: ["admin", "organizer", "referee"],
    },
  ],
  admin: [
    {
      title: "Gestión de Usuarios",
      href: "/admin/users",
      icon: User,
      roles: ["admin"],
    },
    {
      title: "Roles y Permisos",
      href: "/admin/roles",
      icon: Shield,
      roles: ["admin"],
    },
    {
      title: "Configuración",
      href: "/admin/settings",
      icon: Settings,
      roles: ["admin"],
    },
  ],
}

export const allMenuItems = [
  ...menuCategories.main,
  ...menuCategories.tournaments,
  ...menuCategories.management,
  ...menuCategories.admin,
  {
    title: "Notificaciones",
    href: "/notifications",
    icon: Bell,
    roles: ["admin", "organizer", "referee", "player"],
  },
]