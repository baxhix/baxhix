import legacyHtml from '../legacy/rheon-onepage-v3.html?raw'

function App() {
  return (
    <iframe
      title="Rheon Onepage Legacy"
      srcDoc={legacyHtml}
      style={{ width: '100%', height: '100vh', border: '0', display: 'block' }}
    />
  )
}

export default App
