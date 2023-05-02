import React from 'react'
import './dice.css'


export default function Dice() {
  return (<>
    <main className="container">
      <div className="dice-container">
        <div className="dice dice-one active" id="dice-1">
          <span className="dot"></span>
        </div>

        <div className="dice dice-two" id="dice-2">
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="dice dice-three" id="dice-3">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="dice dice-four" id="dice-4">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="dice dice-five" id="dice-5">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>

        <div className="dice dice-six" id="dice-6">
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
          <span className="dot"></span>
        </div>
      </div>
    </main>
    <button className="roll-button" id="rollButton">ROLL DICE</button>
  </>
  )
}
