// Function to interpolate two colors by a given progress value
export const interpolateColors = (color1, color2, progress) => {
    
    // map through each channel of the color1 array and calculate the interpolated color value by adding 
    // the difference of that channel in color2 and color1 multiplied by progress
    return color1.map((channel, i) => channel + (color2[i] - channel) * progress);
};

// Function to apply a filter to an ImageData object and use an array of color stops to map grayscale color values to a range of colors
export const gradientColorMap = (imageData, colorStops) => {
    const data = imageData.data;
    
    // loop through each pixel in the ImageData
    for (let i = 0; i < data.length; i += 4) {
        
        // convert the pixel's RGB values to grayscale
        let gray = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;
        let color = colorStops[0].color;
        
        // loop through the color stops array
        // to find the appropriate color to map to that gray value
        for (let j = 0; j < colorStops.length - 1; j++) {
            // check if the current gray value falls within a range defined by two color stops
            if (gray >= colorStops[j].stop && gray <= colorStops[j + 1].stop) {
                // calculate the progress value between the two color stops
                let progress = (gray - colorStops[j].stop) / (colorStops[j + 1].stop - colorStops[j].stop);
                // interpolate the color value for this gray value
                color = interpolateColors(colorStops[j].color, colorStops[j + 1].color, progress);
                break;
            }
        }
        // set the pixel's color to the interpolated color value
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
    }
    // return the modified ImageData
    return imageData;
};

// Example color stop generation and usage of gradientColorMap()

// let colorStops = [
//     { stop: 0, color: [255, 255, 255], label: "white" },
//     { stop: 20, color: [230, 230, 250], label: "lavender" },
//     { stop: 80, color: [200, 200, 240], label: "light purple" },
//     { stop: 100, color: [100, 100, 200], label: "cornflower blue" },
//     { stop: 255, color: [0, 0, 60], label: "midnight blue" }
// ];
// let filteredData = gradientColorMap(imageData, colorStops);
