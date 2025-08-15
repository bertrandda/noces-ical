import { useState } from 'react'
import { createEvents } from 'ics'
import './App.css'
import names from './assets/fr.json'

function App() {
  const [selectedDate, setSelectedDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const generateIcsFile = async () => {
    if (!selectedDate) {
      alert('Veuillez sélectionner une date')
      return
    }

    setIsGenerating(true)

    try {
      const baseDate = new Date(selectedDate)

      const events = Object.keys(names).map(age => ({
        title: `${age}${Number(age) > 1 ? 'ème' : 'er'} Anniversaire de mariage - Noces ${names[age].determinant}${names[age].name} ${names[age].emoji}`,
        description: `Anniversaire des ${age} ${Number(age) > 1 ? 'ans' : 'an'} de mariage. Noces ${names[age].determinant}${names[age].name} ${names[age].emoji}`,
        start: [
          baseDate.getFullYear() + Number(age),
          baseDate.getMonth() + 1,
          baseDate.getDate(),
        ],
        end: [
          baseDate.getFullYear() + Number(age),
          baseDate.getMonth() + 1,
          baseDate.getDate() + 1,
        ],
        categories: ['anniversaire', 'mariage'],
      }))

      const { error, value } = createEvents(events)

      if (error) {
        console.error('Erreur lors de la création du fichier ICS:', error)
        alert('Erreur lors de la génération du fichier')
        return
      }

      const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `mariage-${baseDate.toISOString().split('T')[0]}.ics`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la génération du fichier')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="app">
      <div className="container">
        <h1>🎊 Générateur de calendrier d'Anniversaires de mariage 🎊</h1>
        <p className="subtitle">Ajoutez vos anniversaires de mariage à votre calendrier</p>

        <form className="wedding-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="wedding-date">
              📅 Date du mariage
            </label>
            <input
              id="wedding-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="date-input"
              required
            />
          </div>

          <button
            type="button"
            onClick={generateIcsFile}
            disabled={isGenerating || !selectedDate}
            className="download-btn"
          >
            {isGenerating ? '⏳ Génération...' : '⬇️ Télécharger le calendrier'}
          </button>
        </form>

        <div className="info-section">
          <h3>📋 Événements inclus</h3>
          <ul className="events-list">
            {Object.keys(names).map(age => (
              <li key={age}>{age}{Number(age) > 1 ? 'ème' : 'er'} Anniversaire - Noces {names[age].determinant}{names[age].name} {names[age].emoji}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App
