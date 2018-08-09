export const Helpers = ({
    gridToWorld(gridPosition) {
        if (!gridPosition) {
            return { x: 0, y: 0, z: 0 };
        }
        return { x: gridPosition.x, y: 0, z: gridPosition.y };
    },
    plusVector2(a, b) {
        return { x: a.x + b.x, y: a.y + b.y };
    },
    plusVector3(a, b) {
        return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
    }
});
//# sourceMappingURL=Helpers.js.map