const { CHAR_LEN } = require("../utils/constants");

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

function gameReducer(state, action = {}) {
  switch (action.type) {
    case "UPDATE":
      const updatedWords = [...state];
      updatedWords.splice(action.payload.position, 1, {
        id: action.payload.position,
        text: action.payload.data
      });
      return updatedWords
    default:
      return defaultWords;
  }
}
export default gameReducer;
