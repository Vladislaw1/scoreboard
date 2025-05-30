import { state } from './state.js';
import {updateDisplay} from "./ui.js";

export const channel  = new BroadcastChannel('app-channel');

export function postMessage(msg) {
    channel.postMessage(msg);
}

export function subscribe(handler) {
    channel.addEventListener('message', handler);
}



function internalHandler(event) {
    if (event.data.type === 'REQUEST_SELECTED_TEAMS') {
        channel.postMessage({
            type: 'SELECT_TEAMS',
            team1: state.team1 ?? null,
            team2: state.team2 ?? null,
        });
    }

    if (event.data.type === 'REQUEST_COUNT') {
        channel.postMessage({
            type: 'COUNT',
            count1: state.count1 ?? 0,
            count2: state.count2 ?? 0,
        });
    }

    if (event.data.type === 'REQUEST_PARTY') {
        channel.postMessage({
            type: 'PARTY',
            countParty1: state.countParty1 ?? 0,
            countParty2: state.countParty2 ?? 0,
        });
    }
}

export const internalBroadcastHandler = internalHandler;

channel.addEventListener('message', internalBroadcastHandler);

window.addEventListener('beforeunload', () => {
    channel.removeEventListener('message', internalBroadcastHandler);
    channel.removeEventListener('message', subscribe);
});

export function unsubscribe(handler) {
    channel.removeEventListener('message', handler);
}

export function requestSelectedTeams() {
    channel.postMessage({ type: 'REQUEST_SELECTED_TEAMS' });
}

export function requestCount() {
    channel.postMessage({ type: 'REQUEST_COUNT' });
}

export function requestParty() {
    channel.postMessage({ type: 'REQUEST_PARTY' });
}

export function handleBroadcast(event) {
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
            break;

        case 'PARTY': {
            const key = data.id === 'incPartyBtn1' || data.id === 'decPartyBtn1' ? 'countParty1' : 'countParty2';
            state[key] = data.value;
            break;
        }
        case 'NEXT_PARTY':
            state.countParty = data.value;
            break;

        case 'RESET':
            state.count1 = data.value.count1;
            state.count2 = data.value.count2;
            break;

        case 'SHOW_PAUSE':
            state.pause = true;
            break;

        case 'SELECT_TEAMS':
            state[data.key] = data.value;
            break;

        case 'RESET_ALL':
            setState(data.value);
            break;
    }

    if (doTeams) requestSelectedTeams();
    if (doCount) requestCount();
    if (doParty) requestParty();

    updateDisplay(state);
}
