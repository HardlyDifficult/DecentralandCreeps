import * as DCL from 'metaverse-api'
import { Vector2Component } from 'metaverse-api';

export interface ITileProps 
{
  gridPosition: Vector2Component,
}

export const Tile = (props: ITileProps) => 
{
  return (
    <plane
      position={{x: props.gridPosition.x, y: .01, z: props.gridPosition.y}}
      material="#floorTileMaterial"
      rotation={{x: 90, y: 0, z: 0}}
    />
  )
}