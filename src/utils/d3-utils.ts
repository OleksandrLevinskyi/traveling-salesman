import * as d3 from 'd3';

export const createRandomPoints = (numPoints: number, path: any, svg: any) => {
    if (!path.node()) {
        return [];
    }

    let i = 0;
    const bbox = path.node().getBBox();
    const destinations = [];

    while (i < numPoints || destinations.length < 3) {
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

export const drawFinalPath = async (solutions: any, answer: number) => {
    const shortestPath = solutions[answer];

    for (let i = 1; i < shortestPath.length; i++) {
        drawLine(shortestPath[i - 1], shortestPath[i]);
    }

    drawLine(shortestPath[shortestPath.length - 1], 0);
    d3.select('#total-cost').text(answer);
}

export const drawRandomCountryShape = (data: any, width: number, height: number) => {
    data.features = [data.features[Math.floor(Math.random() * data.features.length)]]

    d3.select('#country-title')
        .text(data.features[0].properties.name);

    const projection = d3.geoMercator().fitSize([width, height], data);

    const p: any = d3.geoPath()
        .projection(projection);

    d3.select('#visual-area')
        .append('g')
        .selectAll('path')
        .data(data.features)
        .join('path')
        .attr('fill', 'grey')
        .attr('d', p)
        .style('stroke', 'none');
}

export const createNewSvgElement = (width: number, height: number) => {
    const container = d3.select('#svg-container');
    container.selectChildren().remove();
    container.append('svg').attr('id', 'visual-area');

    const svg = d3.select('#visual-area');
    svg.attr('width', width);
    svg.attr('height', height);

    return svg;
}