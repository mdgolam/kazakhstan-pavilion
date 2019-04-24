import React from "react"
import Slider from "./slider"
import LocalizedStrings from "react-localization"
import { BrowserView, MobileView } from "react-device-detect"


export default class Player extends React.Component {
  constructor(props) {
    super(props)

    let strings = new LocalizedStrings({
      en: {
        start: "Start",
        pavillion: "The pavilion of the Kazakh SSR",
        contact: "Contact",
        contactText: "Dear viewer, ",
        contactText2:
        "if you'd like to get in contact with us for any reason, please email. We are looking forward to feedback and collaborations.",
        team: "Team",
        close: "Close",
        wait: "We are sorry,",
        wait2: "but you need to wait",
        left: "Left",
        rigth: "Right",
        sorry: "Извините,",
        sorry2: "этот сайт не поддерживает мобильную версию.",
        sorry3: "Пожалуйста, используйте компьютер.",
        teamprofessions: {
          first: "Creator",
          second: "Director",
          third: "Director  of Photography",
          fourth: "Code",
          fifth: "Text",
          sixth: "Russian Speaker",
          seventh: "English speaker",
          eights: "Assistant",
          nineth: "Music",
          tenth: ""
        },
        teammembers: {
          first: "Anastassiya Aiguzina",
          second: "Mikhail Goncharov",
          third: "Konstantin Glukhov",
          fourth: "Vladislav Md Golam",
          fifth: "Anastassiya Aiguzina, Ilya Ivanov",
          sixth: "Dmitriy Cherne",
          seventh: "Polina Erokhina",
          eights: "Ekaterina Makarovskaya",
          nineth: "Gevork Arutyunyan",
          tenth: "Special thanks to Evgenia Byshik."
        }
      },
      ru: {
        start: "Начать",
        pavillion: "Павильон Казахской ССР",
        contact: "Контакты",
        team: "Команда",
        close: "Закрыть",
        wait: "Пожалуйста,",
        wait2: "подождите немного",
        left: "Левый",
        rigth: "Правый",
        sorry: "We are sorry,",
        sorry2: "but this website does not have a mobile version.",
        sorry3: "Please use desktop.",
        contactText: "Дорогой зритель, ",
        contactText2: "мы будем рады любому вашему мнению",
        teamprofessions: {
          first: "Создатель",
          second: "Режиссер",
          third: "Оператор",
          fourth: "Код",
          fifth: "Текст",
          sixth: "Русскоязычный диктор",
          seventh: "Англоязычный диктор",
          eights: "Ассистент",
          nineth: "Композитор",
          tenth: ""
        },
        teammembers: {
          first: "Анастасия Айгузина",
          second: "Михаил Гончаров",
          third: "Константин Глухов",
          fourth: "Владислав Мд Голам",
          fifth: "Анастасия Айгузина, Илья Иванов",
          sixth: "Дмитрий Чернэ",
          seventh: "Полина Ерохина",
          eights: "Екатерина Макаровская",
          nineth: "Геворк Арутюнян",
          tenth: "Отдельная благодарность Евгении Бышик."
        }
      }
    })

    this.state = {
      balance: 0,
      firstVideo: null,
      loaded: false,
      showTeam: false,
      showContact: false,
      strings: strings,
      playing: false
      // playing: true // ONLY DEV
    }

    this.handleBalanceChange = this.handleBalanceChange.bind(this)
    this.handlePlayClick = this.handlePlayClick.bind(this)
    this.handlePlayPause = this.handlePlayPause.bind(this)
    this.initiateChannels = this.initiateChannels.bind(this)
    this.loaded = this.loaded.bind(this)
    this.setEnglish = this.setEnglish.bind(this)
    this.setRussian = this.setRussian.bind(this)
    this.toggleContactModal = this.toggleContactModal.bind(this)
    this.toggleTeamModal = this.toggleTeamModal.bind(this)
  }

  handleBalanceChange(x) {
    const { gainLeft, gainRight, secondGainLeft, secondGainRight } = this.state
    const leftChannelOfFirstVid = ((-Math.abs(x) - x) / 2 + 100) / 100
    const rightChannelOfFirstVid = (Math.abs(x) - x) / 2 / 100

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
    const { firstVideo, secondVideo, playing } = this.state

    if (!playing) {
      firstVideo.play()
      secondVideo.play()
    } else {
      firstVideo.pause()
      secondVideo.pause()
    }
    this.setState({
      playing: !playing
    })
  }

  setEnglish() {
    const { firstVideo, secondVideo } = this.state
    let { strings } = this.state
    strings.setLanguage("en")
    this.handlePlayPause()
    this.setState({
      loaded: false,
    })

    firstVideo.load()
    secondVideo.load()
  }

  setRussian() {
    const { firstVideo, secondVideo } = this.state
    let { strings } = this.state
    strings.setLanguage("ru")

    this.handlePlayPause()
    this.setState({
      loaded: false
    })

    firstVideo.load()
    secondVideo.load()
    
  }

  initiateChannels() {
    const { firstVideo, secondVideo } = this.state
    let { firstSource, secondSource } = this.state

    
    if (firstSource == undefined) {

      const firstAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const secondAudioCtx = new (window.AudioContext || window.webkitAudioContext)()
      firstSource = firstAudioCtx.createMediaElementSource(firstVideo)
      secondSource = secondAudioCtx.createMediaElementSource(secondVideo)

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
        firstSource: firstSource,
        secondSource: secondSource,
        secondGainLeft: secondGainLeft,
        secondGainRight: secondGainRight
      })
    }


  }

  handlePlayClick() {
    const { firstAudioCtx } = this.state

    if (firstAudioCtx == null) {
      // console.log("null")
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

  loaded() {
    const { firstVideo, secondVideo } = this.state

    if (firstVideo.readyState && secondVideo.readyState) {
      this.setState({
        // loaded: false // ONLY DEV
        loaded: true
      })
    }
  }

  toggleTeamModal() {
    const {showTeam} = this.state
    this.setState({
      showTeam: !showTeam
    })
  }

  toggleContactModal() {
    const {showContact} = this.state
    this.setState({
      showContact: !showContact
    })
  }

  render() {
    // console.log(strings.getLanguage())

    const { balance, loaded, playing, strings, showTeam, showContact } = this.state
    let modal = null

    if (!loaded) {

      modal = (
        <div
          id="exampleModalLive"
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLiveLabel"
          aria-modal="true"
        >
          <div className="modal-dialog h-100" role="document">
            <div className="h-100 justify-content-center modal-content align-items-center">
              <h1 className="text-left wait">
                { strings.wait }<br/>
                { strings.wait2 }
              </h1>
            </div>
          </div>
        </div>
      )
    } else if (!playing) {

      modal = (
        <div
          id="exampleModalLive"
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalLiveLabel"
          aria-modal="true"
          ref={ref => {
            this.modal = ref
          }}
        >
          <div className="modal-dialog h-100" role="document">
            <div className="h-100 justify-content-center modal-content align-items-center">
              <h1 className="text-left link" onClick={this.handlePlayClick}>
                {strings.start}
              </h1>
            </div>
          </div>
        </div>
      )
    } else if (showTeam) {
      modal = (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog h-100" role="document">
            <div className="h-100 modal-content align-items-center p-5">
              <div className="align-items-end modal-header w-100">
                <h1 className="col-6 offset-3 text-uppercase">
                  {strings.team}
                </h1>
                <div
                  className="col-3 text-right link"
                  onClick={this.toggleTeamModal}
                >
                  {strings.close}
                </div>
              </div>
              <div className="modal-body team-members w-100 row  mt-5">
                <div className="col-6 text-right">
                  <div className="">{strings.teamprofessions.first}</div>
                  <div className="">{strings.teamprofessions.second}</div>
                  <div className="">{strings.teamprofessions.third}</div>
                  <div className="">{strings.teamprofessions.fourth}</div>
                  <div className="">{strings.teamprofessions.fifth}</div>
                  <div className="">{strings.teamprofessions.sixth}</div>
                  <div className="">
                    {strings.teamprofessions.seventh}
                  </div>
                  <div className="">{strings.teamprofessions.eights}</div>
                  <div className="">{strings.teamprofessions.nineth}</div>
                  <div className="">{strings.teamprofessions.tenth}</div>
                </div>
                <div className="col-6 text-left">
                  <div className="">{strings.teammembers.first}</div>
                  <div className="">{strings.teammembers.second}</div>
                  <div className="">{strings.teammembers.third}</div>
                  <div className="">{strings.teamprofessions.fourth}</div>
                  <div className="">{strings.teamprofessions.fifth}</div>
                  <div className="">{strings.teamprofessions.sixth}</div>
                  <div className="">
                    {strings.teamprofessions.seventh}
                  </div>
                  <div className="">{strings.teamprofessions.eights}</div>
                  <div className="">{strings.teamprofessions.nineth}</div>
                  <div className="">{strings.teamprofessions.tenth}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else if (showContact) {
      modal = (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog h-100" role="document">
            <div className="h-100 justify-content-center modal-content align-items-center p-5">
              <div className="align-items-end modal-header w-100">
                <h1 className="col-6 offset-3 text-uppercase">
                  {strings.contact}
                </h1>
                <div
                  className="col-3 text-right link"
                  onClick={this.toggleContactModal}
                >
                  {strings.close}
                </div>
              </div>
              <div className="justify-content-center modal-body row w-100 mt-5">
                <div
                  className="text-center w-50"
                >
                  {strings.contactText}
                  {strings.contactText2}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else {
      modal = null
    }

    return (
      <React.Fragment>
        <MobileView>
          <div className="bg-light d-flex flex-column h-100 justify-content-center p-4 popover position-absolute rounded-0 w-100">
            <h4 className="text-left mb-0"> {strings.sorry} </h4>
            <h4 className="text-left mb-0"> {strings.sorry2} </h4>
            <h4 className="text-left"> {strings.sorry3} </h4>
          </div>
        </MobileView>
        {/* <BrowserView>
        <React.Fragment> */}
        {modal}

        <div className="d-flex flex-column justify-content-between w-100">
          <div className="player">
            <h1 className="text-uppercase">{strings.pavillion}</h1>
            <div className="d-flex videos justify-content-center">
              <div className="embed-responsive embed-responsive-4by3">
                <video
                  loop
                  className="embed-responsive-item first"
                  onLoadedData={this.loaded}
                  ref={ref => {
                    this.firstVideo = ref
                  }}
                >
                  <source
                    src={
                      "assets/video/f1" +
                      (strings.getLanguage() == "ru" ? "ru.mp4" : "en.mp4")
                    }
                  />
                  No video support.
                </video>
              </div>
              <div className="embed-responsive embed-responsive-4by3">
                <video
                  loop
                  onLoadedData={this.loaded}
                  className="embed-responsive-item second"
                  ref={ref => {
                    this.secondVideo = ref
                  }}
                >
                  <source
                    src={
                      "assets/video/f2" +
                      (strings.getLanguage() == "ru" ? "ru.mp4" : "en.mp4")
                    }
                  />
                </video>
              </div>
            </div>
          </div>
          <div className="player__controls">
            <div className="slider d-flex justify-content-center align-items-center">
              <div className="font-weight-bold">{strings.left}</div>
              <Slider
                min={-100}
                max={100}
                value={balance}
                handleValueChange={this.handleBalanceChange}
              />
              <div className="font-weight-bold">{strings.rigth}</div>
            </div>
          </div>

          <div className="align-items-end bottom d-flex justify-content-between">
            <div className="player__controls__lang d-flex justify-content-center">
              <div
                onClick={this.setEnglish}
                className={
                  "link mr-3 " +
                  (strings.getLanguage() == "ru" ? "" : "active")
                }
              >
                English
              </div>
              <div
                onClick={this.setRussian}
                className={
                  "link " + (strings.getLanguage() == "en" ? "" : "active")
                }
              >
                Русский
              </div>
            </div>

            <footer className="nav justify-content-center">
              <div className="px-2 link" onClick={this.toggleTeamModal}>
                {strings.team}
              </div>
              <div className="px-2 link" onClick={this.toggleContactModal}>
                {strings.contact}
              </div>
            </footer>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
