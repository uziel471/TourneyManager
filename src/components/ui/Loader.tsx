import { Loader2 } from 'lucide-react'

function Loader({ message }: { message?: string }) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">{message || "Cargando..."}</span>
      </div>
    </div>
  )
}

export default Loader