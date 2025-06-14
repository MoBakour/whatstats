// Number formatter
export const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
};

// Shuffle Function
export const shuffle = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
