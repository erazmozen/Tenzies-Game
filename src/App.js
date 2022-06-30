import React, { useState } from "react";
import Die from "./components/Die";
import "./index.css";
import { nanoid } from "nanoid";
import Confetti from 'react-confetti'

export default function App() {

  const [dice, setDice] = React.useState(allNewDice());
  const [tenzies, setTenzies] = React.useState(false)

  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    // .evety je array metoda kao if, koja radi na svim clanovima matrice
    // i ako svi ispunjavaju uslov vraca TRUE
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
      console.log("Game won!!")
  }
    console.log("State change")
  }, [dice])

  /**
   * Ovde koristimo useEffect kako bismo sinhonizovali ova dva
   * statea gore. Drugi paramter se povezuje na prvi state var.
   */

  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6),
      isHeld: false,
      id: nanoid(),
    }
  }
  // Ovo je samo helper funkcija da ne bismo imali ponavljanje koda

  function allNewDice() {

    /**
     * Plan:
     * Treba nam nacin na koji mozemo da generisemo 10 random
     * brojeva. Onda treba taj broj da pushujemo. Na kraju zelimo
     * da vratimo prozvod.
     */

    const newDice = [];
    // Pravimo promenljivu koja sadrzi praznu matricu
    for (let i = 0; i < 10; i++) {
      // Treba nam 10 tastera sa brojevima
      newDice.push(
        // U matricu za svaki od tastera saljemo objekat sa sledecim propovima
        // !!! Propovi skoljeni u generateNewDie() gore, ovde pozivamo
        generateNewDie()
      );
    }
    return newDice;
    // Vracamo sve u matricu
  }

  function rollDice() {
    if(!tenzies) {
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ? 
                die :
                generateNewDie()
        }))
    } else {
        setTenzies(false)
        setDice(allNewDice())
    }
}

  function holdDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id
      ? {...die, isHeld: !die.isHeld}
      : die
    }))
  }

  const diceElements = dice.map((die) => (
    // Pravimo novu variablu i u nju ubacujemo objekte koje dobijamo
    // tako sto mapujemo preko state variable
    <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={ () => holdDice(die.id) } />
    // Props koje zelimo da pratimo, vrv cemo ih menjati
  ));

  //   console.log(allNewDice())
  // // proveravamo kakva nam je amtrica

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">{diceElements}</div>
      <button
      className="roll-dice"
      onClick={rollDice}
      >
        {tenzies ? "New Game" : "Roll"}
      </button>
    </main>
  );
}
