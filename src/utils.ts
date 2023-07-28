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

export const drawLine = (pointAIdx: any, pointBIdx: any) => {
    const pointA = d3.select(`#circle-${pointAIdx}`);
    const pointB = d3.select(`#circle-${pointBIdx}`);

    if (!pointA.node() || !pointB.node()) {
        return;
    }

    d3.select('#visual-area')
        .append('line')
        .attr('x1', pointA.attr('cx'))
        .attr('y1', pointA.attr('cy'))
        .attr('x2', pointB.attr('cx'))
        .attr('y2', pointB.attr('cy'))
        .attr('id', `line-${pointAIdx}-${pointBIdx}`)
        .style('stroke', 'black')
        .style('stroke-width', 2);
}

export const removeLine = (pointAIdx: any, pointBIdx: any) => {
    d3.select(`#line-${pointAIdx}-${pointBIdx}`).remove();
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

const getDistance = (a: any, b: any) => Math.floor(Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)));

export const launchAnimation = async (destinations: Array<any>) => {
    const dist = createAdjacencyMatrix(destinations);
    const solutions: any = {};
    const other = {'cost': 0}
    let answer = Infinity;
    let visited = new Set<number>([0]);
    answer = Math.min(answer, await calculateShortestPath(0, visited, dist, other, solutions) + dist[0][0]);

    // draw a final path
    const shortestPath = solutions[answer];
    for (let i = 1; i < shortestPath.length; i++) {
        drawLine(shortestPath[i - 1], shortestPath[i]);
    }

    drawLine(shortestPath[shortestPath.length - 1], 0);
}

export const calculateShortestPath = async (i: number, visited: Set<number>, dist: Array<Array<number>>, other: any, solutions: any, memo: any = {}, speed: number = 5) => {
    if (visited.size === dist.length && visited.has(0) && visited.has(i)) {
        // draw the line
        await pause(speed);
        drawLine(i, 0);
        other.cost += dist[i][0];
        d3.select('#total-cost').text(other.cost);
        solutions[other.cost] = Array.from(visited);

        // remove the line
        await pause(speed);
        removeLine(i, 0);
        other.cost -= dist[i][0];
        d3.select('#total-cost').text(other.cost);

        return dist[i][0];
    }

    //todo: optimize with by sorting
    let key = Array.from(visited).join('-');

    if (key in memo) {
        return memo[key];
    }

    let res = Infinity;

    for (let j = 0; j < dist.length; j++) {
        if (j !== i && j !== 0 && !visited.has(j)) {
            visited.add(j);
            // draw a line
            await pause(speed);
            drawLine(i, j);
            console.log(other, dist[i][j]);
            other.cost += dist[i][j];
            d3.select('#total-cost').text(other.cost);

            let cost = await calculateShortestPath(j, visited, dist, other, solutions, memo) + dist[i][j];
            res = Math.min(res, cost);
            visited.delete(j);

            // remove a line
            await pause(speed);
            removeLine(i, j);
            other.cost -= dist[i][j];
            d3.select('#total-cost').text(other.cost);
        }
    }

    memo[key] = res;

    return memo[key];
}

const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));