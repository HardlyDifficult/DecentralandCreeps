import * as DCL from 'metaverse-api'
import { Vector3Component } from 'metaverse-api';

export enum ButtonState
{
  Normal,
  Pressed,
}

export interface IButtonProps 
{
  id: string,
  position: Vector3Component,
  state: ButtonState,
  label: string,
}

export const Button = (props: IButtonProps) => 
{
  let buttonZ = 0;
  if(props.state == ButtonState.Pressed)
  {
    buttonZ = .06;
  }
  return (
    <entity
      position={props.position}>
      <cylinder
        id={props.id}
        position={{x: 0, y: 0, z: buttonZ}}
        transition={{
          position: {
            duration: 100,
          },
        }} 
        rotation={{x: 90, y: 0, z: 0}}
        scale={{x: .05, y: .2, z: .05}}
        color="#990000" 
        />
      <text 
        hAlign="left"
        value={props.label} 
        position={{x: .4, y: 0, z: -.15}}
        scale={.6}
      />
    </entity>
  )
}