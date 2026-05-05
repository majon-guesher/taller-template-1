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

function flattenFragments(fragments: string[]): string[] {
  const words: string[] = []
  fragments.forEach(frag => {
    frag.split(/\s+/).forEach(w => {
      if (w.length > 0) words.push(w)
    })
  })
  return words
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
  const expectedNums = useMemo(() => {
    return currentWord.split('').map(c => charToNum(c)).filter(n => n > 0)
  }, [currentWord])

  const expectedInput = useMemo(() => expectedNums.join(' '), [expectedNums])

  const currentFragmentIdx = useMemo(() => {
    for (let i = 0; i < fragmentBounds.length; i++) {
      if (currentWordIdx >= fragmentBounds[i].start && currentWordIdx < fragmentBounds[i].end) return i
    }
    return fragmentBounds.length - 1
  }, [currentWordIdx])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const normalized = input.trim().replace(/\s+/g, ' ')
    const inputNums = normalized.split(' ').map(n => parseInt(n, 10))
    const isCorrect = inputNums.length === expectedNums.length && inputNums.every((n, i) => n === expectedNums[i])

    if (isCorrect) {
      setSuccessFlash(true)
      setError(false)
      const newCompleted = new Set(completedWords)
      newCompleted.add(currentWordIdx)
      setCompletedWords(newCompleted)

      setCompletedFragments(prev => {
        const next = new Set(prev)
        for (let i = 0; i < fragmentBounds.length; i++) {
          let allWordsDone = true
          for (let j = fragmentBounds[i].start; j < fragmentBounds[i].end; j++) {
            if (!newCompleted.has(j) && j !== currentWordIdx) allWordsDone = false
          }
          if (allWordsDone && currentWordIdx + 1 >= fragmentBounds[i].end) next.add(i)
        }
        if (currentWordIdx + 1 === allWords.length) {
          setAllDone(true)
        }
        return next
      })

      setTimeout(() => {
        setSuccessFlash(false)
        if (currentWordIdx < allWords.length - 1) {
          setCurrentWordIdx(prev => prev + 1)
          setInput('')
        }
      }, 250)
    } else {
      setError(true)
      setShakeInput(true)
      setTimeout(() => setShakeInput(false), 400)
      setTimeout(() => setError(false), 1500)
    }
  }, [input, expectedNums, currentWordIdx, completedWords])

  useEffect(() => {
    if (started && inputRef.current) {
      inputRef.current.focus()
    }
  }, [started, currentWordIdx])

  const handleStart = () => {
    setStarted(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const progressPct = Math.round((completedWords.size / allWords.length) * 100)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

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
            <span className="text-[#00ff41]/30">SHOÁ — ARCHIVO CLASIFICADO</span>
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
              <div key={i} className={`flex items-center gap-1 shrink-0 ${current ? 'animate-pulse' : ''}`}>
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
            {completedWords.size}/{allWords.length} palabras
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
                <p className="mb-1">La página te muestra una <span className="text-[#00ff41]">palabra</span></p>
                <p className="mb-1">Tenés que escribirla en <span className="text-[#00ff41]">números</span> usando A=1, B=2, C=3... Z=26</p>
                <p className="mb-3">Separados por espacios. Ejemplo: <span className="text-[#00ff41]">MAL → 13 1 12</span></p>
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
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
            <div className="text-[#00ff41]/30 text-xs tracking-wider text-center">
              FRAGMENTO {currentFragmentIdx + 1} DE {victim.fragments.length} — PALABRA {currentWordIdx + 1} DE {allWords.length}
            </div>

            <div className={`text-5xl md:text-7xl text-center font-bold tracking-wider transition-all duration-200 ${successFlash ? 'text-[#00ff41] scale-110' : 'text-[#00ff41]'}`}>
              {currentWord}
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center gap-3">
              <div className={`w-full transition-all duration-300 ${shakeInput ? 'animate-none' : ''}`}
                style={shakeInput ? { animation: 'shake 0.4s ease-in-out' } : {}}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={expectedNums.map(() => '_').join(' ')}
                  className={`w-full bg-[#001a00] border-2 text-center text-xl tracking-[0.3em] py-3 px-4 outline-none font-mono placeholder:text-[#00ff41]/15 ${
                    error ? 'border-red-500 text-red-400' : 'border-[#00ff41]/40 text-[#00ff41]'
                  } focus:border-[#00ff41] focus:shadow-[0_0_20px_rgba(0,255,65,0.15)]`}
                  autoComplete="off"
                  autoCapitalize="off"
                />
              </div>

              {error && (
                <p className="text-red-400 text-xs tracking-wider">
                  INCORRECTO — cada letra vale su posición: A=1, B=2, C=3...
                </p>
              )}

              <button type="submit" className="border border-[#00ff41]/40 text-[#00ff41] px-6 py-2 text-xs tracking-[0.3em] hover:bg-[#00ff41]/10 transition-colors">
                VERIFICAR
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-x-2 gap-y-0.5 mt-2 max-w-2xl">
              {currentWord.toUpperCase().split('').map((letter, i) => {
                const num = charToNum(letter)
                if (num === 0) return null
                const inputNums = input.trim().split(/\s+/).map(n => parseInt(n, 10))
                const inputNum = inputNums[i]
                const filled = inputNum !== undefined && !isNaN(inputNum)
                const correct = filled && inputNum === num
                const wrong = filled && inputNum !== num
                return (
                  <div key={i} className="flex flex-col items-center">
                    <span className={`text-lg font-bold ${correct ? 'text-[#00ff41]' : wrong ? 'text-red-400' : 'text-[#00ff41]'}`}>
                      {letter}
                    </span>
                    <span className={`text-[10px] h-3 ${
                      correct ? 'text-[#00ff41]/60' : wrong ? 'text-red-400/60' : 'text-[#00ff41]/20'
                    }`}>
                      {filled ? (correct ? '✓' : '✗') : '·'}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-wrap justify-center gap-1 mt-4 pt-4 border-t border-[#00ff41]/10">
              {alphabet.map(letter => (
                <span key={letter} className="text-[9px] text-[#00ff41]/30 px-0.5">
                  {letter}={letter.charCodeAt(0) - 64}
                </span>
              ))}
            </div>
          </div>
        )}

        <footer className="border-t border-[#00ff41]/20 px-4 py-1 text-[10px] text-[#00ff41]/30 flex justify-between shrink-0">
          <span>A=1 B=2 C=3 ... Z=26 — Escribí los números separados por espacios</span>
          <span>Alice Newman — Varsovia, 1928</span>
        </footer>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}