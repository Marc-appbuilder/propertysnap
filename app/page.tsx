import { Playfair_Display } from 'next/font/google'
import Link from 'next/link'
import FadeIn from './components/FadeIn'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] })

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#1c1c1c] text-white flex flex-col">

      {/* ── Above the fold ── */}
      <section className="min-h-screen flex flex-col items-center px-6 py-10 max-w-2xl mx-auto w-full">

        {/* Wordmark — centred, prominent */}
        <div className="flex flex-col items-center gap-3 mb-auto">
          <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
            <HouseIcon />
          </div>
          <span className={`${playfair.className} text-2xl text-[#C9A84C] tracking-wide`}>
            PropertySnap
          </span>
        </div>

        {/* Hero */}
        <div className="flex flex-col items-center text-center py-16 flex-1 justify-center">
          <h1 className={`${playfair.className} text-4xl sm:text-5xl font-bold leading-tight mb-6 max-w-lg`}>
            Photo to property description{' '}
            <em className="text-[#C9A84C] not-italic">in seconds</em>
          </h1>

          <p className="text-gray-400 text-lg mb-12 max-w-xs leading-relaxed">
            Upload a photo. AI writes the copy. Paste into your listing.
          </p>

          <Link
            href="/app?token=demo-token"
            className="inline-block px-8 py-4 bg-[#C9A84C] text-[#1c1c1c] font-semibold rounded-2xl text-base shadow-lg hover:bg-[#d9b85c] active:scale-[0.98] transition-all"
          >
            Try it free →
          </Link>
        </div>

        {/* Scroll nudge */}
        <div className="flex justify-center mt-auto opacity-20">
          <svg className="w-5 h-5 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-2xl mx-auto w-full px-6">
        <div className="border-t border-white/8" />
      </div>

      {/* ── How it works ── */}
      <section className="px-6 py-20 max-w-2xl mx-auto w-full">
        <FadeIn className="text-center mb-16">
          <h2 className={`${playfair.className} text-3xl font-bold`}>How it works</h2>
        </FadeIn>

        <div className="flex flex-col sm:flex-row gap-14 sm:gap-8">

          <FadeIn delay={0} className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-6">
              <SnapIcon />
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Snap or upload</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Take a photo of any room or exterior — or upload from your camera roll.
            </p>
          </FadeIn>

          <FadeIn delay={150} className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-6">
              <QuillIcon />
            </div>
            <h3 className="text-white font-semibold text-base mb-2">AI describes it</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Professional estate agent copy generated in seconds. Choose Standard, Luxury or Concise.
            </p>
          </FadeIn>

          <FadeIn delay={300} className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="mb-6">
              <PasteIcon />
            </div>
            <h3 className="text-white font-semibold text-base mb-2">Copy and paste</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Edit if needed, then copy straight to Rightmove, Zoopla or your CMS.
            </p>
          </FadeIn>

        </div>
      </section>

      {/* ── Social proof ── */}
      <FadeIn>
        <div className="max-w-2xl mx-auto w-full px-6">
          <div className="border-t border-white/8 pt-10 pb-10 text-center">
            <p className="text-gray-600 text-sm tracking-wide">
              Already used by estate agents in Bournemouth
            </p>
          </div>
        </div>
      </FadeIn>

      {/* ── Footer ── */}
      <footer className="mt-auto px-6 py-8 max-w-2xl mx-auto w-full">
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
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

/* ── Icons ── */

function HouseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 56 56" fill="none" stroke="#C9A84C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 26 L28 8 L50 26" />
      <path d="M12 22 L12 46 Q12 48 14 48 L22 48 L22 36 Q22 34 24 34 L32 34 Q34 34 34 36 L34 48 L42 48 Q44 48 44 46 L44 22" />
      <path d="M20 14 L20 10 L26 10 L26 18" />
    </svg>
  )
}

function SnapIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" fill="none" stroke="#C9A84C" strokeLinecap="round" strokeLinejoin="round">
      {/* Camera body */}
      <path strokeWidth="1.4" d="M8 24 C7.5 19 11 17 15 17 L20 17 L23 11 L41 11 L44 17 L49 17 C53 17 56.5 19 56 24 L56 46 C56.5 51 53 53 49 53 L15 53 C11 53 7.5 51 8 46 Z" />
      {/* Lens outer */}
      <circle strokeWidth="1.4" cx="32" cy="34" r="11" />
      {/* Lens inner */}
      <circle strokeWidth="1" cx="32" cy="34" r="6" />
      {/* Lens highlight — hand-drawn arc */}
      <path strokeWidth="1" d="M27 30 Q30 27.5 33.5 29.5" />
      {/* Viewfinder */}
      <rect strokeWidth="1.2" x="14" y="20" width="6" height="4" rx="1.5" />
      {/* Flash dot */}
      <circle strokeWidth="1" cx="48" cy="22" r="1.5" />
      {/* Corner brackets for a viewfinder feel */}
      <path strokeWidth="1" d="M20 8 L16 8 L16 12" />
      <path strokeWidth="1" d="M44 8 L48 8 L48 12" />
    </svg>
  )
}

function QuillIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" fill="none" stroke="#C9A84C" strokeLinecap="round" strokeLinejoin="round">
      {/* Quill feather shaft */}
      <path strokeWidth="1.4" d="M52 8 C52 8 28 18 18 44" />
      {/* Feather vanes — right side */}
      <path strokeWidth="1" d="M52 8 C46 14 40 18 34 26 C38 20 44 16 52 8" />
      <path strokeWidth="1" d="M46 14 C42 18 36 24 30 32" />
      <path strokeWidth="1" d="M40 20 C36 24 32 30 26 38" />
      {/* Feather vanes — left side */}
      <path strokeWidth="1" d="M52 8 C48 16 42 22 34 30" />
      <path strokeWidth="1" d="M44 16 C40 22 36 28 28 36" />
      {/* Nib */}
      <path strokeWidth="1.4" d="M18 44 L14 54 L22 48 Z" />
      <path strokeWidth="1" d="M18 44 L18 50" />
      {/* Writing lines emanating from nib */}
      <path strokeWidth="1" d="M10 56 L28 56" />
      <path strokeWidth="1" d="M10 60 L22 60" />
      {/* Sparkle dots */}
      <circle strokeWidth="1" cx="44" cy="10" r="1.2" />
      <circle strokeWidth="1" cx="54" cy="16" r="0.8" />
      <circle strokeWidth="1" cx="48" cy="6" r="0.8" />
    </svg>
  )
}

function PasteIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 64 64" fill="none" stroke="#C9A84C" strokeLinecap="round" strokeLinejoin="round">
      {/* Back document */}
      <rect strokeWidth="1.2" x="20" y="10" width="32" height="40" rx="3" />
      <path strokeWidth="1" d="M26 10 L26 7 Q26 5 28 5 L44 5 Q46 5 46 7 L46 10" />
      {/* Front document */}
      <rect strokeWidth="1.4" x="10" y="18" width="32" height="40" rx="3" fill="#1c1c1c" />
      {/* Text lines on front doc */}
      <path strokeWidth="1.2" d="M17 28 L36 28" />
      <path strokeWidth="1.2" d="M17 34 L36 34" />
      <path strokeWidth="1.2" d="M17 40 L30 40" />
      {/* Checkmark — 'copied!' feel */}
      <path strokeWidth="1.6" d="M17 50 L21 54 L35 46" />
    </svg>
  )
}
