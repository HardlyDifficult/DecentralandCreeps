import * as DCL from 'metaverse-api';
export const ScoreBoard = (props) => {
    return (DCL.createElement("entity", { position: { x: 18.99, y: 0, z: 19 } },
        DCL.createElement("gltf-model", { src: "../assets/ScoreRock/ScoreRock.gltf" }),
        DCL.createElement("text", { value: props.humanScore.toString(), position: { x: -.4, y: .35, z: -.36 }, fontSize: 200, color: props.humanScore > props.blobScore ? "#22ff22" : "#ffffff" }),
        DCL.createElement("text", { value: "humans", position: { x: -.4, y: .1, z: -.36 }, fontSize: 50 }),
        DCL.createElement("text", { value: "vs", position: { x: 0, y: .35, z: -.36 }, fontSize: 100 }),
        DCL.createElement("text", { value: props.blobScore.toString(), position: { x: .4, y: .35, z: -.36 }, fontSize: 200, color: props.blobScore > props.humanScore ? "#ff2222" : "#ffffff" }),
        DCL.createElement("text", { value: "blobs", position: { x: .4, y: .1, z: -.36 }, fontSize: 50 })));
};
//# sourceMappingURL=ScoreBoard.js.map