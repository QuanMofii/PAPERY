'use server'

import { cookies } from 'next/headers'

export async function getTheme() {
  const cookieStore = await cookies()

  return cookieStore.get('theme')?.value || 'orange'
}
