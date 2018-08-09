import * as DCL from 'metaverse-api';
import { Helpers } from '../Helpers';
export const Trap = (props) => {
    return (DCL.createElement("entity", null,
        DCL.createElement("gltf-model", { src: "../assets/Lever/LeverBlue.gltf", id: props.id + "LeverLeft", position: Helpers.gridToWorld(Helpers.plusVector2(props.gridPosition, { x: -1, y: 0 })), scale: .5, rotation: { x: 0, y: 90, z: 0 }, skeletalAnimation: [
                {
                    clip: "LeverOff",
                    playing: props.trapState <= 0
                },
                {
                    clip: "LeverOn",
                    playing: props.trapState == 1
                },
                {
                    clip: "LeverDeSpawn",
                    playing: props.trapState >= 3
                },
            ] }),
        DCL.createElement("gltf-model", { id: props.id, src: "../assets/SpikeTrap/SpikeTrap.gltf", position: Helpers.gridToWorld(props.gridPosition), skeletalAnimation: [
                {
                    clip: "SpikeUp",
                    playing: props.trapState == 3,
                },
                {
                    clip: "Despawn",
                    playing: props.trapState == 4
                },
            ], scale: .5 }),
        DCL.createElement("gltf-model", { id: props.id + "LeverRight", src: "../assets/Lever/LeverRed.gltf", position: Helpers.gridToWorld(Helpers.plusVector2(props.gridPosition, { x: 1, y: 0 })), scale: .5, rotation: { x: 0, y: 90, z: 0 }, skeletalAnimation: [
                {
                    clip: "LeverOff",
                    playing: props.trapState <= 0
                },
                {
                    clip: "LeverOn",
                    playing: props.trapState == 2
                },
                {
                    clip: "LeverDeSpawn",
                    playing: props.trapState >= 3
                },
            ] })));
};
//# sourceMappingURL=Trap.js.map