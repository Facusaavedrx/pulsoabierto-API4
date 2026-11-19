import '../styles/spinner.css'

function Spinner () {
  return (
    <div role='status' aria-live='polite' style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '30px 0' }}>
      <div className='sk-chase' aria-hidden='true'>
        {Array.from({ length: 6 }, (_, i) => <div className='sk-chase-dot' key={i} />)}
      </div>
      <span>Cargando cotizaciones…</span>
    </div>
  )
}

export default Spinner
