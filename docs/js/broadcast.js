import { state } from './state.js';

export const channel  = new BroadcastChannel('app-channel');

export function postMessage(msg) {
    channel.postMessage(msg);
}

export function subscribe(handler) {
    channel.addEventListener('message', handler);
}

channel.addEventListener('message', event => {
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
