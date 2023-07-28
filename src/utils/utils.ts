import {drawLine} from "./d3-utils";
import {createAdjacencyMatrix} from "./math-utils";
import {calculateShortestPath} from "./algo-utils";

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

export const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));