export function formatDate(date: string): string {
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
}
