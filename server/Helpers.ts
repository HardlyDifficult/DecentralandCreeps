import { Vector2Component, Vector3Component } from 'metaverse-api'

export const Helpers = ({
  gridToWorld(gridPosition: Vector2Component): Vector3Component
  {
    if(!gridPosition)
    {
      return {x: 0, y: 0, z: 0};
    }
    return {x: gridPosition.x, y: 0, z: gridPosition.y};
  },

  plusVector2(a: Vector2Component, b: Vector2Component): Vector2Component
  {
    return {x: a.x + b.x, y: a.y + b.y};
  },

  plusVector3(a: Vector3Component, b: Vector3Component): Vector3Component
  {
    return {x: a.x + b.x, y: a.y + b.y, z: a.z + b.z};
  }
});