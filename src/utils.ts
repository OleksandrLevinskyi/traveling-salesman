import * as d3 from "d3";

export const createRandomPoints = (numPoints: number, path: any, svg: any) => {
    let i = 0;
    const bbox = path.node().getBBox();
    const destinations = [];

    while (i < numPoints) {
        const x = bbox.x + Math.random() * bbox.width;
        const y = bbox.y + Math.random() * bbox.height;

        const svgPoint = svg.node().createSVGPoint();
        svgPoint.x = x;
        svgPoint.y = y;

        if (path.node().isPointInFill(svgPoint)) {
            svg.append('circle')
                .attr('cx', x)
                .attr('cy', y)
                .attr('r', 5)
                .attr('id', `circle-${destinations.length}`)
                .attr('fill', 'black');

            destinations.push({x, y});
        }

        i++;
    }

    return destinations;
}

export const drawLine = (pointAIdx: any, pointBIdx: any, svg: any) => {
    const pointA = d3.select(`#circle-${pointAIdx}`);
    const pointB = d3.select(`#circle-${pointBIdx}`);

    svg.append('line')
        .attr('x1', pointA.attr('cx'))
        .attr('y1', pointA.attr('cy'))
        .attr('x2', pointB.attr('cx'))
        .attr('y2', pointB.attr('cy'))
        .attr('id', `line-${pointAIdx}-${pointBIdx}`)
        .style('stroke', 'black')
        .style('stroke-width', 2);
}

export const createAdjacencyMatrix = (destinations: Array<any>) => {
    const adjacencyMatrix = Array.from({length: destinations.length}, () => Array(destinations.length).fill(0));

    for (let r = 0; r < adjacencyMatrix.length; r++) {
        for (let c = 0; c < adjacencyMatrix[r].length; c++) {
            adjacencyMatrix[r][c] = getDistance(destinations[r], destinations[c]);
        }
    }

    return adjacencyMatrix;
}

const getDistance = (a: any, b: any) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
