'use server'

import crypto from 'crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function adminHash() {
  return crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || '').digest('hex')
}

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD) {
    const store = await cookies()
    store.set('admin_session', adminHash(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 8, // 8 hours
    })
  }
  redirect('/admin')
}

export async function logout() {
  const store = await cookies()
  store.delete('admin_session')
  redirect('/admin')
}

export async function toggleStatus(id: string, currentStatus: string) {
  await supabase
    .from('clients')
    .update({ status: currentStatus === 'active' ? 'inactive' : 'active' })
    .eq('id', id)
  redirect('/admin')
}

export async function regenerateToken(id: string) {
  const token = crypto.randomBytes(20).toString('hex')
  await supabase.from('clients').update({ token }).eq('id', id)
  redirect('/admin')
}

export async function addClient(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const token = formData.get('token') as string || crypto.randomBytes(20).toString('hex')
  const tools = formData.getAll('tools') as string[]

  await supabase.from('clients').insert({ name, email, token, tools, status: 'active' })
  redirect('/admin')
}

export async function deleteClient(id: string) {
  await supabase.from('clients').delete().eq('id', id)
  redirect('/admin')
}
