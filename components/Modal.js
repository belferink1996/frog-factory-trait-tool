import { useRef } from 'react'
import { Modal as MuiModal, Typography } from '@mui/material'

function CloseButton({ onClickClose }) {
  const ref = useRef(null)

  const closeStyles = {
    width: '24px',
    padding: '1px',
    position: 'absolute',
    top: '0.5rem',
    right: '0.5rem',
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

function Modal({ open, onClose, title = '', children, width, transparent, style = {} }) {
  const onClickClose = () => (onClose ? onClose() : null)

  return (
    <MuiModal
      open={open}
      onClose={onClickClose}
      sx={{
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <div
        className='scroll'
        style={{
          cursor: 'unset',
          minWidth: '55vw',
          maxWidth: '90vw',
          width: width || 'fit-content',
          minHeight: '45vh',
          maxHeight: '90vh',
          padding: '1rem',
          backgroundColor: transparent ? 'transparent' : 'var(--olive)',
          boxShadow: transparent ? 'none' : '0 0 42px #000',
          borderRadius: '1rem',
          color: 'var(--bright)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          outline: 'none',
          ...style,
        }}
      >
        {onClose ? <CloseButton onClickClose={onClickClose} /> : null}
        {title ? <Typography variant='h5'>{title}</Typography> : null}
        {children}
      </div>
    </MuiModal>
  )
}

export default Modal
