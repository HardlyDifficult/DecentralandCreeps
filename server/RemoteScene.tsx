import * as DCL from 'metaverse-api'
import { setState, getState } from './State'
import { Vector2Component } from 'metaverse-api'
import { Entity, IEntityProps } from './components/Entity'
import { ScoreBoard } from './components/ScoreBoard'
import { Tile, ITileProps } from './components/Tile'
import { Trap, ITrapProps, TrapState } from './components/Trap'
import { Helpers } from './Helpers'

let objectCounter = 0;

export default class HouseScene extends DCL.ScriptableScene
{
  sceneDidMount() 
  {
    if(getState().grid.length == 0)
    {
      this.initGridAndTraps();
      setInterval(() =>
      {
        this.spawnEntity();
      }, 3000 + Math.random() * 17000);
    }
    else
    {
      for(const trap of getState().traps)
      {
        this.subToTrap(trap);
      }
    }
  }
  
  initGridAndTraps()
  {
    while(true)
    {
      try 
      {
        const gridInfo = generateGrid();
        setState({
          grid: gridInfo.grid,
          path: gridInfo.path,
          traps: [],
          entities: [],
        });
        this.spawnTrap();
        this.spawnTrap();

        break;
      }
      catch {}
    }
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

    this.eventSubscriber.on(trap.id + "LeverRight_click", () =>
    {
      if(trap.trapState != TrapState.PreparedOne)
      {
        return;
      }
      trap.trapState = TrapState.PreparedBoth;
      setState({traps: getState().traps});

      setTimeout(() =>
      {
        trap.trapState = TrapState.Fired;
        setState({traps:  getState().traps});
        let counter = 0;

        const interval = setInterval(() => 
        {
          for(const entity of getState().entities)
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
            clearInterval(interval);
            trap.trapState = TrapState.NotAvailable;
            setState({traps: getState().traps});

            setTimeout(() =>
            {
              let traps = getState().traps.slice();
              traps.splice(traps.indexOf(trap), 1)
              setState({traps});

              setTimeout(() =>
              {
                this.spawnTrap(); 
              }, 1000);
            }, 1000);
          }
        }, 100);
      }, 1000);
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
      if(getState().grid[position.x][position.y]
        && !getState().grid[position.x - 1][position.y]
        && !getState().grid[position.x + 1][position.y]
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

  spawnEntity()
  {
    for(const e of getState().entities)
    {
      if(JSON.stringify(e.gridPosition) == JSON.stringify(getStartPosition()))
      {
        return;
      }
    }

    let entity: IEntityProps = {
      id: "Entity" + objectCounter++,
      gridPosition: getStartPosition(),
      isDead: false,
    };
    setState({entities: [...getState().entities, entity]});

    let pathIndex = 1;
    const interval = setInterval(() =>
    {
      if(entity.isDead)
      {
        clearInterval(interval);
        return;
      }

      if(pathIndex >= getState().path.length)
      {
        let score = getState().score;
        score.blobScore++;
        setState({score});
        this.kill(entity);
      }
      else
      {
        entity.gridPosition = getState().path[pathIndex];
        pathIndex++;        
        setState({entities: getState().entities});
      }
    }, 2000); 
  }

  kill(entity: IEntityProps)
  {
    entity.isDead = true;
    setState({entities: getState().entities});

    setTimeout(() => 
    {
      let entities = getState().entities.slice();
      entities.splice(entities.indexOf(entity), 1);
      setState({entities: entities});
    }, 2000);
  }

  renderEntities()
  {
    return getState().entities.map((entity) =>
    {
      return Entity(entity);
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

function generateGrid(): {grid: boolean[][], path: Array<Vector2Component>}
{
  const grid = Array(20);
  for(let i = 0; i < grid.length; i++)
  {
    grid[i] = Array(20).fill(false);
  }

  const path = [];
  let position = getStartPosition();
  grid[position.x][position.y] = true;
  path.push(JSON.parse(JSON.stringify(position)));
  for(let i = 0; i < 2; i++)
  {
    position.y++;
    grid[position.x][position.y] = true;
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
      || grid[nextPosition.x][nextPosition.y]
      || getNeighborCount(grid, nextPosition) > 1)
    {
      continue;
    }
    position = nextPosition;
    path.push(JSON.parse(JSON.stringify(position)));
    grid[position.x][position.y] = true;
  }
  position.y++;
  grid[position.x][position.y] = true;
  path.push(JSON.parse(JSON.stringify(position)));
  return {grid, path};
}

function getNeighborCount(grid: boolean[][], position: Vector2Component)
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
    if(isValidPosition(neighbor) && grid[neighbor.x][neighbor.y])
    {
      count++;
    }
  }

  return count;
}