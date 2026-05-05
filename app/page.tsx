'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import shoaData from '@/data/shoa.json'

const victim = shoaData.victims[0]

function charToNumber(char: string): number {
  const c = char.toLowerCase()
  if (c >= 'a' && c <= 'z') return c.charCodeAt(0) - 96
  return 0
}

function encodeChar(char: string): string {
  const num = charToNumber(char)
  if (num === 0) {
    if (char === ' ') return ' '
    if (char === '.') return '.'
    if (char === ',') return ','
    if (char === 'á') return '1+0'
    if (char === 'é') return '5+0'
    if (char === 'í') return '9+0'
    if (char === 'ó') return '15+0'
    if (char === 'ú') return '21+0'
    if (char === 'ñ') return '15+9'
    if (char === '\n') return '\n'
    return char
  }
  const a = Math.max(1, Math.floor(Math.random() * num))
  const b = num - a
  if (b === 0) return `${a}+0`
  return `${a}+${b}`
}

function encodeText(text: string): string {
  return text.split('').map(c => encodeChar(c)).join(' ')
}

function getWordBoundaries(text: string): number[] {
  const boundaries: number[] = []
  let pos = 0
  const words = text.split(/(\s+)/)
  words.forEach(word => {
    if (word.trim().length > 0) {
      boundaries.push(pos)
    }
    pos += word.length
  })
  return boundaries
}

type DecodedWord = {
  original: string
  encoded: string
  start: number
  end: number
}

function buildWordPairs(text: string): DecodedWord[] {
  const pairs: DecodedWord[] = []
  const regex = /[a-záéíóúñ]+/gi
  let match
  while ((match = regex.exec(text)) !== null) {
    pairs.push({
      original: match[0],
      encoded: encodeText(match[0]),
      start: match.index,
      end: match.index + match[0].length,
    })
  }
  return pairs
}

export default function Home() {
  const fragments = victim.fragments
  const [activeFragment, setActiveFragment] = useState(0)
  const [revealedWords, setRevealedWords] = useState(0)
  const [started, setStarted] = useState(false)
  const [allUnlocked, setAllUnlocked] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [keystrokeCount, setKeystrokeCount] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  const currentText = fragments[activeFragment]
  const words = useMemo(() => buildWordPairs(currentText), [currentText])
  const totalWords = words.length

  const progressPct = Math.min(100, Math.round((revealedWords / totalWords) * 100))

  useEffect(() => {
    if (revealedWords >= totalWords) {
      if (activeFragment < fragments.length - 1) {
        const timeout = setTimeout(() => {
          setActiveFragment(prev => prev + 1)
          setRevealedWords(0)
        }, 1500)
        return () => clearTimeout(timeout)
      } else {
        setAllUnlocked(true)
      }
    }
  }, [revealedWords, totalWords, activeFragment, fragments.length])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [revealedWords])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') return
    if (e.key === 'Tab') { e.preventDefault(); return }
    if (e.key === 'Enter' && e.ctrlKey) {
      setShowOriginal(prev => !prev)
      return
    }
    if (allUnlocked) return

    if (!started) setStarted(true)

    setKeystrokeCount(prev => prev + 1)
    setRevealedWords(prev => Math.min(prev + 1, totalWords))
  }, [started, allUnlocked, totalWords])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const fragmentsCompleted = allUnlocked ? fragments.length : activeFragment

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono overflow-hidden relative select-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#001a00_0%,_#0a0a0a_70%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        <header className="border-b border-[#00ff41]/30 px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[#00ff41] font-bold tracking-[0.3em]">CANDADO_DIGITAL</span>
            <span className="text-[#00ff41]/40">v2.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#00ff41]/50">
              FRAGMENTO <span className="text-[#00ff41]">{activeFragment + 1}/{fragments.length}</span>
            </span>
            <span className="text-[#00ff41]/50">
              DESCIFRADO <span className="text-[#00ff41]">{progressPct}%</span>
            </span>
          </div>
        </header>

        <div className="border-b border-[#00ff41]/20 px-4 py-3 flex items-center gap-3 shrink-0">
          {fragments.map((_, i) => {
            const done = i < fragmentsCompleted
            const current = i === activeFragment && !allUnlocked
            return (
              <div key={i} className="flex items-center gap-1.5">
                <div className={`w-5 h-5 flex items-center justify-center text-[10px] border rounded-sm ${
                  done
                    ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10'
                    : current
                      ? 'border-[#00ff41]/60 text-[#00ff41]/60 animate-pulse'
                      : 'border-[#00ff41]/20 text-[#00ff41]/20'
                }`}>
                  {done ? '🔓' : '🔒'}
                </div>
                <span className={`text-[10px] tracking-wider ${
                  done ? 'text-[#00ff41]/80' : 'text-[#00ff41]/20'
                }`}>
                  P{i + 1}
                </span>
              </div>
            )
          })}
          <div className="ml-auto text-[10px] text-[#00ff41]/30">
            TECLAS: {keystrokeCount}
          </div>
        </div>

        <div className="border-b border-[#00ff41]/10 px-4 py-2 shrink-0">
          <p className="text-[#00ff41]/40 text-[10px] tracking-wider">
            SUJETO: ALICE NEWMAN (SALA KARPMAN) — VARSOVIA, 1928
          </p>
        </div>

        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-6 text-sm leading-loose"
        >
          {!started ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="text-8xl mb-8 animate-pulse">🔒</div>
                <p className="text-[#00ff41] text-xl tracking-widest mb-3">CANDADO DIGITAL</p>
                <p className="text-[#00ff41]/60 text-sm mb-2">Testimonio encriptado de la Shoá</p>
                <div className="border border-[#00ff41]/20 rounded p-3 mt-6 mb-6 text-left text-[#00ff41]/70 text-xs">
                  <p className="mb-1"><span className="text-[#00ff41]">CLAVE:</span> Cada letra se reemplaza por una suma</p>
                  <p className="mb-1"><span className="text-[#00ff41]">EJ:</span> C = 2+1, H = 8+0, L = 11+1</p>
                  <p><span className="text-[#00ff41]">TIPS:</span> El resultado de cada suma es la posición de la letra en el abecedario</p>
                </div>
                <p className="text-[#00ff41]/30 text-xs animate-pulse">Tocá cualquier tecla para empezar a descifrar</p>
              </div>
            </div>
          ) : showOriginal ? (
            <div className="max-w-2xl">
              <p className="text-[#00ff41]/30 text-xs mb-4 tracking-wider">[ MODO ORIGINAL — Ctrl+Enter para volver ]</p>
              <p className="text-[#00ff41] leading-loose">
                {currentText}
              </p>
            </div>
          ) : (
            <div className="max-w-2xl">
              <p className="text-[#00ff41]/30 text-[10px] mb-4 tracking-wider">
                [ SUMÁ cada par de números → posición en el abecedario → letra ]
              </p>
              <div className="space-y-2">
                {words.map((word, i) => {
                  const isRevealed = i < revealedWords
                  const isCurrent = i === revealedWords && !allUnlocked
                  if (!isRevealed && !isCurrent) return null
                  return (
                    <span key={i} className="inline-flex flex-col mx-1.5 my-1">
                      {isRevealed && (
                        <span className="text-[#00ff41]/80 text-base font-bold leading-tight">
                          {word.original}
                        </span>
                      )}
                      <span className={`text-[10px] tracking-wider ${
                        isRevealed ? 'text-[#00ff41]/40' : 'text-[#00ff41]/70 animate-pulse'
                      }`}>
                        {word.encoded}
                      </span>
                    </span>
                  )
                })}
                {!allUnlocked && (
                  <span className="inline-block w-2 h-5 bg-[#00ff41] animate-pulse ml-1 align-middle" />
                )}
              </div>
            </div>
          )}
        </div>

        {allUnlocked && !showOriginal && (
          <div className="border-t-2 border-[#00ff41] bg-[#0a0a0a]/95 px-6 py-6 shrink-0 max-h-[40vh] overflow-y-auto">
            <h2 className="text-[#00ff41] font-bold text-base tracking-[0.3em] mb-4 text-center">
              🔓 MEMORIA DESCIFRADA — ALICE NEWMAN
            </h2>
            {fragments.map((frag, i) => (
              <p key={i} className="text-[#00ff41]/70 text-sm leading-relaxed mb-3">
                {frag}
              </p>
            ))}
            <p className="text-[#00ff41]/30 text-xs text-center mt-4 pt-3 border-t border-[#00ff41]/10">
              Cada nombre era un mundo. Cada numero, una vida.
            </p>
          </div>
        )}

        <footer className="border-t border-[#00ff41]/20 px-4 py-1 text-[10px] text-[#00ff41]/40 flex justify-between shrink-0">
          <span>A=1 B=2 C=3 ... Z=26 — SUMÁ para descifrar</span>
          <span>
            {started
              ? `Ctrl+Enter: ver original`
              : 'ESPERANDO ENTRADA...'}
          </span>
        </footer>
      </div>
    </div>
  )
}