import React, {useEffect, useState} from 'react';
import {flag} from 'country-emoji';
import * as d3 from "d3";
import './App.css';
import {calculateShortestPath, createAdjacencyMatrix, createRandomPoints, drawLine, removeLine} from "./utils";

const App = () => {
    const [countryName, setCountryName] = useState('');
    const [destinations, setDestinations] = useState<Array<any>>([]);

    useEffect(() => {
        const width = 500;
        const height = 500;

        const container = d3.select("#svg-container");
        container.selectChildren().remove();
        container.append('svg').attr('id', 'visual-area');

        const svg = d3.select("#visual-area");
        svg.attr("width", width);
        svg.attr("height", height);

        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            .then((data: any) => {
                data.features = [data.features[Math.floor(Math.random() * data.features.length)]]

                d3.select("#country-title")
                    .text(data.features[0].properties.name);
                setCountryName(data.features[0].properties.name);

                const projection = d3.geoMercator().fitSize([width, height], data);

                const p: any = d3.geoPath()
                    .projection(projection);

                svg.append("g")
                    .selectAll("path")
                    .data(data.features)
                    .join("path")
                    .attr("fill", "grey")
                    .attr("d", p)
                    .style("stroke", "none")

                const path = svg.select("path");

                const destinations = createRandomPoints(20, path, svg);
                setDestinations(destinations);
                createAdjacencyMatrix(destinations);
            });
    }, []);

    return (
        <div>
            <h1 id="country-title"></h1>
            <h1 className="large-text">{flag(countryName)}</h1>
            <div id="svg-container"></div>
            <p>Total cost: <span id="total-cost">0</span></p>
            <p>Total destinations: {destinations.length}</p>
            <button onClick={async () => {
                const dist = createAdjacencyMatrix(destinations)
                const solutions: any = {};
                const other = {'cost': 0}
                let ans = Infinity;
                let visited = new Set<number>();
                visited.add(0);
                ans = Math.min(ans, await calculateShortestPath(0, visited, dist, other, solutions) + dist[0][0]);

                // draw a final path
                const shortestPath = solutions[ans];
                for (let i = 1; i < shortestPath.length; i++) {
                    drawLine(shortestPath[i - 1], shortestPath[i]);
                }

                drawLine(shortestPath[shortestPath.length - 1], 0);
            }}>Start
            </button>
        </div>
    );
}

export default App;
