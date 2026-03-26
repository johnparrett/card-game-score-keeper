import React from 'react'
import { useI18n } from '../i18n'

export default function Settings({ theme, setTheme }: { theme: 'light' | 'dark', setTheme: (t: 'light' | 'dark') => void }) {
  const { lang, setLang, t } = useI18n()

  return (
    <div className="settings-row">
      <label>
        {t('language')}: 
        <select value={lang} onChange={e => setLang(e.target.value as any)}>
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
      </label>

      <label>
        {t('theme')}: 
        <select value={theme} onChange={e => setTheme(e.target.value as any)}>
          <option value="light">{t('light')}</option>
          <option value="dark">{t('dark')}</option>
        </select>
      </label>
    </div>
  )
}
