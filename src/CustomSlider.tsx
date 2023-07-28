import React, {useState} from "react";
import {Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack, Text} from "@chakra-ui/react";

export const CustomSlider = () => {
    const [sliderValue, setSliderValue] = useState(5)

    return (
        <Box pt={6} pb={2} width='100%'>
            <Text>Animation Delay: {sliderValue} ms</Text>
            <Slider aria-label='slider-ex-6' min={5} max={500} onChange={(val) => setSliderValue(val)}>
                <SliderTrack>
                    <SliderFilledTrack/>
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Box>
    )
}