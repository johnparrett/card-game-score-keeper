import React, { createContext, useContext, useMemo, useState } from 'react'
import en from './locales/en.json'
import es from './locales/es.json'

type Lang = 'en' | 'es'
const messages: Record<Lang, Record<string, string>> = { en, es }

const I18nContext = createContext({
  lang: 'en' as Lang,
  setLang: (l: Lang) => {},
  t: (k: string) => k
})

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>((navigator.language || 'en').startsWith('es') ? 'es' : 'en')
  const t = (k: string) => messages[lang]?.[k] ?? k

  const value = useMemo(() => ({ lang, setLang, t }), [lang])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  return useContext(I18nContext)
}
