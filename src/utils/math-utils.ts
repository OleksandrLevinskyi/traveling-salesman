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
