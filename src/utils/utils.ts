import {drawFinalPath} from "./d3-utils";
import {createAdjacencyMatrix} from "./math-utils";
import {calculateShortestPath} from "./algo-utils";

export const launchAnimation = async (destinations: Array<any>) => {
    const dist = createAdjacencyMatrix(destinations);
    const solutions: any = {};
    const other = {'cost': 0};

    let answer = Infinity;
    let visited = new Set<number>([0]);

    answer = Math.min(answer, await calculateShortestPath(0, visited, dist, other, solutions) + dist[0][0]);

    console.log(destinations)
    console.log(solutions)
    console.log(answer)

    await drawFinalPath(solutions, answer);
}

export const pause = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));