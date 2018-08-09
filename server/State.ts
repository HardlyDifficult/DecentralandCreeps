import { updateAll } from './ConnectedClients'
import { Vector2Component } from 'metaverse-api'
import { IEntityProps } from './components/Entity'
import { IScoreBoardProps } from './components/ScoreBoard'
import { ITrapProps} from './components/Trap'

let state: {
  grid: boolean[][], 
  path: Vector2Component[],
  entities: IEntityProps[],
  traps: ITrapProps[],
  score: IScoreBoardProps,
} = {
  grid: [], 
  path: [],
  entities: [],
  traps: [],
  score: {humanScore: 0, blobScore: 0},
};

export function getState(): typeof state 
{
  return state
}

export function setState(deltaState: Partial<typeof state>) 
{
  state = { ...state, ...deltaState }
  console.log('new state:')
  console.dir(state)
  updateAll()
}
