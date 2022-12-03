export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

export const getRandomFloat = (min, max, decimals) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}
