import React from "react"
import Slider from "./slider"

export default class Player extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: 0,
      firstVideo: null
    }

    this.handleBalanceChange = this.handleBalanceChange.bind(this)
    this.handlePlayClick = this.handlePlayClick.bind(this)
    this.handlePlayPause = this.handlePlayPause.bind(this)
    this.initiateChannels = this.initiateChannels.bind(this)
  }

  handleBalanceChange(x) {
    const { gainLeft, gainRight, secondGainLeft, secondGainRight } = this.state
    const leftChannelOfFirstVid = ((-Math.abs(x) - x) / 2 + 100)/100
    const rightChannelOfFirstVid = ((Math.abs(x) - x) / 2)/100

    // change volume of both videos (4 channels) according to balance
    gainLeft.gain.value = leftChannelOfFirstVid
    gainRight.gain.value = rightChannelOfFirstVid

    secondGainLeft.gain.value = 1 - leftChannelOfFirstVid
    secondGainRight.gain.value = 1 - rightChannelOfFirstVid

    this.setState({
      balance: x,
      gainLeft: gainLeft,
      gainRight: gainRight,
      secondGainLeft: secondGainLeft,
      secondGainRight: secondGainRight
    })
  }

  handlePlayPause() {
    const { firstVideo, secondVideo } = this.state

    if (!firstVideo.isPlaying) {
      firstVideo.play()
      secondVideo.play()
    } else {
      firstVideo.pause()
      secondVideo.pause()
    }
  }

  initiateChannels() {
    const { firstVideo, secondVideo } = this.state
    const firstAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const firstSource = firstAudioCtx.createMediaElementSource(firstVideo)

    const secondAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const secondSource = secondAudioCtx.createMediaElementSource(secondVideo)
    const secondSplitter = secondAudioCtx.createChannelSplitter(2)
    const secondMerger = secondAudioCtx.createChannelMerger(2)
    const secondGainLeft = secondAudioCtx.createGain()
    const secondGainRight = secondAudioCtx.createGain()
    secondSource.connect(secondSplitter, 0, 0)
    secondSplitter.connect(secondGainLeft, 0)
    secondSplitter.connect(secondGainRight, 1)
    secondGainLeft.connect(secondMerger, 0, 0)
    secondGainRight.connect(secondMerger, 0, 1)
    secondMerger.connect(secondAudioCtx.destination, 0, 0)

    const splitter = firstAudioCtx.createChannelSplitter(2)
    const merger = firstAudioCtx.createChannelMerger(2)
    const gainLeft = firstAudioCtx.createGain()
    const gainRight = firstAudioCtx.createGain()

    gainLeft.gain.value = 1
    gainRight.gain.value = 0
    secondGainLeft.gain.value = 0
    secondGainRight.gain.value = 1

    firstSource.connect(splitter, 0, 0)

    // //Connect splitter' outputs to each Gain Nodes
    splitter.connect(gainLeft, 0)
    splitter.connect(gainRight, 1)

    // //Connect Left and Right Nodes to the Merger Node inputs
    gainLeft.connect(merger, 0, 0)
    gainRight.connect(merger, 0, 1)

    //Connect Merger output to context destination
    merger.connect(firstAudioCtx.destination, 0, 0)

    this.setState({
      gainLeft: gainLeft,
      gainRight: gainRight,
      secondGainLeft: secondGainLeft,
      secondGainRight: secondGainRight
    })
  }

  handlePlayClick() {
    const { firstAudioCtx, balance } = this.state

    if (firstAudioCtx == null) {
      this.initiateChannels()
    }
    
    this.handlePlayPause()
  }

  componentDidMount() {
    const firstVideo = this.firstVideo
    const secondVideo = this.secondVideo

    this.setState({
      firstVideo: firstVideo,
      secondVideo: secondVideo
    })
  }

  render() {
    const { balance } = this.state
    return (
      <React.Fragment>
        <div className="player">
          <h1>The pavilion of the Kazakh SSR</h1>
          <div className="d-flex videos justify-content-center">
            <div className="embed-responsive embed-responsive-4by3">
              <video
                loop
                className="embed-responsive-item first"
                ref={ref => {
                  this.firstVideo = ref
                }}
              >
                <source src="assets/video/film_1_en.mp4" />
                No video support.
              </video>
            </div>
            <div className="embed-responsive embed-responsive-4by3">
              <video
                src="assets/video/film_2_en.mp4"
                loop
                className="embed-responsive-item second"
                ref={ref => {
                  this.secondVideo = ref
                }}
              />
            </div>
          </div>
        </div>
        <div className="player__controls">
          <div className="player__controls__lang d-flex justify-content-center">
            <div className="mr-3">English</div>
            <div>Русский</div>
          </div>
          <div className="bg-dark text-white" onClick={this.handlePlayClick}>
            Start
          </div>
          <div className="slider d-flex justify-content-center align-items-center">
            <div>Left</div>
            <Slider
              min={-100}
              max={100}
              value={balance}
              handleValueChange={this.handleBalanceChange}
            />
            <div>Right</div>
          </div>
        </div>
        <footer>Moscow 2019 Team Contact</footer>
      </React.Fragment>
    )
  }
}
