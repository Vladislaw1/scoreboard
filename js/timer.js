import {state,setState} from './state.js'

import {postMessage} from './broadcast.js'

export function startTimer() {
    clearInterval(state.intervalId)

    state.intervalId = setInterval(() => {
        state.seconds++
        if(state.seconds === 60){
            state.minutes++;
            state.seconds = 0;
        }

        postMessage({type: 'TIMER',minutes: state.minutes,seconds: state.seconds});
    },1000)
}

export const pauseTimer = () => {
    clearInterval(state.intervalId)
    setState({pause: true});
    postMessage({type: 'SHOW_PAUSE'});
}

export const stopTimer = () => {
    clearInterval(state.intervalId)
    setState({minutes: 0, seconds: 0});
    postMessage({type: 'TIMER',minutes: 0, seconds: 0});
}