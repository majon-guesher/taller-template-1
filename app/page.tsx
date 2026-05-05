'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import shoaData from '@/data/shoa.json'

const victim = shoaData.victims[0]

function charToNum(char: string): number {
  const c = char.toLowerCase()
  if (c >= 'a' && c <= 'z') return c.charCodeAt(0) - 96
  if (c === 'ñ') return 15
  if (c === 'á') return 1
  if (c === 'é') return 5
  if (c === 'í') return 9
  if (c === 'ó') return 15
  if (c === 'ú') return 21
  return 0
}

function encodeWord(word: string): string {
  return word.split('').map(c => { const n = charToNum(c); return n > 0 ? String(n) : c }).join(' ')
}

function flattenFragments(fragments: string[]): string[] {
  const words: string[] = []
  fragments.forEach(frag => {
    frag.split(/\s+/).forEach(w => {
      if (w.length > 0) words.push(w)
    })
  })
  return words
}

function stripPunctuation(word: string): string {
  return word.replace(/[^a-zA-ZáéíóúñÑ]/g, '').toLowerCase()
}

const allWords = flattenFragments(victim.fragments)

function getFragmentBounds(fragments: string[]): { start: number; end: number }[] {
  const bounds: { start: number; end: number }[] = []
  let pos = 0
  fragments.forEach(frag => {
    const fragWords = frag.split(/\s+/).filter(w => w.length > 0)
    bounds.push({ start: pos, end: pos + fragWords.length })
    pos += fragWords.length
  })
  return bounds
}

const fragmentBounds = getFragmentBounds(victim.fragments)

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function Home() {
  const [currentWordIdx, setCurrentWordIdx] = useState(0)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const [started, setStarted] = useState(false)
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set())
  const [completedFragments, setCompletedFragments] = useState<Set<number>>(new Set())
  const [allDone, setAllDone] = useState(false)
  const [successFlash, setSuccessFlash] = useState(false)
  const [shakeInput, setShakeInput] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const currentWord = allWords[currentWordIdx] || ''
  const cleanWord = useMemo(() => stripPunctuation(currentWord), [currentWord])
  const encodedWord = useMemo(() => encodeWord(currentWord), [currentWord])

  const currentFragmentIdx = useMemo(() => {
    for (let i = 0; i < fragmentBounds.length; i++) {
      if (currentWordIdx >= fragmentBounds[i].start && currentWordIdx < fragmentBounds[i].end) return i
    }
    return fragmentBounds.length - 1
  }, [currentWordIdx])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim().toLowerCase() === cleanWord.toLowerCase()) {
      setSuccessFlash(true)
      setError(false)
      const newCompleted = new Set(completedWords)
      newCompleted.add(currentWordIdx)
      setCompletedWords(newCompleted)

      const nextFragments = new Set(completedFragments)
      for (let i = 0; i < fragmentBounds.length; i++) {
        let allDone = true
        for (let j = fragmentBounds[i].start; j < fragmentBounds[i].end; j++) {
          if (!newCompleted.has(j)) allDone = false
        }
        if (allDone) nextFragments.add(i)
      }
      setCompletedFragments(nextFragments)

      if (currentWordIdx >= allWords.length - 1) {
        setAllDone(true)
      }

      setTimeout(() => {
        setSuccessFlash(false)
        if (currentWordIdx < allWords.length - 1) {
          setCurrentWordIdx(prev => prev + 1)
          setInput('')
        }
      }, 300)
    } else {
      setError(true)
      setShakeInput(true)
      setTimeout(() => setShakeInput(false), 400)
      setTimeout(() => setError(false), 1500)
    }
  }, [input, cleanWord, currentWordIdx, completedWords, completedFragments])

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus()
  }, [started, currentWordIdx])

  const handleStart = () => {
    setStarted(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const progressPct = Math.round((completedWords.size / allWords.length) * 100)

  const revealedText = useMemo(() => {
    const words: string[] = []
    allWords.forEach((w, i) => {
      if (completedWords.has(i)) {
        words.push(w)
      } else if (i === currentWordIdx) {
        words.push('▓▓▓')
      } else {
        words.push('· · ·')
      }
    })
    return fragmentBounds.map((bounds, fi) => {
      return victim.fragments[fi].split(/\s+/).map((_, wi) => {
        const idx = bounds.start + wi
        if (completedWords.has(idx)) return allWords[idx]
        if (idx === currentWordIdx) return '▓▓▓'
        return '· · ·'
      }).join(' ')
    }).join('\n\n')
  }, [completedWords, currentWordIdx])

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono overflow-hidden relative select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#001a00_0%,_#0a0a0a_70%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)` }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        <header className="border-b border-[#00ff41]/30 px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="tracking-[0.3em] font-bold text-[#00ff41]">CANDADO DIGITAL</span>
            <span className="text-[#00ff41]/30">SHOÁ — DESCIFRAR</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-32 h-1.5 bg-[#00ff41]/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#00ff41] transition-all duration-300" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[#00ff41]/50">{progressPct}%</span>
          </div>
        </header>

        <div className="border-b border-[#00ff41]/20 px-4 py-2 flex items-center gap-3 shrink-0 overflow-x-auto">
          {victim.fragments.map((_, i) => {
            const done = completedFragments.has(i)
            const current = i === currentFragmentIdx
            return (
              <div key={i} className={`flex items-center gap-1 shrink-0 ${current && !done ? 'animate-pulse' : ''}`}>
                <span className={`text-sm ${done ? 'text-[#00ff41]' : current ? 'text-[#00ff41]/60' : 'text-[#00ff41]/20'}`}>
                  {done ? '🔓' : '🔒'}
                </span>
                <span className={`text-[10px] tracking-wider ${done ? 'text-[#00ff41]/80' : current ? 'text-[#00ff41]/60' : 'text-[#00ff41]/20'}`}>
                  P{i + 1}
                </span>
              </div>
            )
          })}
          <span className="ml-auto text-[10px] text-[#00ff41]/30">
            {completedWords.size}/{allWords.length}
          </span>
        </div>

        {!started ? (
          <div className="flex-1 flex items-center justify-center" onClick={handleStart}>
            <div className="text-center max-w-lg px-6">
              <div className="text-8xl mb-8">🔒</div>
              <h1 className="text-[#00ff41] text-2xl tracking-[0.3em] mb-2 font-bold">CANDADO DIGITAL</h1>
              <p className="text-[#00ff41]/50 text-sm mb-6">
                Testimonio encriptado de Alice Newman (Sala Karpman)<br />
                Varsovia, 1928. Sobreviviente de la Shoá.
              </p>
              <div className="border border-[#00ff41]/20 rounded p-4 mb-6 text-left text-[#00ff41]/70 text-xs">
                <p className="mb-2 text-[#00ff41] font-bold">CÓMO FUNCIONA</p>
                <p className="mb-1">La página te muestra <span className="text-[#00ff41]">números</span> como <span className="text-[#00ff41]">10 21 7 1 2 1</span></p>
                <p className="mb-1">Tenés que escribir la <span className="text-[#00ff41]">palabra</span> que corresponde: <span className="text-[#00ff41]">jugaba</span></p>
                <p className="mb-3">Cada número = posición de la letra: A=1, B=2, C=3... Z=26</p>
                <div className="flex flex-wrap gap-1 pt-2 border-t border-[#00ff41]/10">
                  {alphabet.map(letter => (
                    <span key={letter} className="text-[10px] text-[#00ff41]/40">
                      {letter}={letter.charCodeAt(0) - 64}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-[#00ff41]/40 text-sm animate-pulse">Hacé clic para empezar</p>
            </div>
          </div>
        ) : allDone ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🔓</div>
                <h2 className="text-[#00ff41] text-2xl tracking-[0.3em] font-bold">MEMORIA DESCIFRADA</h2>
                <p className="text-[#00ff41]/50 text-sm mt-2">Alice Newman (Sala Karpman) — Varsovia, 1928</p>
              </div>
              {victim.fragments.map((frag, i) => (
                <p key={i} className="text-[#00ff41]/80 text-base leading-relaxed mb-4">
                  {frag}
                </p>
              ))}
              <div className="border-t border-[#00ff41]/10 mt-6 pt-4 text-center">
                <p className="text-[#00ff41]/30 text-xs">
                  Cada nombre era un mundo. Cada numero, una vida.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 text-[#00ff41]/30 text-xs leading-relaxed whitespace-pre-wrap hidden md:block">
              {revealedText}
            </div>

            <div className="border-t border-[#00ff41]/30 bg-[#0d0d0d] p-6 shrink-0 flex flex-col items-center gap-4">
              <div className="text-[#00ff41]/30 text-[10px] tracking-wider text-center">
                FRAGMENTO {currentFragmentIdx + 1} — PALABRA {currentWordIdx + 1}
              </div>

              <div className={`text-3xl md:text-5xl text-center font-bold tracking-[0.3em] transition-all duration-200 ${successFlash ? 'scale-110 text-[#00ff41]' : 'text-[#00ff41]'}`}>
                {encodedWord}
              </div>

              <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Escribí la palabra..."
                  className={`w-full bg-[#001a00] border-2 text-center text-xl tracking-[0.2em] py-3 px-4 outline-none font-mono ${
                    error ? 'border-red-500 text-red-400 placeholder:text-red-400/20'
                    : 'border-[#00ff41]/40 text-[#00ff41] placeholder:text-[#00ff41]/15'
                  } focus:border-[#00ff41] focus:shadow-[0_0_20px_rgba(0,255,65,0.15)]`}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />

                {error && (
                  <p className="text-red-400 text-xs tracking-wider">
                    NO ES ESA PALABRA — A=1, B=2, C=3... Z=26
                  </p>
                )}

                <button type="submit" className="border border-[#00ff41]/40 text-[#00ff41] px-6 py-2 text-xs tracking-[0.3em] hover:bg-[#00ff41]/10 active:bg-[#00ff41]/20 transition-colors">
                  DESCIFRAR
                </button>
              </form>

              <div className="flex flex-wrap justify-center gap-1 mt-1">
                {alphabet.map(letter => (
                  <span key={letter} className="text-[9px] text-[#00ff41]/25">
                    {letter}={letter.charCodeAt(0) - 64}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}