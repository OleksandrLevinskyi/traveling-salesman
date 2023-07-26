import React, {useEffect, useState} from 'react';
import {flag, code, name, countries} from 'country-emoji';
import * as d3 from "d3";
import './App.css';

const App = () => {
    const [totalCost, setTotalCost] = useState(0);
    const [countryName, setCountryName] = useState('');

    useEffect(() => {
        const width = 500;
        const height = 500;

        const container = d3.select("#svg-container");
        container.selectChildren().remove();
        container.append('svg');

        const svg = d3.select("svg");
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

                createRandomPoints(50, path, svg)
            })
    }, []);

    const createRandomPoints = (numPoints: number, path: any, svg: any) => {
        let i = 0;
        const bbox = path.node().getBBox();
        console.log(path.node())

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
                    .attr("fill", "black");
            }

            i++;
        }
    }

    return (
        <div>
            <h1 id="country-title"></h1>
            <h1 className="large-text">{flag(countryName)}</h1>
            <div id="svg-container"></div>
            <p>Total cost: {totalCost}</p>
        </div>
    );
}

export default App;
