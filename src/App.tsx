import React, {useEffect} from 'react';
import * as d3 from "d3";
import './App.css';

const App = () => {
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
            .then(function (data: any) {
                data.features = [data.features[Math.floor(Math.random() * data.features.length)]]

                d3.select("#country-title")
                    .text(data.features[0].properties.name);

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
            })
    }, []);

    return (
        <div>
            <h1 id="country-title"></h1>
            <div id="svg-container"></div>
        </div>
    );
}

export default App;
