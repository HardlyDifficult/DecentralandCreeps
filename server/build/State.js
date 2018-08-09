import { updateAll } from './ConnectedClients';
let state = {
    grid: [],
    path: [],
    entities: [],
    traps: [],
    score: { humanScore: 0, blobScore: 0 },
};
export function getState() {
    return state;
}
export function setState(deltaState) {
    state = Object.assign({}, state, deltaState);
    console.log('new state:');
    console.dir(state);
    updateAll();
}
//# sourceMappingURL=State.js.map