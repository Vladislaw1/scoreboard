import {state, setState} from './state.js';
import { initUI, updateDisplay,renderTeamList } from './ui.js';
import {
    handleBroadcast,
    subscribe,
    unsubscribe
} from './broadcast.js';


import * as Timer from './timer.js';
import * as Counter from './counter.js';
import {generatorId, readImageAsBase64} from "./utils.js";
import {addTeam} from "./db.js";

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    updateDisplay(state)
    renderTeamList();

    unsubscribe(handleBroadcast);

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

    subscribe(handleBroadcast);

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

    document.getElementById('file__team-form')?.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        const imageBase64 = await readImageAsBase64(file)

        const logoInForm = document.getElementById('team-logo-form')

        logoInForm.src = imageBase64;
    });

    document.getElementById('teamForm')?.addEventListener('submit', async (e) => {
        e.preventDefault()
        const nameInput  = document.getElementById('name__team-form');
        const fileInput  = document.getElementById('file__team-form');

        const name = nameInput.value;
        const image = fileInput.files[0];

        const select = null

        if(!image){
            alert('Please upload a image');
            return;
        }
        const imageBase64 = await readImageAsBase64(image)

        await addTeam({name, image:imageBase64, select});

        document.getElementById('team-logo-form').src = './assets/images/no-image2.png';

        nameInput.value = ''
        fileInput.value = ''

        alert('Command added to list')
    })
})

window.addEventListener('beforeunload', () => {
    unsubscribe(handleBroadcast);
});