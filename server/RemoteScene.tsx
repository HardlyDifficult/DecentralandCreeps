import * as DCL from 'metaverse-api'
import { setState, getState } from './State'
import { Vector2Component } from 'metaverse-api'
import { Button, ButtonState } from './components/Button'
import { Creep, ICreepProps } from './components/Creep'
import { ScoreBoard } from './components/ScoreBoard'
import { Tile, ITileProps } from './components/Tile'
import { Trap, ITrapProps, TrapState } from './components/Trap'
import { Helpers } from './Helpers'

function sleep(ms: number): Promise<void> 
{
  return new Promise(resolve => setTimeout(resolve, ms));
} 

let objectCounter = 0;
let gameInterval: NodeJS.Timer;

export default class CreepsScene extends DCL.ScriptableScene
{
  sceneDidMount() 
  {
    if(getState().path.length == 0)
    {
      this.newGame();
    }
    else
    {
      for(const trap of getState().traps)
      {
        this.subToTrap(trap);
      }
    }

    this.eventSubscriber.on("newGame_click", async () =>
    {
      let startButton = getState().startButton;
      startButton.state = ButtonState.Pressed;
      setState({startButton});
      await sleep(500);
      this.newGame();
      startButton.state = ButtonState.Normal;
      setState({startButton});
    });
  }

  async newGame()
  {
    while(true)
    {
      try 
      {
        setState({
          path: generatePath(),
          traps: [],
          creeps: [],
          score: {humanScore: 0, creepScore: 0},
        });
        this.spawnTrap();
        this.spawnTrap();
  
        break;
      }
      catch {}
    }
    clearInterval(gameInterval);
    gameInterval = setInterval(() =>
    {
      this.spawnEntity();
    }, 3000 + Math.random() * 17000);
  }
  
  spawnTrap()
  {
    let trap: ITrapProps = {
      id: "Trap" + objectCounter++,
      gridPosition: this.randomTrapPosition(),
      trapState: TrapState.Available,
    };
    setState({traps: [...getState().traps, trap]});
    this.subToTrap(trap);
  }

  subToTrap(trap: ITrapProps)
  {
    this.eventSubscriber.on(trap.id + "LeverLeft_click", () =>
    {
      if(trap.trapState != TrapState.Available)
      {
        return;
      }
      trap.trapState = TrapState.PreparedOne;
      setState({traps: getState().traps});
    });

    this.eventSubscriber.on(trap.id + "LeverRight_click", async () =>
    {
      if(trap.trapState != TrapState.PreparedOne)
      {
        return;
      }
      trap.trapState = TrapState.PreparedBoth;
      setState({traps: getState().traps});

      await sleep(1000);
      trap.trapState = TrapState.Fired;
      setState({traps:  getState().traps});
      let counter = 0;

      while(true)
      {
        await sleep(100);
        
        for(const entity of getState().creeps)
        {
          if(JSON.stringify(entity.gridPosition) == JSON.stringify(trap.gridPosition) && !entity.isDead)
          {
            this.kill(entity);
            let score = getState().score;
            score.humanScore++;
            setState({score});
          }
        }
        if(counter++ > 10)
        {
          trap.trapState = TrapState.NotAvailable;
          setState({traps: getState().traps});
          
          await sleep(1000);
          let traps = getState().traps.slice();
          traps.splice(traps.indexOf(trap), 1)
          setState({traps});
          
          await sleep(1000);
          this.spawnTrap(); 

          break;
        }
      };
    });
  }

  randomTrapPosition()
  {
    let counter = 0;
    while(true)
    {
      if(counter++ > 1000)
      {
        throw new Error("Invalid path, try again");
      }

      const position = getRandomGridPosition();
      if(getState().path.find((p) => p.x == position.x && p.y == position.y)
        && !getState().path.find((p) => p.x == position.x - 1 && p.y == position.y)
        && !getState().path.find((p) => p.x == position.x + 1 && p.y == position.y)
        && position.y > 2
        && position.y < 18
        && position.x > 2
        && position.x < 18
        && !getState().traps.find((t) => JSON.stringify(position) == JSON.stringify(t.gridPosition)))
      {
        return position;  
      }
    } 
  }

  async spawnEntity()
  {
    for(const e of getState().creeps)
    {
      if(JSON.stringify(e.gridPosition) == JSON.stringify(getStartPosition()))
      {
        return;
      }
    }

    let creep: ICreepProps = {
      id: "Creep" + objectCounter++,
      gridPosition: getStartPosition(),
      isDead: false,
    };
    setState({creeps: [...getState().creeps, creep]});

    let pathIndex = 1;
    while(true)
    {
      if(creep.isDead)
      {
        return;
      }

      if(pathIndex >= getState().path.length)
      {
        let score = getState().score;
        score.creepScore++;
        setState({score});
        this.kill(creep);
      }
      else
      {
        creep.gridPosition = getState().path[pathIndex];
        pathIndex++;        
        setState({creeps: getState().creeps});
      }

      await sleep(2000);
    }
  }

  async kill(creep: ICreepProps)
  {
    creep.isDead = true;
    setState({creeps: getState().creeps});

    await sleep(2000);
    let creeps = getState().creeps.slice();
    creeps.splice(creeps.indexOf(creep), 1);
    setState({creeps});
  }

  renderEntities()
  {
    return getState().creeps.map((creep) =>
    {
      return Creep(creep);
    });
  }

  renderTiles()
  {
    return getState().path.map((gridPosition) =>
    {
      const tileProps: ITileProps = {
        gridPosition
      };
      return Tile(tileProps);
    });
  }

  renderTraps()
  {
    return getState().traps.map((trap) =>
    {
      return Trap(trap);
    });
  }
  
  async render() 
  {
    return (
      <scene>
        <material
          id="floorTileMaterial"
          albedoTexture="./assets/StoneFloor.png"
        />
        <plane
          position={{x: 10, y: 0, z: 10}}
          rotation={{x: 90, y: 0, z: 0}}
          scale={19.99}
          color="#666666"
        />
        <gltf-model
          src="assets/Archway/StoneArchway.gltf"
          position={{x: 10, y: 0, z: 2}}
          rotation={{x: 0, y: 180, z: 0}}
          scale={{x: 1, y: 1, z: 1.5}}
        />
        <gltf-model
          src="assets/Archway/StoneArchway.gltf"
          position={Helpers.gridToWorld(getState().path[getState().path.length - 2])}
          scale={{x: 1, y: 1, z: 1.5}}
        />

        {Button(getState().startButton)}
        {this.renderTiles()}
        {this.renderTraps()}
        {this.renderEntities()}
        {ScoreBoard(getState().score)}
      </scene>
    )
  }
}

function getStartPosition(): Vector2Component
{
  return {x: 10, y: 1};
}

function isValidPosition(position: Vector2Component)
{
  return position.x >= 1 
    && position.x < 19 
    && position.y >= 1 
    && position.y < 19
    && (position.x < 18 || position.y < 18)
    && (position.x > 1 || position.y > 1);
}

function getRandomGridPosition()
{
  return {x: Math.floor(Math.random() * 19), y: Math.floor(Math.random() * 19)};
}

function generatePath(): Vector2Component[]
{
  const path: Vector2Component[] = [];
  let position = getStartPosition();
  path.push(JSON.parse(JSON.stringify(position)));
  for(let i = 0; i < 2; i++)
  {
    position.y++;
    path.push(JSON.parse(JSON.stringify(position)));
  }

  let counter = 0;
  while(position.y < 18)
  {
    if(counter++ > 1000)
    {
      throw new Error("Invalid path, try again");
    }
    let nextPosition = {x: position.x, y: position.y};
    switch(Math.floor(Math.random() * 3))
    {
      case 0:
        nextPosition.x += 1;
        break;
      case 1:
        nextPosition.x -= 1;
        break;
      default:
        nextPosition.y += 1;
    }
    if(!isValidPosition(nextPosition) 
      || path.find((p) => p.x == nextPosition.x && p.y == nextPosition.y)
      || getNeighborCount(path, nextPosition) > 1)
    {
      continue;
    }
    position = nextPosition;
    path.push(JSON.parse(JSON.stringify(position)));
  }
  position.y++;
  path.push(JSON.parse(JSON.stringify(position)));
  return path;
}

function getNeighborCount(path: Vector2Component[], position: Vector2Component)
{
  const neighbors: {x: number, y: number}[] = [
    {x: position.x + 1, y: position.y},
    {x: position.x - 1, y: position.y},
    {x: position.x, y: position.y + 1},
    {x: position.x, y: position.y - 1},
  ];

  let count = 0;
  for(const neighbor of neighbors)
  {
    if(isValidPosition(neighbor) && path.find((p) => p.x == position.x && p.y == position.y))
    {
      count++;
    }
  }

  return count;
}