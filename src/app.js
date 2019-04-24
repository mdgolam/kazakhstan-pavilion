// import 'bootstrap';
import './assets/styles/main.scss'

import React from "react"
import ReactDOM from "react-dom"
import Player from "./assets/scripts/player"

// class App extends React.Component {
//   constructor(props) {
//     super(props)
//   }
//   render() {
//     return (
//     <LocalizeProvider>
//       <Player />
//     </LocalizeProvider>
//     )
//   }
// }

document.addEventListener("DOMContentLoaded", () => {

  // const firstvideo = document.getElementById("root").dataset.firstvideo
  // const secondvideo = document.getElementById("root").dataset.secondvideo

  ReactDOM.render(<Player />, document.getElementById("root"))

})
