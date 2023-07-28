import React, {useEffect, useState} from 'react';
import {flag} from 'country-emoji';
import * as d3 from "d3";
import {createRandomPoints, drawRandomCountryShape, createNewSvgElement} from "./utils/d3-utils";
import {createAdjacencyMatrix} from "./utils/math-utils";
import {launchAnimation} from "./utils/utils";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Heading,
    HStack,
    Text,
} from "@chakra-ui/react";
import './App.css';
import {CustomSlider} from "./CustomSlider";

export const App = () => {
    // todo: create a separate file with feature geojson
    const DATA_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
    const [countryName, setCountryName] = useState('');
    const [destinations, setDestinations] = useState<Array<any>>([]);

    useEffect(() => {
        const width = 400;
        const height = 400;

        const svg = createNewSvgElement(width, height);

        d3.json(DATA_URL)
            .then((data: any) => {
                drawRandomCountryShape(data, width, height);

                const path = svg.select('path');
                const destinations = createRandomPoints(20, path, svg);
                const name = data.features[0].properties.name;

                d3.select('#circle-0')
                    .attr('fill', 'red');

                createAdjacencyMatrix(destinations);

                setCountryName(`${flag(name)} ${name} ${flag(name)}`);
                setDestinations(destinations);
            });
    }, []);

    return (
        <HStack>
            <Card margin='5' width='50%' id='card'>
                <CardHeader>
                    <Heading size='lg' textAlign='center'>
                        {countryName}
                    </Heading>

                    <Text marginX='20' textAlign='center'>
                        A company in {countryName} needs
                        to deliver goods in one go around the country, starting from their headquarters (indicated in
                        red). What is the best route to take?</Text>
                </CardHeader>

                <CardBody margin='auto'>
                    <span id="svg-container"></span>
                    <CustomSlider/>
                    <Button variant='solid' colorScheme='blue' width='100%'
                            onClick={async () => await launchAnimation(destinations)}>
                        Start Animation
                    </Button>
                </CardBody>
            </Card>
            <Card margin='5'>
                <CardHeader>
                    <Heading size='md'>Stats</Heading>
                </CardHeader>

                <CardBody>
                    <Text>Total cost: <span id="total-cost">0</span></Text>
                    <Text>Total destinations: {destinations.length}</Text>
                </CardBody>
            </Card>
        </HStack>
    );
}