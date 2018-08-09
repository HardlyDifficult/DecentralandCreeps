import * as DCL from 'metaverse-api'
import { Vector2Component } from 'metaverse-api';

export interface ICreepProps 
{
  id: string,
  gridPosition: Vector2Component,
  isDead: boolean,
}

export const Creep = (props: ICreepProps) => 
{
  return (
    <gltf-model
      id={props.id}
      src="../assets/BlobMonster/BlobMonster.gltf" 
      position={{x: props.gridPosition.x, y: .1, z: props.gridPosition.y}}
      lookAt={{x: props.gridPosition.x, y: 0, z: props.gridPosition.y}}
      skeletalAnimation={[
        {
          clip: "Walking",
          playing: !props.isDead
        },
        {
          clip: "Dying",
          playing: props.isDead
        },
      ]}
      transition={{
        position: {
          duration: 500,
        },
        lookAt: {
          duration: 250,
        }
      }}
    />
  )
}