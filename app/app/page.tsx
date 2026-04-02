'use client'

import { useState, useRef } from 'react'

type Tone = 'Standard' | 'Luxury' | 'Concise'
type Screen = 'landing' | 'preview' | 'result'
type ImageItem = { src: string; mediaType: string }

const TONES: { value: Tone; label: string; hint: string }[] = [
  { value: 'Standard', label: 'Standard', hint: 'Warm & informative' },
  { value: 'Luxury', label: 'Luxury', hint: 'Aspirational & elevated' },
  { value: 'Concise', label: 'Concise', hint: 'Punchy & factual' },
]

const MAX_IMAGES = 5

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [images, setImages] = useState<ImageItem[]>([])
  const [tone, setTone] = useState<Tone>('Standard')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    files.slice(0, MAX_IMAGES - images.length).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImages(prev => {
          const next = [...prev, { src: reader.result as string, mediaType: file.type || 'image/jpeg' }]
          return next
        })
        setScreen('preview')
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }

  const removeImage = (index: number) => {
    setImages(prev => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0) setScreen('landing')
      return next
    })
  }

  const handleAnalyse = async () => {
    if (!images.length) return
    setLoading(true)
    setError('')

    try {
      const payload = images.map(img => ({
        image: img.src.split(',')[1],
        mediaType: img.mediaType,
      }))

      const res = await fetch('/api/describe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images: payload, tone }),
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
        ta.focus()
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // silent fail
    }
  }

  const handleStartAgain = () => {
    setImages([])
    setDescription('')
    setError('')
    setCopied(false)
    setTone('Standard')
    setScreen('landing')
  }

  return (
    <main className="min-h-screen flex flex-col max-w-md mx-auto px-5 py-10">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-1">
          <HomeIcon />
          <span className="text-xl font-semibold tracking-tight text-[#1c1c1c]">PropertySnap</span>
        </div>
        <p className="text-sm text-gray-500 pl-8">Professional property descriptions in seconds</p>
      </header>

      {screen === 'landing' && (
        <div className="flex flex-col flex-1">
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Select tone</p>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map(({ value, label, hint }) => (
                <button
                  key={value}
                  onClick={() => setTone(value)}
                  className={`flex flex-col items-center py-3.5 px-2 rounded-2xl border-2 transition-all ${
                    tone === value ? 'border-[#C9A84C] bg-[#C9A84C]/5' : 'border-gray-100 bg-gray-50 hover:border-gray-200'
                  }`}
                >
                  <span className={`text-sm font-semibold ${tone === value ? 'text-[#C9A84C]' : 'text-[#1c1c1c]'}`}>
                    {label}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 text-center leading-tight">{hint}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center justify-center gap-3 py-14 rounded-3xl border-2 border-dashed border-[#C9A84C]/40 bg-[#C9A84C]/5 hover:bg-[#C9A84C]/10 transition-colors active:scale-[0.98]"
          >
            <div className="w-16 h-16 rounded-full bg-[#C9A84C] flex items-center justify-center shadow-md">
              <CameraIcon />
            </div>
            <div className="text-center">
              <p className="text-[#1c1c1c] font-semibold">Take or upload photos</p>
              <p className="text-sm text-gray-400 mt-0.5">Add up to {MAX_IMAGES} — rooms, exterior, details</p>
            </div>
          </button>

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />
        </div>
      )}

      {screen === 'preview' && (
        <div className="flex flex-col flex-1">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {images.map((img, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden aspect-square">
                <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center text-xs leading-none"
                >
                  ✕
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors"
              >
                <span className="text-2xl leading-none">+</span>
                <span className="text-[10px] mt-1">Add photo</span>
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 text-center mb-6">
            {images.length} photo{images.length !== 1 ? 's' : ''} · AI will analyse all of them
          </p>

          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageSelect} className="hidden" />

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Select tone</p>
            <div className="grid grid-cols-3 gap-2">
              {TONES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setTone(value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    tone === value ? 'bg-[#C9A84C] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyse}
            disabled={loading}
            className="w-full py-4 bg-[#C9A84C] text-white rounded-2xl font-semibold text-base shadow-md active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? <><Spinner />Analysing photos...</> : `Analyse ${images.length > 1 ? `${images.length} Photos` : 'Photo'}`}
          </button>

          <button onClick={handleStartAgain} className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors py-2">
            Cancel
          </button>
        </div>
      )}

      {screen === 'result' && (
        <div className="flex flex-col flex-1">
          {images.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
              {images.map((img, i) => (
                <div key={i} className="flex-shrink-0 w-20 h-20 rounded-2xl overflow-hidden">
                  <img src={img.src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-[#C9A84C] uppercase tracking-widest">{tone}</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">AI-generated description</span>
          </div>

          <div className="flex-1 bg-gray-50 rounded-3xl p-5 mb-4">
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full bg-transparent text-[#1c1c1c] text-[15px] leading-relaxed resize-none outline-none"
              rows={6}
            />
          </div>

          <button
            onClick={handleCopy}
            className={`w-full py-4 rounded-2xl font-semibold text-base transition-all active:scale-[0.98] shadow-md mb-3 flex items-center justify-center gap-2 ${
              copied ? 'bg-green-500 text-white' : 'bg-[#C9A84C] text-white'
            }`}
          >
            {copied ? <><CheckIcon />Copied!</> : <><CopyIcon />Copy Description</>}
          </button>

          <button
            onClick={handleStartAgain}
            className="w-full py-3.5 rounded-2xl border-2 border-gray-100 text-sm font-semibold text-gray-500 hover:border-gray-200 hover:text-gray-700 transition-all"
          >
            Start Again
          </button>
        </div>
      )}
    </main>
  )
}

function HomeIcon() {
  return (
    <svg className="w-6 h-6 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9.75L12 3l9 6.75V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 21V12h6v9" />
    </svg>
  )
}

function CameraIcon() {
  return (
    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
