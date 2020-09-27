import { random } from './random.js'

export const setRandomInterval = (callback: Function, time: number) => {
  const loop = () => {
    callback()
    setTimeout(loop, random(random(time * 0.5, time), random(time, time * 1.5)))
  }

  loop()
}
