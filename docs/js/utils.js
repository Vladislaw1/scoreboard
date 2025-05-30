import {state} from './state.js'
import {selectTeam} from "./selectTeam.js";

export const generatorId = () =>{
    return Math.random().toString(36).substring(2)
}

export function readImageAsBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result); // result = base64
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

export function generateTeamElement (team,keyTeam,listElement){
    const li = document.createElement('li');
    li.textContent = team.name;
    li.dataset.id = team.id;

    const teamId = Number(team.id);

    const isSelected = team.select === keyTeam
    const isDisabled = team.select && team.select !== keyTeam;

    // Додаємо стилі на обарну команду якщо така є
    if (isSelected) li.classList.add('selected')
    else li.classList.remove('selected');

    // Додаємо стилі на заборонену команду якщо така є
    if (isDisabled) li.classList.add('disabled');
    else li.classList.remove('disabled');

    li.addEventListener('click', () => {
        if (Number(state[keyTeam]?.id) !== teamId) {
            selectTeam(teamId, keyTeam);
        }
    });

    listElement.appendChild(li);
}