import * as jscad from '@jscad/openjscad';
import JSCADScript from './JSCADScript';

const getJSCADPointsFromLines = polyLinePoints => [
    [polyLinePoints[0].x1, polyLinePoints[0].y1],
    ...polyLinePoints.map(({ x2, y2 }) => [x2, y2])
];

const reducer = (arrayOfPolylinePoints, currentPolyline) => [...arrayOfPolylinePoints, getJSCADPointsFromLines(currentPolyline)];
const isEmptyPolyLine = polyLine => polyLine.length > 0;

export default ({ additions, deletions}) => {
    additions = additions.filter(isEmptyPolyLine);
    deletions = deletions.filter(isEmptyPolyLine);

    additions = additions.length > 0 ? additions.reduce(reducer, []) : [];
    deletions = deletions.length > 0 ? deletions.reduce(reducer, []) : [];

    return jscad.compile(JSCADScript, { additions, deletions })
        .then(compiled => jscad.generateOutput('stla', compiled))
}