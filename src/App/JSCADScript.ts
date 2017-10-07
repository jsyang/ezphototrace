export default `
const extrusion = points => linear_extrude(
    { height: this.height || 10 },
    CAG.fromPoints(points)
).center('z');

function main({additions, deletions, height}) {
    
    const uAdditions = union(
        additions.map(extrusion.bind({height}))
    );

    const uDeletions = union(
        deletions.map(extrusion.bind({height}))
    );

    return uAdditions
        .subtract(uDeletions)
        .rotateY(90)
        .rotateZ(90);
}
`;