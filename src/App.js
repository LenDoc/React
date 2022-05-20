import defaultLogo from './logo.svg'
import clock from './ClockFace.png'
import hoursImg from './ClockFace_H.png'
import minutesImg from './ClockFace_M.png'
import secondsImg from './ClockFace_S.png'
import './App.scss'
import thunk from 'redux-thunk'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import { useState, useEffect } from 'react'

const Content = ({children}) =>
<section className='Content'>
    {children}
</section>

//hw
//Spoiler
const Spoiler = ({ header = '+', open, children }) => {
  const [opened, setOpened] = useState(open)
  return (
    <>
      <button
        onClick={() => {
          setOpened(!opened)
        }}>
        spoiler
      </button>
      {!opened && children}
      {header}
    </>
  )
}
//RangeInput
const RangeInput = ({ min = 3, max = 10 }) => {
  const [state, setState] = useState('')
  return (
    <>
      <input
        value={state}
        type="number"
        style={{
          color: state.length > min && state.length < max ? 'green' : 'red',
        }}
        onChange={(e) => {
          setState(e.target.value)
        }}
      />
    </>
  )
}

// PasswordConfirm
const PasswordConfirm = ({ min = 5 }) => {
  const [checked, setChecked] = useState(true)
  const [passwordFirst, setPassFirst] = useState('')
  const [passwordSecond, setPassSecond] = useState('')
    /* пример для проверки value="qoqoqo777AAAA"*/
  const regexp = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]/g
  const valid = () =>
    passwordFirst.match(regexp) &&
    (passwordFirst.length && passwordSecond.length) > min &&
    passwordFirst == passwordSecond
  return (
    <>
      <input
        type={checked ? 'password' : 'text'}
        value={passwordFirst}
        onChange={(e) => {
          setPassFirst(e.target.value)
        }}
      />
      <input
        type={checked ? 'password' : 'text'}
        value={passwordSecond}
        onChange={(e) => {
          setPassSecond(e.target.value)
        }}
      />
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          setChecked(e.target.checked)
        }}
      />
      {/* 1) проверка через кнопку */}
      {/* <button disabled = {(passwordFirst.length && passwordSecond.length)<=min} 
  onClick={()=>{(valid())? ( console.log('ПАРОЛИ СОШЛИСЬ')) : (console.log('РАЗНЫЕ ПАРОЛИ :( '))}}> ПРОВЕРИТЬ НА СОВПАДЕНИЕ </button>
   */}
      {/* 2) проверка для отображения компонента на экране */}
      {valid() && <Content>УСПЕШНАЯ ВАЛИДАЦИЯ</Content>}
      {!valid() && <Content> НЕ УСПЕШНАЯ ВАЛИДАЦИЯ</Content>}
    </>
  )
}
const Timer = ({ seconds}) => {
  const [time, setTime] = useState(seconds)
  var timeMinutes = Math.floor((time % 3600) / 60)
  var timeHours = Math.floor(time / 60 / 60)
  var timeSeconds = time % 60
  var formatted = timeHours + ':' + timeMinutes + ':' + timeSeconds

  const [paused, setPaused] = useState(false)

  useEffect(() => {
     console.log('seconds', time)
    const interval = setInterval(
      () => !paused && time >0  ? setTime((time) => time - 1) : setTime((time) => time),
      1000)
    console.log('ВНАЧАЛЕ ЖИЗНИ КОМПОНЕНТА componentDidMount', interval)
    return () => {
      clearInterval(interval)
      console.log('ОЧИСТКА', interval)}
  }, [paused, time])

  console.log('ОБНОВЛЕНИЕ КОМПОНЕНТА', timeSeconds)
  return (
    <>
      <div>{formatted}</div>
      <button onClick={() => { setPaused(!paused)}}>
        PAUSE
      </button>
    </>
  )
}
const TimerControl = () => {
  const [timeHours, setHours] = useState(0)
  const [timeMinutes, setMinutes] = useState(0)
  const [timeSeconds, setSeconds] = useState(0)
  const [started, setStarted] = useState([])
  //console.log(' переданное время', hours, '   ', minutes, '   ', seconds)
  const allSeconds = timeHours * 3600 + timeMinutes * 60 + timeSeconds
  console.log('allSeconds = ', allSeconds)
  return (
    <>
      <input type="number" placeholder="hours" min="0" value={timeHours} 
      onChange={(e) => { setHours(+e.target.value) }}/>
      <input type="number" placeholder="minutes" min="0" value={timeMinutes}
        onChange={(e) => { setMinutes(+e.target.value)}}/>
      <input min="0" value={timeSeconds} type="number" placeholder="seconds"
        onChange={(e) => { setSeconds(+e.target.value) }}/>
  
      {started.map((item) => (
        <Timer key={item} seconds={allSeconds} />
      ))}
      <button onClick={() => { setStarted([Math.random(), ...started]) }}>
        START
      </button>
    </>
  )
}
const SecondsTimer = ({ seconds }) => <h1>{seconds}</h1>

const TimerContainer = ({ seconds=1000, refresh, render:Render }) => {
  
  const [time, setTime] = useState(seconds)
  //const [started, setStarted] = useState([])
 
  //console.log('до ', before)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
     let before = Math.floor(performance.now())
   // console.log('seconds', time)
    const interval = setInterval(() => {
      let after = Math.floor(performance.now())

      !paused && time > 0 ? setTime((time-(after-before)/1000))
      : setTime(time)
      // console.log('ПОСЛЕ', after)
      // console.log('TIME', time)
    }, refresh)
    // console.log('ВНАЧАЛЕ ЖИЗНИ КОМПОНЕНТА componentDidMount', 
    // interval, '   ', refresh)
    return () => {
      clearInterval(interval)
      // console.log('ОЧИСТКА', interval)
    }
  }, [paused, refresh, time])
  // console.log('ОБНОВЛЕНИЕ КОМПОНЕНТА', time)
  return (
    <>
    {/* <h1> ТУТ ВСЕ ВРЕМЯ Container {time} </h1> */}
     <button onClick={() => {setPaused(!paused)}}> PAUSE </button>
    <Render seconds={time} />
    
    {/* {started.map((item) => <Render key={item} seconds={time} />)}
    <button onClick={(()=>{setStarted([Math.random()])})}> START </button>
    */}
    </> 
  )
}

const Timer2 = ({ seconds }) => {
  var timeMinutes = Math.floor((seconds % 3600) / 60)
  var timeHours = Math.floor(seconds / 60 / 60)
  var timeSeconds = seconds % 60
  var formatted = timeHours + ':' + timeMinutes + ':' + timeSeconds.toFixed(2)
  return (
    <>
      <div>{formatted}</div>
    </>
  )
}

const Watch = ({
  seconds,
  myClock = clock,
  myHours = hoursImg,
  myMinutes = minutesImg,
  mySeconds = secondsImg,
}) => {
  var clockHours = Math.floor(seconds / 3600)
  console.log('hours', clockHours)
  var clockMinutes = Math.floor((seconds % 3600) / 60)

  var clockSeconds = seconds % 60
  console.log('hours', clockSeconds)
  var formatted = clockHours + ':' + clockMinutes + ':' + clockSeconds.toFixed(2)
  return (
    <>
      <div>{formatted}</div>
      <div>
        <img src={myClock} style={{ position: 'absolute' }} />
        <img src={myHours}  style={{ position: 'absolute',
         float: 'left', transform: `rotate(${(360 / 12) * clockHours}deg)`}}/>
        <img src={myMinutes} style={{ position: 'absolute', float: 'left',
         transform: `rotate(${(360 / 12 / 5) * clockMinutes}deg)`, }} />
        <img src={mySeconds} style={{ position: 'absolute', float: 'left', 
        transform: `rotate(${(360 / 12 / 5) * clockSeconds}deg)`}}
        />
      </div>
    </>
  )
}

const TimerControlContainer = ({render:Render, refresh=1000}) => {
  const [timeHours, setHours] = useState(0)
  const [timeMinutes, setMinutes] = useState(0)
  const [timeSeconds, setSeconds] = useState(0)
  const [started, setStarted] = useState([])
  //console.log(' переданное время', hours, '   ', minutes, '   ', seconds)
  const allSeconds = timeHours * 3600 + timeMinutes * 60 + timeSeconds
  console.log('allSeconds = ', allSeconds)
  return (
    <>
      <input type="number" placeholder="hours" min="0" value={timeHours} 
      onChange={(e) => { setHours(+e.target.value) }}/>
      <input type="number" placeholder="minutes" min="0" value={timeMinutes}
        onChange={(e) => { setMinutes(+e.target.value)}}/>
      <input min="0" value={timeSeconds} type="number" placeholder="seconds"
        onChange={(e) => { setSeconds(+e.target.value) }}/>
  
      {started.map((item) => (
        <TimerContainer key={item} seconds={allSeconds} refresh={refresh}  render = {Render}/> 
       
      ))}
      <button onClick={() => { setStarted([Math.random(), ...started]) }}>
        START
      </button>
    </>
  )
}


function App() {
  return (

      <div className="App">
        {/* <Header />
          <CLoginForm />
          <Main />
          <Footer /> */}

        {/* <Spoiler header={<h1>Заголовок</h1>} open>
          Контент 1<p>лорем ипсум траливали и тп.</p>
        </Spoiler>

        <Spoiler>
          <h2>Контент 2</h2>
          <p>лорем ипсум траливали и тп.</p>
        </Spoiler>
        <RangeInput />
        <RangeInput min={2} max={10} /> */}
        
        {/* <PasswordConfirm /> */}
        {/* <Timer /> */}
        <h1>TimerControl </h1> 
        <TimerControl /> 
        <br />
        {/* <TimerContainer seconds={1800} refresh={5000} render={SecondsTimer} /> */}
        <h1>TimerContainer </h1> 
        {/* <TimerContainer seconds={1800} refresh={100} render={Timer2 } /> */}
        {/* <TimerContainer seconds={14000} refresh={100} render={Watch} /> */}
        <TimerContainer render={Timer2}/>
  </div>
  )
}

export default App
