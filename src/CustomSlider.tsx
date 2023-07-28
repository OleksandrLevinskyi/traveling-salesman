import React, {useState} from "react";
import {Box, Slider, SliderFilledTrack, SliderMark, SliderThumb, SliderTrack} from "@chakra-ui/react";

export const CustomSlider = () => {
    const [sliderValue, setSliderValue] = useState(50)

    const labelStyles = {
        mt: '2',
        ml: '-2.5',
        fontSize: 'sm',
    }

    return (
        <Box pt={6} pb={2} width='1000'>
            <Slider aria-label='slider-ex-6' min={5} max={500} onChange={(val) => setSliderValue(val)}>
                <SliderMark
                    value={sliderValue}
                    textAlign='center'
                    bg='blue.500'
                    color='white'
                    mt='-10'
                    ml='-5'
                    w='30'
                >
                    Animation Delay: {sliderValue} ms
                </SliderMark>
                <SliderTrack>
                    <SliderFilledTrack/>
                </SliderTrack>
                <SliderThumb />
            </Slider>
        </Box>
    )
}