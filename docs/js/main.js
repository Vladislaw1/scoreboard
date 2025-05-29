import {state, setState, initialState} from './state.js';
import { initUI, updateDisplay,renderTeamList } from './ui.js';
import {requestCount, requestParty, requestSelectedTeams, subscribe} from './broadcast.js';

import { selectTeam } from './selectTeam.js';

import * as Timer from './timer.js';
import * as Counter from './counter.js';

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    updateDisplay(state)
    renderTeamList(selectTeam);

    const saved = localStorage.getItem('selectedTeams');
    const savedCounts = localStorage.getItem('counts');
    const savedParty = localStorage.getItem('party');

    if (saved) {
        const { team1, team2 } = JSON.parse(saved);
        setState({ team1, team2 });
    }

    if (savedCounts) {
        const { count1, count2 } = JSON.parse(savedCounts);
        setState({ count1, count2});
    }

    if (savedParty) {
        const {countParty1,countParty2,countParty} = JSON.parse(savedParty);
        setState({countParty1,countParty2,countParty });
    }

    updateDisplay(state);

    subscribe(event => {
        const data = event.data;
        let doTeams = false;
        let doCount = false;
        let doParty = false;

        switch (data.type) {
            case 'TIMER':
                state.pause   = false;
                state.minutes = data.minutes;
                state.seconds = data.seconds;
                break;

            case 'COUNT':
                const key = data.id === 'counter1' ? 'count1' : 'count2';
                state[key] = data.value;
                doCount = true;
                break;

            case 'PARTY':
                state[
                    data.id === 'incPartyBtn1' ? 'countParty1' : 'countParty2'
                    ] = data.value;
                doParty = true;
                break;

            case 'NEXT_PARTY':
                state.countParty = data.value;
                doParty = true;
                break;

            case 'RESET':
                state.count1 = data.value.count1;
                state.count2 = data.value.count2;
                doCount = true;
                break;

            case 'SHOW_PAUSE':
                state.pause = true;
                break;

            case 'SELECT_TEAMS':
                state[data.key] = data.value;
                // **тут не просимо нову подію SELECT_TEAMS**
                break;

            case 'RESET_ALL':
                setState(data.value);
                doTeams = doCount = doParty = true;
                break;
        }

        // після switch – оновлюємо лише потрібні запити
        if (doTeams) requestSelectedTeams();
        if (doCount) doCount && requestCount();
        if (doParty) requestParty();

        // і не забуваємо оновити UI
        updateDisplay(state);
    });

    document.getElementById('startBtn')?.addEventListener('click', Timer.startTimer);
    document.getElementById('stopBtn')?.addEventListener('click', Timer.stopTimer);
    document.getElementById('pauseBtn')?.addEventListener('click', Timer.pauseTimer);

    document.getElementById('inc1')?.addEventListener('click', () => { Counter.incrementCounter('counter1'); updateDisplay(state); });
    document.getElementById('dic1')?.addEventListener('click', () => { Counter.decrementCounter('counter1'); updateDisplay(state); });

    document.getElementById('inc2')?.addEventListener('click', () => { Counter.incrementCounter('counter2'); updateDisplay(state); });
    document.getElementById('dic2')?.addEventListener('click', () => { Counter.decrementCounter('counter2'); updateDisplay(state); });

    document.getElementById('incPartyBtn1')?.addEventListener('click', () => { Counter.incrementCounterParty('incPartyBtn1'); updateDisplay(state); });
    document.getElementById('decPartyBtn1')?.addEventListener('click', () => { Counter.decrementCounterParty('decPartyBtn1'); updateDisplay(state); });

    document.getElementById('incPartyBtn2')?.addEventListener('click', () => { Counter.incrementCounterParty('incPartyBtn2'); updateDisplay(state); });
    document.getElementById('decPartyBtn2')?.addEventListener('click', () => { Counter.decrementCounterParty('decPartyBtn2'); updateDisplay(state); });


    document.getElementById('incParty')?.addEventListener('click', () => { Counter.nextParty(); updateDisplay(state); });
    document.getElementById('decParty')?.addEventListener('click', () => { Counter.prevParty(); updateDisplay(state); });

    document.getElementById('newMatch')?.addEventListener('click', () => { Counter.resetAll(); updateDisplay(state); });

})