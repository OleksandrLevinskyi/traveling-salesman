import React, {useEffect, useState} from 'react';
import {flag} from 'country-emoji';
import * as d3 from "d3";
import './App.css';
import {createRandomPoints, drawRandomCountryShape, createNewSvgElement} from "./utils/d3-utils";
import {createAdjacencyMatrix} from "./utils/math-utils";
import {launchAnimation} from "./utils/utils";

const App = () => {
    // todo: create a separate file with feature geojson
    const DATA_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
    const [countryName, setCountryName] = useState('');
    const [destinations, setDestinations] = useState<Array<any>>([]);

    useEffect(() => {
        const width = 500;
        const height = 500;

        const svg = createNewSvgElement(width, height);

        d3.json(DATA_URL)
            .then((data: any) => {
                drawRandomCountryShape(data, width, height);

                const path = svg.select('path');
                const destinations = createRandomPoints(20, path, svg);

                createAdjacencyMatrix(destinations);

                setCountryName(data.features[0].properties.name);
                setDestinations(destinations);
            });
    }, []);

    return (
        <div>
            <h1 id="country-title"></h1>
            <h1 className="large-text">{flag(countryName)}</h1>
            <div id="svg-container"></div>
            <p>Total cost: <span id="total-cost">0</span></p>
            <p>Total destinations: {destinations.length}</p>
            <button onClick={async () => await launchAnimation(destinations)}>Start</button>
        </div>
    );
}

export default App;
