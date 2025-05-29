import { state } from './state.js';
import { updateDisplay } from './ui.js';
import { postMessage } from "./broadcast.js";
import { Teams } from '../assets/mock/teams.js';

export const selectTeam = (id,key) => {
    const team = Teams.find(t => t.id === id);

    if (!team) {
        console.warn(`Team with id=${id} not found`);
        return;
    }

    state[key] = team;

    postMessage({
        type: 'SELECT_TEAMS',
        key,
        value: state[key] ?? null
    });

    localStorage.setItem('selectedTeams', JSON.stringify({
        team1: state.team1 ?? null,
        team2: state.team2 ?? null,
    }));

    updateDisplay(state);
};