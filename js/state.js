export const initialState = {
    team1: null,
    team2: null,
    minutes: 0,
    seconds: 0,
    count1: 0,
    count2: 0,
    countParty: 1,
    countParty1: 0,
    countParty2: 0,
    pause: false,
    intervalId: null,
};

export const state = {
    team1: null,
    team2: null,
    minutes: 0,
    seconds: 0,
    count1: 0,
    count2: 0,
    countParty: 1,
    countParty1: 0,
    countParty2: 0,
    pause: false,
    intervalId: null,
};

export function setState(updates) {
    Object.assign(state, updates);
}