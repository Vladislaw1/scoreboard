import {Teams} from '../assets/mock/teams.js'

import {state} from './state.js'

let els = {}

export function renderTeamList(onSelect) {
    if (!els.teamList1 || !els.teamList2) return;

    els.teamList1.textContent = '';
    els.teamList2.textContent = '';

    Teams.forEach(team => {
        const li = document.createElement('li');
        li.textContent = team.name;
        li.dataset.id = team.id;
        li.addEventListener('click', () => state.team2?.id !== team.id && onSelect(team.id,'team1'));
        els.teamList1.appendChild(li);
    });

    Teams.forEach(team => {
        const li = document.createElement('li');
        li.textContent = team.name;
        li.dataset.id = team.id;
        li.addEventListener('click', () => state.team1?.id !== team.id && onSelect(team.id,'team2'));
        els.teamList2.appendChild(li);
    });
}

export function initUI() {
    els = {
        minuteDiv:       document.getElementById('minute'),
        secondDiv:       document.getElementById('second'),
        counter1El:      document.getElementById('counter1'),
        counter2El:      document.getElementById('counter2'),
        party1El:        document.getElementById('party__count1'),
        party2El:        document.getElementById('party__count2'),
        numberPartyEl:   document.getElementById('number__party-value'),
        showPauseEl:     document.getElementById('show__pause-value'),
        teamList1:     document.getElementById('team-list1'),
        teamList2:     document.getElementById('team-list2'),
        logoTeam1:     document.getElementById('logo__team1'),
        logoTeam2:     document.getElementById('logo__team2'),
        nameTeam1:     document.getElementById('name1'),
        nameTeam2:     document.getElementById('name2'),
        nameWrapper1:     document.getElementById('name-wrapper1'),
        nameWrapper2:     document.getElementById('name-wrapper2'),
    }
}

export function updateDisplay(state) {
    const { minutes, seconds, count1, count2, countParty1, countParty2, countParty, pause, team1, team2 } = state;

    if (els.logoTeam1) els.logoTeam1.src = team1?.logo ?? '';
    if (els.logoTeam2) els.logoTeam2.src = team2?.logo ?? '';

    if (els.nameTeam1) els.nameTeam1.textContent = team1?.name ?? '';
    if (els.nameTeam2) els.nameTeam2.textContent = team2?.name ?? '';

    if (els.teamList1) {
        Array.from(els.teamList1?.children).forEach(li => {
            const id = li.dataset.id;
            if (team1 && id === String(team1.id)) {
                li.classList.add('selected');
            } else {
                li.classList.remove('selected');
            }

            if (team2 && id === String(team2.id)) {
                li.classList.add('disabled');
            } else {
                li.classList.remove('disabled');
            }

        });
    }

    if (els.teamList2) {
        Array.from(els.teamList2?.children).forEach(li => {
            const id = li.dataset.id;
            if (team2 && id === String(team2.id)) {
                li.classList.add('selected');
            } else {
                li.classList.remove('selected');
            }

            if (team1 && id === String(team1.id)) {
                li.classList.add('disabled');
            } else {
                li.classList.remove('disabled');
            }
        });
    }

    if (els.minuteDiv)   els.minuteDiv.textContent = minutes.toString().padStart(2,'0');
    if (els.secondDiv)   els.secondDiv.textContent = seconds.toString().padStart(2,'0');
    if (els.counter1El)  els.counter1El.textContent = count1;
    if (els.counter2El)  els.counter2El.textContent = count2;
    if (els.party1El)    els.party1El.textContent = countParty1;
    if (els.party2El)    els.party2El.textContent = countParty2;
    if (els.numberPartyEl) els.numberPartyEl.textContent = countParty;
    if (els.showPauseEl)   els.showPauseEl.textContent = pause ? 'PAUSE' : '';
}