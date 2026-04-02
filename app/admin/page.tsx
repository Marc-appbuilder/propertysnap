import crypto from 'crypto'
import { cookies } from 'next/headers'
import { supabase } from '@/lib/supabase'
import { login, logout, toggleStatus, regenerateToken, addClient, deleteClient } from './actions'

const ALL_TOOLS = ['propertysnap', 'vaughanai']

function adminHash() {
  return crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || '').digest('hex')
}

async function isAuthenticated() {
  const store = await cookies()
  return store.get('admin_session')?.value === adminHash()
}

export default async function AdminPage() {
  if (!(await isAuthenticated())) {
    return <LoginScreen />
  }

  const { data: clients, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  return <AdminPanel clients={clients || []} error={error?.message} />
}

/* ── Login ── */

function LoginScreen() {
  return (
    <main className="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <span className="text-[#C9A84C] font-semibold text-lg">PropertySnap Admin</span>
        </div>
        <form action={login} className="flex flex-col gap-3">
          <input
            name="password"
            type="password"
            placeholder="Admin password"
            autoFocus
            required
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 outline-none focus:border-[#C9A84C]/50 transition-colors"
          />
          <button
            type="submit"
            className="w-full py-3 bg-[#C9A84C] text-[#1c1c1c] font-semibold rounded-xl hover:bg-[#d9b85c] transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}

/* ── Admin Panel ── */

type Client = {
  id: string
  name: string
  email: string
  token: string
  status: string
  tools: string[]
  created_at?: string
}

function AdminPanel({ clients, error }: { clients: Client[]; error?: string }) {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <span className="font-semibold text-[#1c1c1c]">PropertySnap Admin</span>
        <form action={logout}>
          <button type="submit" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            Sign out
          </button>
        </form>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-10">
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            Supabase error: {error}
          </div>
        )}

        {/* Clients table */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Clients ({clients.length})
          </h2>

          {clients.length === 0 ? (
            <p className="text-gray-400 text-sm">No clients yet.</p>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-left">
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Token</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Tools</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client, i) => {
                      const toggleAction = toggleStatus.bind(null, client.id, client.status)
                      const regenAction = regenerateToken.bind(null, client.id)
                      const deleteAction = deleteClient.bind(null, client.id)

                      return (
                        <tr key={client.id} className={i !== clients.length - 1 ? 'border-b border-gray-50' : ''}>
                          <td className="px-5 py-4 font-medium text-[#1c1c1c]">{client.name}</td>
                          <td className="px-5 py-4 text-gray-500">{client.email}</td>
                          <td className="px-5 py-4">
                            <code className="text-xs bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg text-gray-600 break-all">
                              {client.token}
                            </code>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(client.tools || []).map(tool => (
                                <span key={tool} className="text-xs px-2 py-0.5 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full font-medium">
                                  {tool}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <form action={toggleAction}>
                              <button
                                type="submit"
                                className={`text-xs px-3 py-1 rounded-full font-semibold transition-colors ${
                                  client.status === 'active'
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                              >
                                {client.status}
                              </button>
                            </form>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <form action={regenAction}>
                                <button type="submit" className="text-xs text-blue-500 hover:text-blue-700 transition-colors whitespace-nowrap">
                                  New token
                                </button>
                              </form>
                              <form action={deleteAction} onSubmit={undefined}>
                                <button
                                  type="submit"
                                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                              </form>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Add client form */}
        <section>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
            Add client
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <form action={addClient} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="Acme Estate Agents"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1c1c1c] outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="agent@acme.co.uk"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1c1c1c] outline-none focus:border-[#C9A84C] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Token (leave blank to auto-generate)</label>
                <input
                  name="token"
                  type="text"
                  placeholder="Auto-generated if empty"
                  className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-[#1c1c1c] outline-none focus:border-[#C9A84C] transition-colors font-mono"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">Tools</label>
                <div className="flex gap-4 items-center pt-1">
                  {ALL_TOOLS.map(tool => (
                    <label key={tool} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        name="tools"
                        value={tool}
                        defaultChecked={tool === 'propertysnap'}
                        className="accent-[#C9A84C] w-4 h-4"
                      />
                      {tool}
                    </label>
                  ))}
                </div>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C9A84C] text-[#1c1c1c] font-semibold rounded-xl text-sm hover:bg-[#d9b85c] transition-colors"
                >
                  Add client
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}
