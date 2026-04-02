'use client'

import { useState, useRef } from 'react'

type Tone = 'Standard' | 'Luxury' | 'Concise'
type Screen = 'home' | 'preview' | 'result'
type ImageItem = { src: string; mediaType: string }

const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: 'Standard', label: 'Standard', hint: 'Warm & informative' },
  { value: 'Luxury',   label: 'Luxury',   hint: 'Aspirational & elevated' },
  { value: 'Concise',  label: 'Concise',  hint: 'Punchy & factual' },
]

const MAX_IMAGES = 5
const MAX_DIM = 1200
const JPEG_QUALITY = 0.82

async function resizeFile(file: File): Promise<ImageItem> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, MAX_DIM / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      canvas.getContext('2d')!.drawImage(img, 0, 0, w, h)
      resolve({ src: canvas.toDataURL('image/jpeg', JPEG_QUALITY), mediaType: 'image/jpeg' })
    }
    img.src = url
  })
}

export default function PropertySnapApp() {
  const [screen, setScreen]           = useState<Screen>('home')
  const [images, setImages]           = useState<ImageItem[]>([])
  const [tone, setTone]               = useState<Tone>('Standard')
  const [description, setDescription] = useState('')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [copied, setCopied]           = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    e.target.value = ''
    const resized = await Promise.all(files.slice(0, MAX_IMAGES - images.length).map(resizeFile))
    setImages(prev => [...prev, ...resized])
    setScreen('preview')
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0) setScreen('home')
      return next
    })
  }

  const handleAnalyse = async () => {
    if (!images.length) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: images.map(img => ({ image: img.src.split(',')[1], mediaType: img.mediaType })),
          tone,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || `Request failed (${res.status})`)
      }
      const data = await res.json()
      setDescription(data.description)
      setScreen('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(description)
      } else {
        const ta = document.createElement('textarea')
        ta.value = description
        ta.style.cssText = 'position:fixed;left:-9999px;top:-9999px'
        document.body.appendChild(ta)
        ta.focus(); ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* silent */ }
  }

  const reset = () => {
    setImages([]); setDescription(''); setError(''); setCopied(false)
    setTone('Standard'); setScreen('home')
  }

  return (
    <main className="min-h-screen bg-[#1c1c1c] flex flex-col max-w-md mx-auto px-5 py-10">

      {/* Wordmark */}
      <header className="flex flex-col items-center gap-2 mb-10">
        <div className="w-12 h-12 rounded-xl bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center">
          <HouseIcon />
        </div>
        <span className="font-playfair text-xl text-[#C9A84C] tracking-wide">PropertySnap</span>
        <p className="text-gray-600 text-xs">Professional property descriptions in seconds</p>
      </header>

      {/* ── Home screen ── */}
      {screen === 'home' && (
        <div className="flex flex-col flex-1">
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Select tone</p>
          <div className="grid grid-cols-3 gap-2 mb-8">
            {TONES.map(({ value, label, hint }) => (
              <button
                key={value}
                onClick={() => setTone(value)}
                className={`flex flex-col items-center py-3.5 px-2 rounded-2xl border-2 transition-all ${
                  tone === value
                    ? 'border-[#C9A84C] bg-[#C9A84C]/10'
                    : 'border-white/8 bg-white/4 hover:border-white/15'
                }`}
              >
                <span className={`text-sm font-semibold ${tone === value ? 'text-[#C9A84C]' : 'text-gray-300'}`}>
                  {label}
                </span>
                <span className="text-[10px] text-gray-600 mt-0.5 text-center leading-tight">{hint}</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-4 py-14 rounded-3xl border-2 border-dashed border-[#C9A84C]/30 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 transition-colors active:scale-[0.98]"
          >
            <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-lg">
              <CameraIcon />
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">Take or upload photos</p>
              <p className="text-sm text-gray-600 mt-0.5">Add up to {MAX_IMAGES} — rooms, exterior, details</p>
            </div>
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
        </div>
      )}

      {/* ── Preview screen ── */}
      {screen === 'preview' && (
        <div className="flex flex-col flex-1">
          <div className="grid grid-cols-3 gap-2 mb-3">
            {images.map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-square">
                <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-xs"
                >✕</button>
              </div>
            ))}
            {images.length < MAX_IMAGES && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-gray-600 hover:border-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors"
              >
                <span className="text-2xl leading-none">+</span>
                <span className="text-[10px] mt-1">Add photo</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-600 text-center mb-6">
            {images.length} photo{images.length !== 1 ? 's' : ''} · AI will analyse all of them
          </p>

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />

          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Select tone</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {TONES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTone(value)}
                className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tone === value
                    ? 'bg-[#C9A84C] text-[#1c1c1c]'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >{label}</button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-900/30 border border-red-800/50 rounded-2xl text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyse}
            disabled={loading}
            className="w-full py-4 bg-[#C9A84C] text-[#1c1c1c] rounded-2xl font-semibold text-base shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Spinner />Analysing photos...</> : `Analyse ${images.length > 1 ? `${images.length} Photos` : 'Photo'}`}
          </button>

          <button onClick={reset} className="mt-3 text-sm text-gray-600 hover:text-gray-400 transition-colors py-2">
            Cancel
          </button>
        </div>
      )}

      {/* ── Result screen ── */}
      {screen === 'result' && (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center gap-2 mb-3">
            {images.map((img, i) => (
              <div key={i} className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-widest ml-auto whitespace-nowrap">
              {tone}
            </span>
          </div>

          <div className="flex-1 min-h-0 bg-white/5 border border-white/8 rounded-3xl p-5 mb-4 flex flex-col">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="flex-1 w-full bg-transparent text-gray-100 text-[15px] leading-relaxed resize-none outline-none placeholder-gray-600"
            />
          </div>

          <button
            onClick={handleCopy}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] shadow-lg mb-3 flex items-center justify-center gap-2 ${
              copied ? 'bg-green-600 text-white' : 'bg-[#C9A84C] text-[#1c1c1c]'
            }`}
          >
            {copied ? <><CheckIcon />Copied!</> : <><CopyIcon />Copy Description</>}
          </button>

          <button onClick={reset} className="text-sm text-gray-600 hover:text-gray-400 transition-colors py-2">
            Start Again
          </button>
        </div>
      )}
    </main>
  )
}

function HouseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 56 56" fill="none" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 26 L28 8 L50 26" />
      <path d="M12 22 L12 46 Q12 48 14 48 L22 48 L22 36 Q22 34 24 34 L32 34 Q34 34 34 36 L34 48 L42 48 Q44 48 44 46 L44 22" />
      <path d="M20 14 L20 10 L26 10 L26 18" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg className="w-7 h-7 text-[#1c1c1c]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  )
}

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}
