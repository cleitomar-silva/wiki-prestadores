export function formatCnpj(value) {
  if (!value) return ''
  const digits = value.replace(/\D/g, '')
  if (digits.length !== 14) return value
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

export function maskCnpj(value) {
  const digits = value.replace(/\D/g, '').slice(0, 14)
  if (digits.length <= 2) return digits
  if (digits.length <= 5) return digits.replace(/^(\d{2})(\d+)/, '$1.$2')
  if (digits.length <= 8)
    return digits.replace(/^(\d{2})(\d{3})(\d+)/, '$1.$2.$3')
  if (digits.length <= 12)
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d+)/, '$1.$2.$3/$4')
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d+)/,
    '$1.$2.$3/$4-$5'
  )
}

export function isValidCnpj(value) {
  const digits = (value ?? '').replace(/\D/g, '')
  return digits.length === 14
}
