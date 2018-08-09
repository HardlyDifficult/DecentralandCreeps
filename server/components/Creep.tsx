import * as DCL from 'metaverse-api'
import { Vector2Component } from 'metaverse-api';
import { Helpers } from '../Helpers'

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
      position={Helpers.plusVector3(Helpers.gridToWorld(props.gridPosition), {x: 0, y: .1, z: 0})}
      lookAt={Helpers.gridToWorld(props.gridPosition)}
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