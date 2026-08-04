export function getUser() {
  try {
    return JSON.parse(localStorage.getItem('wiki_user') || 'null')
  } catch {
    return null
  }
}

export function getRole() {
  return getUser()?.role ?? null
}

export function isAdmin() {
  return getRole() === 'administrador'
}

export function isGestor() {
  return getRole() === 'gestor'
}

export function isColaborador() {
  return getRole() === 'colaborador'
}

export function canManageUsers() {
  return isAdmin()
}

export function canExclude() {
  return !isColaborador()
}

export function roleLabel(role) {
  if (!role) return 'Colaborador'
  const labels = {
    administrador: 'Administrador',
    gestor: 'Gestor',
    colaborador: 'Colaborador',
  }
  return labels[role] ?? 'Colaborador'
}

export function roleStyle(role) {
  if (role === 'administrador')
    return 'bg-primary-container text-on-primary-container'
  if (role === 'gestor') return 'bg-secondary-container text-on-secondary-container'
  return 'bg-surface-variant text-on-surface-variant'
}

export function isActiveLabel(isActive) {
  return isActive ? 'Ativo' : 'Bloqueado'
}

export function isActiveStyle(isActive) {
  return isActive
    ? 'bg-secondary-container/40 text-on-secondary-container'
    : 'bg-error-container/40 text-on-error-container'
}