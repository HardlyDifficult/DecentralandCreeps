import { updateAll } from './ConnectedClients'
import { Vector2Component } from 'metaverse-api'
import { ICreepProps } from './components/Creep'
import { ITrapProps} from './components/Trap'
import { IScoreBoardProps } from './components/ScoreBoard'
import { IButtonProps, ButtonState } from './components/Button'

let state: {
  path: Vector2Component[],
  creeps: ICreepProps[],
  traps: ITrapProps[],
  score: IScoreBoardProps,
  startButton: IButtonProps,
} = {
  path: [],
  creeps: [],
  traps: [],
  score: {humanScore: 0, creepScore: 0},
  startButton: {
    id: "newGame",
    position: {x: 18.65, y: .7, z: 18.75},
    state: ButtonState.Normal,
    label: "New Game",
  }
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
