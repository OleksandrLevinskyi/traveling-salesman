import {drawLine, removeLine} from "./d3-utils";
import * as d3 from "d3";
import {pause} from "./utils";

export const calculateShortestPath = async (i: number, visited: Set<number>, dist: Array<Array<number>>, other: any, solutions: any, memo: any = {}, speed: number = 1) => {
    if (visited.size === dist.length && visited.has(0) && visited.has(i)) {
        await animateDrawLine(i, 0, dist, other, speed);
        solutions[other.cost] = Array.from(visited);
        await animateRemoveLine(i, 0, dist, other, speed);

        return dist[i][0];
    }

    let key = `${i}-${Array.from(visited).sort().join('-')}`;

    if (key in memo) {
        return memo[key];
    }

    let res = Infinity;

    for (let j = 0; j < dist.length; j++) {
        if (j !== i && j !== 0 && !visited.has(j)) {
            visited.add(j);
            await animateDrawLine(i, j, dist, other, speed);

            let cost = await calculateShortestPath(j, visited, dist, other, solutions, memo) + dist[i][j];
            res = Math.min(res, cost);
            visited.delete(j);

            await animateRemoveLine(i, j, dist, other, speed);
        }
    }

    memo[key] = res;

    return memo[key];
}

const animateDrawLine = async (i: number, j: number, dist: Array<Array<number>>, other: any, speed: number = 5) => {
    await pause(speed);
    drawLine(i, j);
    other.cost += dist[i][j];
    d3.select('#total-cost').text(other.cost);
}

const animateRemoveLine = async (i: number, j: number, dist: Array<Array<number>>, other: any, speed: number = 5) => {
    await pause(speed);
    removeLine(i, j);
    other.cost -= dist[i][j];
    d3.select('#total-cost').text(other.cost);
}