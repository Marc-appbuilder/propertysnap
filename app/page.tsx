import Link from 'next/link'

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 bg-white">
      <div className="max-w-sm w-full text-center">

        {/* Logo mark */}
        <div className="w-16 h-16 rounded-2xl bg-[#C9A84C] flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
          </svg>
        </div>

        {/* Wordmark */}
        <h1 className="text-3xl font-semibold tracking-tight text-[#1c1c1c] mb-3">
          PropertySnap
        </h1>

        {/* Tagline */}
        <p className="text-lg text-gray-500 mb-2 leading-snug">
          Professional property descriptions in seconds.
        </p>
        <p className="text-sm text-gray-400 mb-10 leading-relaxed">
          Snap a photo of any room or exterior. AI writes the listing copy instantly — ready to edit and copy straight to your clipboard.
        </p>

        {/* CTA */}
        <Link
          href="/app"
          className="block w-full py-4 bg-[#C9A84C] text-white rounded-2xl font-semibold text-base shadow-md hover:bg-[#b8943d] active:scale-[0.98] transition-all"
        >
          Get Started
        </Link>

        {/* Supporting detail */}
        <p className="mt-5 text-xs text-gray-300">
          No account needed · Works on mobile · Instant results
        </p>
      </div>
    </main>
  )
}
