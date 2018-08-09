import * as DCL from 'metaverse-api'

export interface IScoreBoardProps 
{
  humanScore: number,
  blobScore: number,
}

export const ScoreBoard = (props: IScoreBoardProps) => 
{
  return (
    <entity
        position={{x: 18.99, y: 0, z: 19}}
    >
      <gltf-model
        src="../assets/ScoreRock/ScoreRock.gltf"
      />
      <text 
        value={props.humanScore.toString()}
        position={{x: -.4, y: .35, z: -.36}}
        fontSize={200}
        color={props.humanScore > props.blobScore ? "#22ff22" : "#ffffff"}
      />
      <text 
        value="humans"
        position={{x: -.4, y: .1, z: -.36}}
        fontSize={50}
      />
      <text 
        value="vs"
        position={{x: 0, y: .35, z: -.36}}
        fontSize={100}
      />
      <text 
        value={props.blobScore.toString()}
        position={{x: .4, y: .35, z: -.36}}
        fontSize={200}
        color={props.blobScore > props.humanScore ? "#ff2222" : "#ffffff"}
      />
      <text 
        value="blobs"
        position={{x: .4, y: .1, z: -.36}}
        fontSize={50}
      />
    </entity>
  )
}