import { Playfair_Display } from 'next/font/google'
import Link from 'next/link'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] })

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col">

      {/* Above the fold */}
      <section className="min-h-screen flex flex-col px-6 py-8 max-w-2xl mx-auto w-full">

        {/* Wordmark */}
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
          </svg>
          <span className="text-[#C9A84C] font-semibold tracking-tight">PropertySnap</span>
        </div>

        {/* Hero — vertically centred in the remaining space */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <h1 className={`${playfair.className} text-4xl sm:text-5xl font-bold leading-tight mb-5 max-w-lg`}>
            Professional property descriptions{' '}
            <span className="text-[#C9A84C]">in seconds</span>
          </h1>

          <p className="text-gray-400 text-lg mb-10 max-w-sm leading-relaxed">
            Upload a photo. AI writes the copy. Paste into your listing.
          </p>

          <Link
            href="/app"
            className="inline-block px-8 py-4 bg-[#C9A84C] text-[#1c1c1c] font-semibold rounded-2xl text-base shadow-lg hover:bg-[#d9b85c] active:scale-[0.98] transition-all"
          >
            Try it free →
          </Link>
        </div>

        {/* Scroll nudge */}
        <div className="flex justify-center pb-2 opacity-30">
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-16 max-w-2xl mx-auto w-full">
        <h2 className={`${playfair.className} text-2xl font-bold text-center mb-12`}>
          How it works
        </h2>

        <div className="flex flex-col sm:flex-row gap-10 sm:gap-6">
          {[
            { emoji: '📸', title: 'Snap or upload', body: 'Take a photo of any room or exterior — or upload from your camera roll.' },
            { emoji: '✨', title: 'AI describes it', body: 'Professional estate agent copy generated in seconds. Choose Standard, Luxury or Concise.' },
            { emoji: '📋', title: 'Copy and paste', body: 'Edit if needed, then copy straight to Rightmove, Zoopla or your CMS.' },
          ].map(({ emoji, title, body }) => (
            <div key={title} className="flex-1 flex flex-col items-center text-center sm:items-start sm:text-left">
              <span className="text-3xl mb-4">{emoji}</span>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social proof */}
      <section className="px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            Already used by estate agents in Bournemouth
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <a href="https://gladetech.uk" target="_blank" rel="noopener noreferrer" className="hover:text-gray-400 transition-colors">
            Built by Glade Tech
          </a>
          <a href="https://vaughanai.co" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A84C] transition-colors text-center">
            Looking for an AI chatbot for your agency? → vaughanai.co
          </a>
        </div>
      </footer>

    </div>
  )
}
