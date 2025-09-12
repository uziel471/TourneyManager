export interface NavigationMenuProps {
  isAuthenticated?: boolean
  userRole?: "admin" | "organizer" | "referee" | "player"
  userName?: string
  userAvatar?: string
  className?: string
}