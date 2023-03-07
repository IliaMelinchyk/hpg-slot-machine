import './App.css';
import { staticFunnyWheel } from './staticFunnyWheel';
import React from 'react';
import { currentFunnyWheel } from './currentFunnyWheel';
import { shuffleArrayWithoutDuplicates } from './utils';
import Wheel from './Wheel';

// Высота ячейки
const itemHeight = 90;
// Ширина ячейки
const itemWidth = 300;
// Модификатор скорости - чем он выше тем быстрее крутится колесо
const speedModificator = 10;
// Количество секунд, на протяжении которых будет крутиться колесо (без учета 6 секунд, на протяжении которых в конце хайлайтятся случайные ячейки)
const rollLength = 24;
// Количество ячеек которые видно единовременно (обязательно должно быть нечетное число)
const howManyItemsVisible = 9;

function App() {
  const wheelsMarkup = React.useMemo(() =>
	{
    // Выяснение полных данных победителя, для вывода полной информации о нем в конце анимации
    const tempWinnerData = staticFunnyWheel.find(item => item._id === currentFunnyWheel.winner.id);
    if (!tempWinnerData)
      return;

    // Сначала строим массивы всех ячеек участвующих в нынешней итерации колеса, один без первой найденной ячейки - победителя, а другой с ней
    const usedItemsWithoutWinner = [];
    const usedItemsWithWinner = [];
    let foundFirstInstanceOfWinner = false;
    currentFunnyWheel.list.forEach(id => {
      const curItemData = staticFunnyWheel.find(item => item._id === id);
      if (!curItemData)
        return;
      if (!foundFirstInstanceOfWinner && id === tempWinnerData._id) {
        foundFirstInstanceOfWinner = true;
        usedItemsWithWinner.push(curItemData?.name);
        return;
      }
      usedItemsWithoutWinner.push(curItemData?.name);
      usedItemsWithWinner.push(curItemData?.name);
    });

    // Добор предметов для большего размера колеса, поскольку рекомендуемый размер колеса составляет от 50 до 100 ячеек то при необходимости в финальный массив используемый в колесе происходит добор, причем таким образом что лишь последний добавляемый массив ячеек участвующих в нынешней итерации колеса не имеет первой найденной ячейки - победителя (при добавлении все они перемешиваются так, чтобы не было двух одинаковых ячеек подряд)
    const itemsForAWheel = [];
    const howManyCyclesToFill = Math.ceil(50 / usedItemsWithWinner.length);
    for (let i = 1; i <= howManyCyclesToFill; i++) {
      if (i === howManyCyclesToFill) {
        itemsForAWheel.push(...shuffleArrayWithoutDuplicates(usedItemsWithoutWinner));
      } else itemsForAWheel.push(...shuffleArrayWithoutDuplicates(usedItemsWithWinner));
    }

    // Вычисление индексов, которые будут видны при окончании кручении колеса
    const finalIndexes = [];
    for (let i = 0; i < howManyItemsVisible / 2; i++) {
      finalIndexes.push(i);
      if (i === 0)
        continue;
      finalIndexes.push(itemsForAWheel.length + 1 - i);
    }

    // Поскольку мы не добавили ячейку-победителя в последний массив ячеек добавляемый в колесо, то ячейка-победитель добавляется сейчас и вставляется в колесо так, чтобы быть видимой в конце кручения колеса (то есть иметь один из индексов, которые были высчитаны как финальные ранее)
    const winningIndex = Math.floor(Math.random() * finalIndexes.length);
    itemsForAWheel.splice(finalIndexes[winningIndex], 0, tempWinnerData?.name);

    // Вычисление данных необходимых для стилей колеса
    const diameter = itemsForAWheel.length * (itemHeight / Math.PI);
    const radius = diameter / 2;
    const angle = 360 / itemsForAWheel.length;
    const circumference = Math.PI * diameter;
    const height = circumference / itemsForAWheel.length;
    const iterationCount = Math.ceil(rollLength / itemsForAWheel.length * speedModificator);
    const singleTurnDur = rollLength / iterationCount;

    const wheelStyle = { height: `${height * (howManyItemsVisible + 1)}px`, width: `${itemWidth}px`, transformOrigin: `50% calc(50% + ${height / 2}px)`, marginTop: `-${height}px`, animationDuration: `${singleTurnDur}s`, animationIterationCount: iterationCount };
    const wheelItemStyle = { height: `${height}px`, width: `${itemWidth}px` };

    return <Wheel shuffledWheel={itemsForAWheel} radius={radius} angle={angle} wheelStyle={wheelStyle} wheelItemStyle={wheelItemStyle} finalIndexes={finalIndexes} winningIndex={winningIndex}/>;
  }, [])

  return (
    <div className="wheel">
      {wheelsMarkup}
    </div>
  );
}

export default App;
