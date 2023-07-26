import React, {useEffect} from 'react';
import * as d3 from "d3";
import './App.css';

const App = () => {
    useEffect(() => {
        const svg = d3.select("svg"),
            width = +svg.attr("width"),
            height = +svg.attr("height");

        const projection = d3.geoMercator()
            .center([2, 47])                // GPS of location to zoom on
            .scale(980)                       // This is like the zoom
            .translate([width / 2, height / 2])

        d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
            .then(function (data: any) {
                data.features = data.features.filter((d: any) => {
                    console.log(d.properties.name);
                    return d.properties.name === "France"
                })

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
            <svg id="my_dataviz" width="400" height="300"></svg>
        </div>
    );
}

export default App;
