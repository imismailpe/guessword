"use client";
import React, { useEffect, useReducer, useRef, useState } from "react";
import Row from "../components/Row";
import { ALPHABETS, CHAR_LEN } from "../utils/constants";
import gameReducer from "../reducers/game";

function GamePage() {
  const [solution, setSolution] = useState([]);
  const currentGuess = useRef("");
  const currentWord = useRef(0);
  const currentChar = useRef(0);
  const defaultWord = Array(CHAR_LEN).fill("_");
  const defaultWords = [
    {
      id: 0,
      text: defaultWord,
    },
    {
      id: 1,
      text: defaultWord,
    },
    {
      id: 2,
      text: defaultWord,
    },
    {
      id: 3,
      text: defaultWord,
    },
    {
      id: 4,
      text: defaultWord,
    },
    {
      id: 5,
      text: defaultWord,
    },
  ];

  const [highScore, setHighScore] = useState(0);
  const [isSolved, setIsSolved] = useState(false);

  const [words, dispatch] = useReducer(gameReducer, defaultWords);
  const [trials, setTrials] = useState(0);

  const getSolution = async () => {
    const res = await fetch(
      `https://random-word-api.vercel.app/api?words=1&length=${CHAR_LEN}`
    );
    const respJson = await res.json();
    setSolution(respJson[0].split(""));
  };
  const restoreHighest = () => {
    const highestCache = localStorage.getItem("guesswordHigh");
    setHighScore(parseInt(highestCache || 0, 10));
  };
  const resetGame = () => {
    currentWord.current = 0;
    currentChar.current = 0;
    currentGuess.current = "";
    setTrials(0);
    dispatch({
      type: "RESET",
    });
    getSolution();
    setIsSolved(false);
  };

  const updateStatus = () => {
    const isSolvedNow = solution.every((letter, position) => {
      return words.some(
        (word) => word.text[position].toLowerCase() === letter.toLowerCase()
      );
    });
    setIsSolved(isSolvedNow);
    if (isSolvedNow) {
      const newHigh = highScore + 1;
      localStorage.setItem("guesswordHigh", newHigh);
      setHighScore(newHigh);
    }
  };
  const updateWords = () => {
    const letters = [];
    for (let char of currentGuess.current) {
      letters.push(char);
    }
    let letterCount = letters.length;
    while (letterCount < CHAR_LEN) {
      letters.push("_");
      letterCount++;
    }
    dispatch({
      type: "UPDATE",
      payload: {
        position: currentWord.current,
        data: letters,
      },
    });
  };

  const handleKey = (e) => {
    if (trials >= 6 || isSolved) {
      return;
    }
    const { keyCode, key } = e;
    if (keyCode === 13 && currentChar.current === CHAR_LEN) {
      setTrials(trials + 1);
      currentChar.current = 0;
      currentWord.current += 1;
      currentGuess.current = "";
    } else if (currentChar.current < CHAR_LEN && keyCode > 64 && keyCode < 91) {
      //65 to 90 ATOZ
      currentGuess.current += key;
      updateWords(currentWord.current);
      currentChar.current += 1;
    } else if (keyCode === 8) {
      //backspace
      if (currentGuess.current.length) {
        currentGuess.current = currentGuess.current.slice(0, -1);
        updateWords();
        currentChar.current -= 1;
      }
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [trials, isSolved]);
  useEffect(() => {
    getSolution();
    restoreHighest();
  }, []);
  useEffect(() => {
    if (trials > 0) {
      updateStatus();
    }
  }, [trials]);
  return (
    <div className="px-4 py-4 flex items-center flex-col gap-2 ">
      <h4 className="font-semibold text-2xl">Guess Word</h4>
      <div className="flex gap-4 items-center justify-evenly">
        <div className="font-semibold">
          {isSolved
            ? "Won!"
            : trials === 6
            ? "Lost"
            : `Trials left: ${6 - trials}`}
        </div>
        {trials === 6 ? (
          <div className="font-semibold solution">Solution: {solution}</div>
        ) : null}
        <div className="font-semibold">Highest: {highScore}</div>
      </div>
      <div className="board">
        {words.map((word, index) => {
          return (
            <Row
              key={word.id}
              word={word.text}
              solution={solution}
              isCurrent={currentWord.current === index}
              currentChar={currentChar.current}
            />
          );
        })}
      </div>
      <div className="flex items-center flex-wrap justify-center gap-[4px]">
        {ALPHABETS.map((alpha) => (
          <button
            key={alpha.ascii}
            onClick={() =>
              handleKey({ key: alpha.letter, keyCode: alpha.ascii })
            }
            className="border border-gray-400 rounded p-2 w-auto min-w-[40px] h-10 hover:bg-gray-200 flex items-center justify-center text-center focus:outline-none"
          >
            {alpha.letter}
          </button>
        ))}
        <button
          key={13}
          onClick={() => handleKey({ key: "Enter", keyCode: 13 })}
          className="border border-gray-400 rounded p-2 w-auto min-w-[10px] h-10 bg-green-400 hover:bg-gray-200 flex items-center justify-center text-center focus:outline-none"
        >
          Enter
        </button>
        <button
          key={8}
          onClick={() => handleKey({ key: "Delete", keyCode: 8 })}
          className="border border-gray-400 rounded p-2 w-auto min-w-[10px] h-10 bg-orange-300 hover:bg-gray-200 flex items-center justify-center text-center focus:outline-none"
        >
          Delete
        </button>
      </div>
      <footer className="row-start-3 flex gap-[12px] flex-wrap items-center justify-center">
        <div className="flex gap-[8px] items-center justify-center">
          <div className="tile tile-sm correct">A</div> Letter is in exact position
        </div>
        <div className="flex gap-[8px] items-center justify-center">
          <div className="tile tile-sm close">B</div> Letter is present but not in exact
          position
        </div>
        <div className="flex gap-[8px] items-center justify-center">
          <div className="tile tile-sm incorrect">C</div> Letter is not present
        </div>
      </footer>
      <button
        className="flex items-center bg-blue-400 px-3 py-2 text-white rounded"
        onClick={resetGame}
      >
        New Game
      </button>
    </div>
  );
}

export default GamePage;
