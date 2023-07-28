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
    CardFooter,
    CardHeader,
    Heading, HStack, Slider,
    Text, VStack
} from "@chakra-ui/react";
import {CustomSlider} from "./CustomSlider";

export const App = () => {
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
        <HStack>
            <Card>
                <CardHeader>
                    <Heading size='md'>{flag(countryName)} <span id="country-title"></span> {flag(countryName)}
                    </Heading>
                </CardHeader>

                <CardBody>
                    <span id="svg-container"></span>
                    <Button variant='solid' colorScheme='blue'
                            onClick={async () => await launchAnimation(destinations)}>
                        Start Animation
                    </Button>
                    <CustomSlider/>
                </CardBody>
            </Card>
            <Card>
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