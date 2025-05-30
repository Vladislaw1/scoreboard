import { state } from './state.js';
import { updateDisplay } from './ui.js';
import { postMessage } from "./broadcast.js";
import {getAllTeams, updateTeam} from "./db.js";

export const selectTeam = async (id, key) => {
    const teams = await getAllTeams()

    const team = teams.find(t => t.id === id);

    await updateTeam(id,key)

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