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