import React from "react";
import Tile from "./Tile";
// import { CHAR_LEN } from "../utils/constants";

function Row({ word, solution, isCurrent, currentChar }) {
  return word.map((char, index) => {
    // const solutionPosition = index % CHAR_LEN;
    const resultClass = isCurrent || char === "_"
      ? ""
      : solution[index] === word[index]
      ? "correct"
      : solution.includes(char)
      ? "close"
      : "incorrect";

    return <Tile key={index} char={char} resultClass={resultClass} isEditing={isCurrent && currentChar === index} />;
  });
}

export default Row;
