import * as DCL from 'metaverse-api'
import { Vector2Component } from 'metaverse-api';

export const enum TrapState 
{
  Available,
  PreparedOne,
  PreparedBoth,
  Fired,
  NotAvailable,
}

export interface ITrapProps 
{
  id: string,
  gridPosition: Vector2Component,
  trapState: TrapState,
}

export const Trap = (props: ITrapProps) => 
{
  return (
    <entity>
      <gltf-model
        src="../assets/Lever/LeverBlue.gltf"
        id={props.id + "LeverLeft"}
        position={{x: props.gridPosition.x - 1, y: 0, z: props.gridPosition.y}}
        scale={.5}
        rotation={{x: 0, y: 90, z: 0}}
        skeletalAnimation={[
          {
            clip:"LeverOff", 
            playing: props.trapState <= TrapState.Available
          },
          {
            clip:"LeverOn", 
            playing: props.trapState == TrapState.PreparedOne
          },
          {
            clip:"LeverDeSpawn", 
            playing: props.trapState >= TrapState.Fired
          },
        ]}
      />
      <gltf-model
        id={props.id}
        src="../assets/SpikeTrap/SpikeTrap.gltf"
        position={{x: props.gridPosition.x, y: 0, z: props.gridPosition.y}}
        skeletalAnimation={[
          {
            clip:"SpikeUp", 
            playing: props.trapState == TrapState.Fired,
          },
          {
            clip:"Despawn", 
            playing: props.trapState == TrapState.NotAvailable
          },
        ]}
        scale={.5}
      />
      <gltf-model
        id={props.id + "LeverRight"}
        src="../assets/Lever/LeverRed.gltf"
        position={{x: props.gridPosition.x + 1, y: 0, z: props.gridPosition.y}}
        scale={.5}
        rotation={{x: 0, y: 90, z: 0}}
        skeletalAnimation={[
          {
            clip:"LeverOff", 
            playing: props.trapState <= TrapState.Available
          },
          {
            clip:"LeverOn", 
            playing: props.trapState == TrapState.PreparedBoth
          },
          {
            clip:"LeverDeSpawn", 
            playing: props.trapState >= TrapState.Fired
          },
        ]}
      /> 
    </entity>
  )
}