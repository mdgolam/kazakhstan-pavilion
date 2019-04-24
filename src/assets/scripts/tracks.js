import React from "react";
import SVG from "react-inlinesvg";
const PlayIcon = require("../images/icons/play-icon.svg");
const PauseIcon = require("../images/icons/pause-icon.svg");

export default class Track extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      duration: null,
      percent: 0
    };

    this.handlePlayPauseClick = this.handlePlayPauseClick.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
  }

  componentDidMount() {
    const { audio } = this;

    audio.onplay = () => {
      const { duration } = audio;
      this.setState({
        duration: duration
      });
      this.currentTimeInterval = setInterval(() => {
        const { currentTime } = audio;
        const percent = Math.round((currentTime / duration) * 100);
        this.setState({
          percent: percent
        });
      }, 50);
    };

    audio.onended = function() {
      this.handlePlayPause();
      clearInterval(this.currentTimeInterval);
      this.setState({
        percent: 0
      });
    }.bind(this);

    audio.onpause = () => {
      clearInterval(this.currentTimeInterval);
    };
  }

  componentDidUpdate() {
    const { playing } = this.props;
    const audio = this.audio;

    // console.log("componentDidUpdate")

    if (playing && audio.paused) {
      audio.play();
    }
    if (!playing && !audio.paused) {
      audio.pause();
      // this.audio.currentTime = 0; можно сделать! не знаю тоже, нужно ли это
      // this.slider.value = 0;
    }
  }

  componentWillUnmount() {
    clearInterval(this.currentTimeInterval);
  }

  handlePlayPause() {
    const { id, handleToggleClick } = this.props;
    handleToggleClick(id);
  }

  handlePlayPauseClick(e) {
    e.preventDefault();
    const { id, handleToggleClick } = this.props;
    handleToggleClick(id);
  }

  render() {
    const { source, name, playing } = this.props;
    const { percent } = this.state;

    return (
      <a
        className="track d-flex align-items-center mb-3"
        onClick={this.handlePlayPauseClick}
      >
        <Controls playing={playing} />
        <div className="track__meta w-100 text-left ml-1">
          <p className="track__name"> {name} </p>
          <Progress percent={percent} />
        </div>
        <audio ref={node => (this.audio = node)} src={source} />
      </a>
    );
  }
}

class Progress extends React.Component {
  render() {
    const { percent } = this.props;
    const style = { width: `${percent}%` };

    return (
      <div className="track__progress progress">
        <div
          className="progress__bar bg-primary"
          role="progressbar"
          aria-valuenow="25"
          aria-valuemin="0"
          aria-valuemax="100"
          style={style}
        />
      </div>
    );
  }
}

class Controls extends React.Component {
  render() {
    const { playing } = this.props;
    const src = playing ? PauseIcon : PlayIcon;

    return (
      <div className="play-pause-icon">
        <SVG src={src} />
      </div>
    );
  }
}
