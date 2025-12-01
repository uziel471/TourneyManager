import * as yup from 'yup'

export const teamSchema = yup.object().shape({
  name: yup.string().required('El nombre del equipo es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  logo: yup.string().url('URL de logo inválida').optional().default(''),
  category: yup.string().oneOf(['Primera', 'Segunda', 'Juvenil', 'Infantil'] as const, 'Categoría inválida').required('La categoría es requerida'),
  coach: yup.string().required('El nombre del entrenador es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  coachPhone: yup.string().required('El teléfono es requerido').matches(/^(\+\d{1,3}[- ]?)?\d{9,}$/, 'Teléfono inválido'),
  coachEmail: yup.string().email('Email inválido').required('El email del entrenador es requerido'),
  foundedYear: yup.number().required('El año de fundación es requerido').min(1800, 'Año inválido').max(new Date().getFullYear(), 'Año inválido'),
  homeVenue: yup.string().required('La sede local es requerida').min(2, 'La sede debe tener al menos 2 caracteres'),
  status: yup.string().oneOf(['active', 'inactive', 'suspended'] as const, 'Estado inválido').required('El estado es requerido')
})

export type TeamFormData = yup.InferType<typeof teamSchema>
