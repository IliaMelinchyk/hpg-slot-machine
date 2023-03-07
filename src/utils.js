export const shuffleArrayWithoutDuplicates = (arr) => {
    const shuffledArr = arr.slice();

    for (let i = shuffledArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }

    for (let i = 1; i < shuffledArr.length; i++) {
        if (shuffledArr[i] === shuffledArr[i - 1]) {
            let randomIndex = i;
            while (randomIndex === i || shuffledArr[randomIndex] === shuffledArr[i - 1])
                randomIndex = Math.floor(Math.random() * shuffledArr.length);
            [shuffledArr[i], shuffledArr[randomIndex]] = [shuffledArr[randomIndex], shuffledArr[i]];
        }
    }

    return shuffledArr;
}

export const randomWinner = (time, ticks, setCurHighlightValue, shuffledHighlightOrder) => {
    if (time < 1000)
        return;
    const delay = time / ticks; // вычисляем задержку между каждым хайлайтом
    let i = 0;
    const intervalId = setInterval(() => {
        setCurHighlightValue(shuffledHighlightOrder[0]);
        shuffledHighlightOrder.shift();
        i++;
        if (i === ticks) {
            clearInterval(intervalId);
            randomWinner(time - 1000, Math.ceil(ticks / 2), setCurHighlightValue, shuffledHighlightOrder);
        }
    }, delay);
}

export const enlargeArray = (array, num) => {
    const newArray = [...array];
    while (newArray.length < num) {
        newArray.push(...array);
    }
    return newArray.slice(0, num);
}