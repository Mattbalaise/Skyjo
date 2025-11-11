import Box from '../../components/Box/Box.jsx'
import Card from '../../components/Card/Card'
import { designFrontCards, designBackCards } from '../../components/Card/cardsData'
import './Design.css'

function Design() {
  return (
    <div className="page design-page">  
      <Box /> 
      <p className="design-description">Cliquez sur une carte pour la retourner</p>
      <div className="cards-container">
        {designFrontCards.map((card) => (
          <Card 
            key={card.id}
            frontCard={card}
            backCard={designBackCards[0]}
          />
        ))}
      </div>
    </div>
  )
}

export default Design

