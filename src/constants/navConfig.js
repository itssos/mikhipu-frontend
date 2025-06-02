// src/constants/navConfig.js
import {
  HomeIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  Cog6ToothIcon,
  UsersIcon,
  DocumentCurrencyDollarIcon,
  AcademicCapIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline'
import { ROUTES } from './routes'

/**
 * Cada objeto define:
 * - name: etiqueta a mostrar
 * - path: ruta (o action para botones)
 * - Icon: componente HeroIcon
 * - roles: array de roles que pueden verlo
 *   usa 'GUEST' para no autenticados
 */
export const NAV_CONFIG = [
  {
    name: 'Dashboard',
    path: ROUTES.DASHBOARD,
    Icon: HomeIcon,
    roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO'],
  },
  // {
  //   name: 'Mensajes',
  //   path: '/messages',
  //   Icon: ChatBubbleLeftIcon,
  //   roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE'],
  // },
  // {
  //   name: 'Perfil',
  //   path: '/profile',
  //   Icon: UserIcon,
  //   roles: ['ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE', 'APODERADO'],
  // },
  // {
  //   name: 'Admin',
  //   path: ROUTES.ADMIN,
  //   Icon: Cog6ToothIcon,
  //   roles: ['ADMINISTRADOR'],
  // },
  {
    name: 'Usuarios',
    path: ROUTES.ROLE_MANAGEMENT,
    Icon: UsersIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    name: 'Matriculas',
    path: ROUTES.STUDENT_ENROLLMENT,
    Icon: DocumentCurrencyDollarIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    name: 'Docente',
    path: ROUTES.TEACHER,
    Icon: AcademicCapIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    name: 'Cursos',
    path: ROUTES.COURSE,
    Icon: BookOpenIcon,
    roles: ['ADMINISTRADOR'],
  },
  {
    name: 'Asistencias',
    path: ROUTES.ASSISTANCE,
    Icon: BookOpenIcon,
    roles: ['ADMINISTRADOR'],
  }
]
