import { NavigationMenu } from "@/components/menu/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trophy } from "lucide-react"

export default function LoginPage() {
  const isAuthenticated = false

  // TODO: move menu to layout and use hook to check authentication :)
  // TODO: add useForm hook to validate form and handle submit
  // TODO: change ui
  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu isAuthenticated={isAuthenticated} />

      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-semibold tracking-tight">TourneyManager</h1>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">Iniciar Sesión</h2>
            <p className="text-sm text-muted-foreground">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Acceso al Sistema</CardTitle>
              <CardDescription>Ingresa tu email y contraseña</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="tu@email.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input id="password" type="password" autoComplete="current-password" />
              </div>
              <Button className="w-full">Iniciar Sesión</Button>
              <div className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Button variant="link" className="p-0 h-auto">
                  Registrarse
                </Button>
              </div>
            </CardContent>
          </Card>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad.
          </p>
        </div>
      </div>
    </div>
  )
}
