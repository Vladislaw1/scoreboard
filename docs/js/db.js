import {generatorId, readImageAsBase64} from "./utils.js";
import {renderTeamList} from "./ui.js";

function initDB(){
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('teams',1);

        request.onerror = () => reject('IndexDB init error')

        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded  = (event) => {
            const db = event.target.result;

            if(!db.objectStoreNames.contains('teams')) {
                db.createObjectStore('teams', {
                    keyPath: 'id',
                    autoIncrement: true
                })
            }
        }
    })
}

export async function addTeam({ name, image, select }) {
        const db = await initDB();
        const tx = db.transaction('teams','readwrite');

        const store = tx.objectStore('teams',1);

        const team = {name, image, select }

        return new Promise((resolve, reject) => {
            const request = store.add(team);

            request.onsuccess = (e) => {
                const id = e.target.result;
                resolve({ ...team, id }); // якщо хочеш одразу мати id

                renderTeamList()
            };

            request.onerror = () => reject(request.error);
        })
}

export const updateTeam = async (selectedId,slot) => {
    const db = await initDB();
    const tx = db.transaction('teams', 'readwrite');
    const store = tx.objectStore('teams');

    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onerror = () => reject(request.error);

        request.onsuccess = () => {
            const teams = request.result;

            for (const team of teams) {
                if (team.select === slot || team.id === selectedId) {
                    team.select = (team.id === selectedId) ? slot : null;
                    store.put(team);
                }
            }

            resolve();
        };
    });
};

export async function getAllTeams() {
    const db = await initDB();
    const tx = db.transaction('teams','readonly');

    const store = tx.objectStore('teams');

    return new Promise((resolve, reject) => {
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    })
}

export async function getTeamById(id) {
    const db = await initDB();
    const tx = db.transaction('teams','readonly');

    const store = tx.objectStore('teams');

    return new Promise((resolve, reject) => {
        const request = store.get(id);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
    })
}