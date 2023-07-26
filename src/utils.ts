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
            svg.append("circle")
                .attr("cx", x)
                .attr("cy", y)
                .attr("r", 5)
                .attr('id', destinations.length)
                .attr("fill", "black");

            destinations.push({x, y});
        }

        i++;
    }

    return destinations;
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