// import 'bootstrap';
import './assets/styles/main.scss'

import React from "react"
import ReactDOM from "react-dom"
import Player from "./assets/scripts/player"

document.addEventListener("DOMContentLoaded", () => {

  const firstvideo = document.getElementById("root").dataset.firstvideo
  const secondvideo = document.getElementById("root").dataset.secondvideo

  ReactDOM.render(
    <Player firstvideo={ firstvideo } secondvideo={ secondvideo } />,
    document.getElementById("root")
  )

})
