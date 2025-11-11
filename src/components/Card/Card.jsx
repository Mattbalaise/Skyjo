import { useState } from 'react'
import './Card.css'

function Card({frontCard, backCard, onClick }) {
  const [isFlipped, setIsFlipped] = useState(true)

  const handleClick = () => {
    setIsFlipped(!isFlipped)
    if (onClick) {
      onClick()
    }
  }

  const cardFrontStyle = {
    '--card-color': frontCard.color,
    '--card-image': frontCard.backgroundImage ? `url(${frontCard.backgroundImage})` : 'none'
  }

  const cardBackStyle = {
    '--card-color': backCard.color,
    '--card-image': backCard.backgroundImage ? `url(${backCard.backgroundImage})` : 'none'
  }

  return (
    <div 
      className={`card-3d ${isFlipped ? 'flipped' : ''}`}
      onClick={handleClick}
    >
      <div className="card-inner">
        <div className="card-front" style={cardFrontStyle}>
        </div>
        <div className="card-back" style={cardBackStyle}>
        </div>
      </div>
    </div>
  )
}

export default Card

