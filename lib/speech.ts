'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'

let lastMessage = ''

export const DEFAULT_HELP_MESSAGE =
  'Màn hình có sáu nút lớn. Hàng thứ nhất: nút vàng là Lộ trình yêu thích, nút xanh lá là Về nhà. Hàng thứ hai: nút xanh dương là Dẫn đường, nút cam là Xe sắp đến. Hàng cuối: nút tím là Trợ giúp, nút đỏ là Gọi người thân.'

type SpeakOptions = { onEnd?: () => void; remember?: boolean }

export function speak(text: string, options: SpeakOptions = {}) {
  const { onEnd, remember = true } = options
  if (remember) lastMessage = text
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.()
    return
  }
  const synth = window.speechSynthesis
  synth.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'vi-VN'
  const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith('vi'))
  if (voice) utterance.voice = voice
  utterance.rate = 0.95
  utterance.onend = () => onEnd?.()
  utterance.onerror = () => onEnd?.()
  synth.speak(utterance)
}

export function repeatLastMessage() {
  speak(lastMessage || DEFAULT_HELP_MESSAGE)
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
}

type RecognitionResultEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>
}

type Recognition = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: RecognitionResultEvent) => void) | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  abort: () => void
}

type RecognitionCtor = new () => Recognition

function getRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const w = window as unknown as {
    SpeechRecognition?: RecognitionCtor
    webkitSpeechRecognition?: RecognitionCtor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

const noopSubscribe = () => () => {}

export function useSpeechRecognition() {
  const supported = useSyncExternalStore(
    noopSubscribe,
    () => getRecognitionCtor() !== null,
    () => false,
  )
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const recognitionRef = useRef<Recognition | null>(null)

  const start = useCallback((onResult: (text: string) => void) => {
    const Ctor = getRecognitionCtor()
    if (!Ctor) return false
    recognitionRef.current?.abort()
    stopSpeaking()
    const recognition = new Ctor()
    recognition.lang = 'vi-VN'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript ?? ''
      setTranscript(text)
      onResult(text)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)
    recognitionRef.current = recognition
    setTranscript('')
    setListening(true)
    try {
      recognition.start()
    } catch {
      setListening(false)
      return false
    }
    return true
  }, [])

  const stop = useCallback(() => {
    recognitionRef.current?.abort()
    setListening(false)
  }, [])

  useEffect(() => () => recognitionRef.current?.abort(), [])

  return { supported, listening, transcript, start, stop }
}

const NUMBER_WORDS: Record<string, number> = {
  một: 1,
  mốt: 1,
  hai: 2,
  ba: 3,
  bốn: 4,
  tư: 4,
  năm: 5,
  sáu: 6,
  bảy: 7,
  tám: 8,
  chín: 9,
  mười: 10,
}

export function parseSpokenNumber(text: string): number | null {
  const normalized = text.toLowerCase().normalize('NFC')
  const digit = normalized.match(/\d+/)
  if (digit) return Number(digit[0])
  for (const word of normalized.split(/\s+/)) {
    if (word in NUMBER_WORDS) return NUMBER_WORDS[word]
  }
  return null
}
