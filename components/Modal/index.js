import { useState, useEffect, useRef } from 'react'

export default function Modal({ onClickClose, children, width, transparent }) {
  const [opacity, setOpacity] = useState(0)
  useEffect(() => setOpacity(1), [])

  const bgStyles = {
    opacity: opacity,
    zIndex: '999',
    width: '100vw',
    height: '100vh',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    placeItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    transition: 'opacity 0.3s linear',
  }

  const modalStyles = {
    minHeight: '100px',
    width: width || 'fit-content',
    padding: '20px 25px',
    backgroundColor: transparent ? 'transparent' : 'var(--olive)',
    boxShadow: transparent ? 'none' : '0 0 42px #000',
    borderRadius: '1rem',
    color: 'var(--bright)',
    position: 'relative',
  }

  return (
    <div style={bgStyles}>
      <div style={modalStyles}>
        {onClickClose ? <CloseButton onClickClose={onClickClose} /> : null}
        {children}
      </div>
    </div>
  )
}

function CloseButton({ onClickClose }) {
  const ref = useRef(null)

  const closeStyles = {
    width: '24px',
    padding: '1px',
    position: 'absolute',
    top: '7px',
    right: '7px',
    backgroundColor: 'var(--frog)',
    border: 'none',
    borderRadius: '100%',
    color: 'var(--olive)',
    fontSize: '19px',
    fontWeight: '600',
    textAlign: 'center',
    cursor: 'pointer',
  }

  const doHoverStyles = () => (ref.current.style.backgroundColor = 'var(--bright)')
  const undoHoverStyles = () => (ref.current.style.backgroundColor = 'var(--frog)')

  return (
    <button ref={ref} style={closeStyles} onClick={onClickClose} onMouseEnter={doHoverStyles} onMouseLeave={undoHoverStyles}>
      &times;
    </button>
  )
}
