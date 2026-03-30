/** WAHA session name per office (stable, URL-safe). */
export function instanceNameForOffice(officeId: string): string {
  return `office_${officeId}`;
}
