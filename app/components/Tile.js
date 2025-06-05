import React from 'react'

function Tile({ char, resultClass }) {
  return (
    <div className={'tile ' + resultClass}>{char}</div>
  )
}

export default Tile;