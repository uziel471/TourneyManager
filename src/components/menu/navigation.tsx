"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Trophy,
  Settings,
  User,
  LogOut,
  Menu,
  Home,
  Target,
  Shield,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu as NavigationMenuComponent,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import { NavigationMenuProps } from "./types"
import { allMenuItems, menuCategories } from "./const"

import { cn } from "@/lib/utils"

export function NavigationMenu({
  isAuthenticated = false,
  userRole = "player",
  userName = "Usuario",
  userAvatar,
  className,
}: NavigationMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Ocultar el menú en la página de login
  if (!isAuthenticated || pathname === "/login" || pathname === "/register") {
    return null
  }

  const filterItemsByRole = (items: typeof allMenuItems) => items.filter((item) => item.roles.includes(userRole))

  const NavItems = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={cn("space-y-1", mobile && "px-4")}>
      {filterItemsByRole(allMenuItems).map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => mobile && setIsOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.title}
          </Link>
        )
      })}
    </div>
  )

  const NavigationLink = ({
    href,
    icon: Icon,
    children,
    className: linkClassName,
  }: {
    href: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
    children: React.ReactNode
    className?: string
  }) => {
    const isActive = pathname === href
    return (
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "flex items-center gap-2 select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive && "bg-primary text-primary-foreground",
            linkClassName,
          )}
        >
          <Icon className="h-4 w-4" />
          <div className="text-sm font-medium leading-none">{children}</div>
        </Link>
      </NavigationMenuLink>
    )
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="container flex h-14 items-center justify-between m-2 mr-4 w-full">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">TourneyManager</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <NavigationMenuComponent className="hidden md:flex flex-1">
            <NavigationMenuList>
              {/* Dashboard - Acceso directo */}
              <NavigationMenuItem>
                <NavigationMenuLink>
                  <Link
                    href="/dashboard"
                    className={cn(
                      "flex items-center gap-2 px-0 py-0 text-sm font-medium transition-colors hover:text-foreground/80",
                    )}
                  >
                    <Home className="h-4 w-4" color="black" />
                    Dashboard
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              {/* Torneos y Competencias */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Torneos
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {filterItemsByRole(menuCategories.tournaments).map((item) => (
                      <NavigationLink key={item.href} href={item.href} icon={item.icon}>
                        {item.title}
                      </NavigationLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Gestión y Operaciones */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Gestión
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                    {filterItemsByRole(menuCategories.management).map((item) => (
                      <NavigationLink key={item.href} href={item.href} icon={item.icon}>
                        {item.title}
                      </NavigationLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Administración - Solo para admins */}
              {userRole === "admin" && (
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Administración
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4">
                      {filterItemsByRole(menuCategories.admin).map((item) => (
                        <NavigationLink key={item.href} href={item.href} icon={item.icon}>
                          {item.title}
                        </NavigationLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenuComponent>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar || "/placeholder.svg"} alt={userName} />
                    <AvatarFallback>
                      {userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRole === "admin"
                        ? "Administrador"
                        : userRole === "organizer"
                          ? "Organizador"
                          : userRole === "referee"
                            ? "Árbitro"
                            : "Jugador"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    TourneyManager
                  </SheetTitle>
                </SheetHeader>
                <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                  <div className="flex flex-col space-y-3">
                    <NavItems mobile />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}