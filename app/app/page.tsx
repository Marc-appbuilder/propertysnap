import { supabase } from '@/lib/supabase'
import PropertySnapApp from './PropertySnapApp'

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  if (!token) {
    return <AccessDenied />
  }

  const { data, error } = await supabase
    .from('clients')
    .select('id, token, status, tools')
    .eq('token', token)
    .eq('status', 'active')
    .filter('tools', 'cs', '{"propertysnap"}')

  console.log('[PropertySnap auth] token:', token)
  console.log('[PropertySnap auth] data:', JSON.stringify(data))
  console.log('[PropertySnap auth] error:', JSON.stringify(error))

  if (!data || data.length === 0) {
    return <AccessDenied />
  }

  return <PropertySnapApp />
}

function AccessDenied() {
  return (
    <main className="min-h-screen bg-[#1c1c1c] flex flex-col items-center justify-center px-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mb-6">
        <svg className="w-6 h-6 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-6V7m0 0a5 5 0 100 10A5 5 0 0012 7z" />
        </svg>
      </div>
      <h1 className="text-white text-lg font-semibold mb-2">Access denied</h1>
      <p className="text-gray-500 text-sm mb-8">
        Contact VaughanAI to get access.
      </p>
      <a
        href="https://vaughanai.co"
        className="px-6 py-3 bg-[#C9A84C] text-[#1c1c1c] font-semibold rounded-xl text-sm hover:bg-[#d9b85c] transition-colors"
      >
        Visit vaughanai.co →
      </a>
    </main>
  )
}
