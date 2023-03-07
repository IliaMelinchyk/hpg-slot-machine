import './App.css';
import React from 'react';
import { randomWinner, enlargeArray, shuffleArrayWithoutDuplicates } from './utils';

const Wheel = ({ shuffledWheel, radius, angle, wheelStyle, wheelItemStyle, finalIndexes, winningIndex }) => {
    const [ curHighlight, setCurHighlightValue ] = React.useState(null);

    const itemsMarkup = React.useMemo(() => {
        const markup = [];

        for (let i = 0; i < shuffledWheel.length; i++) {
            markup.push(<div key={"slot_item-" + i} style={{ ...wheelItemStyle, transform: `rotateX(${angle * i}deg) translateZ(${radius}px)` }} className={`wheel__segment ${curHighlight !== null && i === curHighlight ? "wheel__segment-winner" : ""}`}>
                {shuffledWheel[i]}
            </div>);
        }

        return markup;
	}, [angle, curHighlight, radius, shuffledWheel, wheelItemStyle]);

    const onRollEnd = React.useCallback(() => {
        // Количество первых "тиков" победителя, от 5 до 10 в течении первых трех секунд (потом они происходят медленнее и тиков меньше)
        const num = Math.floor(Math.random() * 6) + 5;
        // Общее количество "тиков", которое будет уменьшаться вдвое и замедлятся два раза
        const overallNumberOfTicks = num + Math.ceil(num / 2) + Math.ceil(num / 2 / 2);
        // Создание массива порядка, в котором будут происходить хайлайты финальных ячеек колеса, размер которого равен количеству "тиков"
        const highlightOrder = enlargeArray(finalIndexes, overallNumberOfTicks);
        // Перемешивание массива порядка хайлайтов
        const shuffledHighlightOrder = shuffleArrayWithoutDuplicates(highlightOrder);
        // Добавление победителя в финальный хайлайт
        shuffledHighlightOrder[shuffledHighlightOrder.length - 1] = finalIndexes[winningIndex];
        // Использование функции для генерации хайлайтов в случайном порядке, при постепенном замедлении
        randomWinner(3000, num, setCurHighlightValue, shuffledHighlightOrder);
	}, [finalIndexes, winningIndex]);

    return <div className="wheel__container">
        <div style={wheelStyle} className="wheel__inner" onAnimationEnd={onRollEnd}>
            {itemsMarkup}
        </div>
    </div>

}

export default Wheel;
