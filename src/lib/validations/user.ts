import * as yup from 'yup'

export const userSchema = yup.object().shape({
  name: yup.string().required('El nombre es requerido').min(2, 'El nombre debe tener al menos 2 caracteres'),
  email: yup.string().email('Email inválido').required('El email es requerido'),
  phone: yup.string().matches(/^(\+\d{1,3}[- ]?)?\d{9,}$/, 'Teléfono inválido').optional().default(''),
  role: yup.string().oneOf(['admin', 'organizer', 'player', 'referee'] as const, 'Rol inválido').required('El rol es requerido'),
  team: yup.string().optional().default(''),
  sendWelcomeEmail: yup.boolean().optional().default(true)
})

export type UserFormData = yup.InferType<typeof userSchema>
