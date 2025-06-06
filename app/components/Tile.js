import React from 'react'

function Tile({ char, resultClass, isEditing }) {
  return (
    <div className={'tile ' + resultClass}>{char}</div>
  )
}

export default Tile;