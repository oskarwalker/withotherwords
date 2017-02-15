import React from 'react'

const HelpDialogContent = ({ onClose }) => (
  <div className='help-dialog-content'>
    <h1>Med Andra Ord</h1>
    <p>Med andra ord går ut på att man beskriver ett ord för sina lagkamrater som ska gissa rätt ord. Utmaningen ligger i att man får endast använda andra ord för att beskriva ordet.</p>
    <p>I detta spel har varje lag varsin telefon med denna app installerad, det måste vara minst två lag.</p>
    <blockquote>
      <h3>Proffstips</h3>
      <p>Välj antalet omgångar efter antalet lagmedlemmar, så alla får spela.</p></blockquote>
    <p>Ett lag startar ett spel och sedan ansluter de andra lagen genom att ange spelets kod. Sedan kommer lagen i tur och ordning att förklara ordet som syns på skärmen, samtidigt som ett annat lag ger poäng. Det andra lagen kommer överens om vem som ger poäng.</p>
    <div className='illustrations'>
      <section>
        <p>Så här ser det ut för den som ska beskriva ett ord.</p>
        <img src='/static/img/Screen_shot_player.png' />
      </section>
      <section>
        <p>Och såhär för den som ska ge poäng.</p>
        <img src='/static/img/Screen_shot_referee.png' />
      </section>
    </div>
    <p className='help-end-note'>Det var allt, lycka till!</p>
    <button className='button-header button-right' onClick={onClose}>Stäng</button>
  </div>
)

export default HelpDialogContent
