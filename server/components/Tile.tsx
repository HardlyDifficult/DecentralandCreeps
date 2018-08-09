import * as DCL from 'metaverse-api'
import { Vector2Component } from 'metaverse-api';
import { Helpers } from '../Helpers'

export interface ITileProps 
{
  gridPosition: Vector2Component,
}

export const Tile = (props: ITileProps) => 
{
  return (
    <plane
      position={Helpers.plusVector3(
        Helpers.gridToWorld(props.gridPosition),
        {x: 0, y: .001, z: 0}
      )}
      material="#floorTileMaterial"
      rotation={{x: 90, y: 0, z: 0}}
    />
  )
}