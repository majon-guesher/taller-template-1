'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import shoaData from '@/data/shoa.json'

function cipherEncode(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map(char => {
      if (char >= 'a' && char <= 'z') {
        return String(char.charCodeAt(0) - 96)
      }
      if (char === ' ') return '/'
      if (char === '.') return '.'
      if (char === ',') return ','
      return char
    })
    .map((chunk, i, arr) => {
      if (chunk === '/' || chunk === '.' || chunk === ',') return chunk
      const next = arr[i + 1]
      if (next && next !== '/' && next !== '.' && next !== ',') return chunk + '-'
      return chunk
    })
    .join('')
}

function formatEntry(victim: { name: string; info: string; born: number; died: number }, index: number): string {
  const encrypted = cipherEncode(victim.info)
  return `┌─ ARCHIVO_${index + 1} ─────────────────────────\n│ SUJETO: ${cipherEncode(victim.name)}\n│ NACIDO: ${cipherEncode(String(victim.born))}\n│ FALLECIDO: ${cipherEncode(String(victim.died))}\n│\n│ TRANSMISION:\n│ ${encrypted}\n│\n└── FIN_ARCHIVO_${index + 1} ───────────────────────`
}

const allEntries = shoaData.victims.map((v, i) => formatEntry(v, i))
const fullText = allEntries.join('\n\n')
const charsPerKeystroke = 3

export default function Home() {
  const [revealed, setRevealed] = useState(0)
  const [started, setStarted] = useState(false)
  const [unlocked, setUnlocked] = useState<number[]>([])
  const [showDecoded, setShowDecoded] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const victimThresholds = useRef<number[]>([])
  if (victimThresholds.current.length === 0) {
    let pos = 0
    victimThresholds.current = allEntries.map(entry => {
      pos += entry.length + 2
      return pos
    })
  }

  useEffect(() => {
    const newUnlocked: number[] = []
    victimThresholds.current.forEach((threshold, i) => {
      if (revealed >= threshold) newUnlocked.push(i)
    })
    setUnlocked(newUnlocked)
    if (newUnlocked.length === shoaData.victims.length && !showDecoded) {
      setShowDecoded(true)
    }
  }, [revealed, showDecoded])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [revealed])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') return
    if (e.key === 'Enter' && e.ctrlKey) {
      setShowDecoded(prev => !prev)
      return
    }
    if (e.key === 'Tab') {
      e.preventDefault()
      return
    }
    if (!started) setStarted(true)
    setRevealed(prev => Math.min(prev + charsPerKeystroke, fullText.length))
  }, [started])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const visibleText = fullText.slice(0, revealed)
  const progress = Math.round((revealed / fullText.length) * 100)

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#0a0a0a] text-[#00ff41] font-mono overflow-hidden relative select-none cursor-text"
      onClick={() => containerRef.current?.focus()}
      tabIndex={0}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#001a00_0%,_#0a0a0a_70%)] pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00ff41 2px, #00ff41 4px)`,
        }}
      />

      <div className="relative z-10 flex flex-col h-screen">
        <header className="border-b border-[#00ff41]/30 px-4 py-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[#00ff41] font-bold tracking-widest">SHOA_CIPHER</span>
            <span className="text-[#00ff41]/50">v1.0</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#00ff41]/50">
              PROGRESO: <span className="text-[#00ff41]">{progress}%</span>
            </span>
            <span className="text-[#00ff41]/50">
              DESCIFRADOS: <span className="text-[#00ff41]">{unlocked.length}/{shoaData.victims.length}</span>
            </span>
          </div>
        </header>

        <div className="border-b border-[#00ff41]/20 px-4 py-3 flex items-center gap-6 shrink-0">
          {shoaData.victims.map((v, i) => {
            const isUnlocked = unlocked.includes(i)
            return (
              <div key={v.name} className="flex items-center gap-2">
                <div className={`w-6 h-6 flex items-center justify-center text-sm border ${
                  isUnlocked
                    ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10'
                    : 'border-[#00ff41]/30 text-[#00ff41]/30'
                }`}>
                  {isUnlocked ? '🔓' : '🔒'}
                </div>
                <span className={`text-xs tracking-wider ${
                  isUnlocked ? 'text-[#00ff41]' : 'text-[#00ff41]/30'
                }`}>
                  {isUnlocked ? v.name.toUpperCase() : `SUJETO_${i + 1}`}
                </span>
              </div>
            )
          })}
        </div>

        <div
          ref={terminalRef}
          className="flex-1 overflow-y-auto p-4 text-[#00ff41] text-sm leading-relaxed whitespace-pre-wrap"
        >
          {!started && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="text-6xl mb-6">🔒</div>
                <p className="text-[#00ff41]/80 text-lg mb-2">ARCHIVO ENCRYPTADO — SHOA</p>
                <p className="text-[#00ff41]/50 text-sm">CIFRADO ALFABÉTICO: A=1, B=2, C=3 ... Z=26</p>
                <p className="text-[#00ff41]/30 mt-8 text-xs">Tocá cualquier tecla para descifrar</p>
              </div>
            </div>
          )}
          {started && (
            <>
              {visibleText}
              <span className="inline-block w-2 h-4 bg-[#00ff41] animate-pulse ml-0.5" />
            </>
          )}
        </div>

        {showDecoded && (
          <div className="border-t-2 border-[#00ff41] bg-[#0a0a0a] px-6 py-6 shrink-0">
            <h2 className="text-[#00ff41] font-bold text-lg tracking-widest mb-4 text-center">
              MEMORIA DESCIFRADA
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {shoaData.victims.map((v, i) => (
                <div
                  key={v.name}
                  className="border border-[#00ff41]/40 rounded p-3 bg-[#00ff41]/5"
                >
                  <p className="text-[#00ff41] font-bold text-sm">{v.name}</p>
                  <p className="text-[#00ff41]/70 text-xs mt-1">{v.born}–{v.died}</p>
                  <p className="text-[#00ff41]/60 text-xs mt-2 leading-snug">{v.info}</p>
                </div>
              ))}
            </div>
            <p className="text-[#00ff41]/30 text-xs text-center mt-4">
              Cada nombre era un mundo. Cada numero, una vida.
            </p>
          </div>
        )}

        <footer className="border-t border-[#00ff41]/20 px-4 py-1 text-[10px] text-[#00ff41]/40 flex justify-between shrink-0">
          <span>CIFRADO: A=1 B=2 C=3 ... Z=26</span>
          <span>
            {started
              ? `${revealed}/${fullText.length} caracteres — Ctrl+Enter para ver original`
              : 'ESPERANDO ENTRADA...'}
          </span>
        </footer>
      </div>
    </div>
  )
}