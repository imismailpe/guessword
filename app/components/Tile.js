import React from 'react'

function Tile({ char, resultClass, isEditing }) {
  return (
    <div className={'tile ' + resultClass} contenteditable={`${isEditing}`}>{char}</div>
  )
}

export default Tile;