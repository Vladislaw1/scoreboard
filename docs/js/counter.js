import {state,initialState,setState} from './state.js'

import {postMessage} from './broadcast.js'

export function incrementCounter(id) {
    if(id === 'counter1') state.count1++
    if(id === 'counter2') state.count2++

    postMessage({type:'COUNT', id, value: id === 'counter1' ? state.count1 : state.count2})

    localStorage.setItem('counts', JSON.stringify({
        count1: state.count1 ?? null,
        count2: state.count2 ?? null,
    }));
}

export function decrementCounter(id) {
    if(id === 'counter1' && state.count1 > 0) state.count1--
    if(id === 'counter2' && state.count2 > 0) state.count2--

    postMessage({type:'COUNT', id, value: id === 'counter1' ? state.count1 : state.count2 })

    localStorage.setItem('counts', JSON.stringify({
        count1: state.count1 ?? 0,
        count2: state.count2 ?? 0,
    }));
}

export function incrementCounterParty(id) {
    if (id === 'incPartyBtn1') state.countParty1++;
    if (id === 'incPartyBtn2') state.countParty2++;

    postMessage({
        type: 'PARTY',
        id,
        value: id === 'incPartyBtn1' ? state.countParty1 : state.countParty2
    });

    localStorage.setItem('party', JSON.stringify({
        countParty1: state.countParty1 ?? 0,
        countParty2: state.countParty2 ?? 0,
        countParty : state.countParty ?? 0,
    }));
}

export function decrementCounterParty(id) {
    if (id === 'decPartyBtn1' && state.countParty1 > 0) state.countParty1--;
    if (id === 'decPartyBtn2' && state.countParty2 > 0) state.countParty2--;

    postMessage({
        type: 'PARTY',
        id,
        value: id === 'decPartyBtn1' ? state.countParty1 : state.countParty2
    });

    localStorage.setItem('party', JSON.stringify({
        countParty1: state.countParty1 ?? 0,
        countParty2: state.countParty2 ?? 0,
        countParty : state.countParty ?? 1,
    }));
}

export function nextParty() {
    state.countParty++;

    setState({ count1:0, count2:0 });

    postMessage({type: 'NEXT_PARTY', value: state.countParty});

    postMessage({type: 'RESET', value: { count1: 0, count2: 0 }});

    localStorage.setItem('counts', JSON.stringify({
        count1: 0 ?? 0,
        count2: 0 ?? 0,
    }));

    localStorage.setItem('party', JSON.stringify({
        countParty1: state.countParty1 ?? 0,
        countParty2: state.countParty2 ?? 0,
        countParty : state.countParty ?? 1,
    }));
}

export function prevParty() {
    state.countParty--;

    postMessage({type: 'NEXT_PARTY', value: state.countParty});

    localStorage.setItem('party', JSON.stringify({
        countParty1: state.countParty1 ?? null,
        countParty2: state.countParty2 ?? null,
        countParty : state.countParty ?? null,
    }));
}


export function resetAll() {
    setState(initialState);

    postMessage({type: 'RESET_ALL', value: initialState});

    localStorage.clear()
}