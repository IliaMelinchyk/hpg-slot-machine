import './App.css';
import { staticFunnyWheel } from './staticFunnyWheel';
import React from 'react';
import { currentFunnyWheel } from './currentFunnyWheel';
import { shuffleArrayWithoutDuplicates } from './utils';
import Wheel from './Wheel';
import useSound from 'use-sound'
import volchok from './volchok.m4a'
import slot from './slot.svg'

// Модификатор диаметра - чем он выше тем шире изображение на колесе
const widthModificator = 30;
// Модификатор скорости - чем он выше тем быстрее крутится колесо
const speedModificator = 10;
// Количество секунд, на протяжении которых будет крутиться колесо
const rollLength = 1;
// Количество колес
const howManyWheels = 3;
// Расстояние между колесами в пикселях
const gapBetweenWheelsWidth = 5;
// Количество секунд между анимациями кручения каждого отдельного колеса
const wheelAnimationDelay = 0.3;


function App() {
  const [ winnerData, setWinnerData ] = React.useState(null);
  const [ startedRoll, setStartedRoll ] = React.useState(false);
  const [ winnerAnimation, setWinnerAnimation ] = React.useState(false);
  const [ itemHeight, setItemHeight ] = React.useState(0);
  const arraysOfItemsRef = React.useRef([]);
  const [ volchokSound, volchokSoundData] = useSound(volchok, { volume: 0.2 });
  
  const rollWheel = React.useCallback(() =>
	{
    if (startedRoll)
      return;
    volchokSound();
    setStartedRoll(true);
    setTimeout(() => volchokSoundData.stop(), rollLength * 1000);
    setTimeout(() => {

    }, (rollLength + wheelAnimationDelay * howManyWheels) * 1000);
	}, [startedRoll, volchokSound, volchokSoundData]);


  
  const wheelsMarkup = React.useMemo(() =>
	{
    // Выяснение полных данных победителя, для вывода полной информации о нем в конце анимации
    const tempWinnerData = staticFunnyWheel.find(item => item._id === currentFunnyWheel.winner.id);
    setWinnerData(tempWinnerData);
    if (!tempWinnerData)
      return;

    // Проход для получения полных данных всех предметов, используемых в нынешней итерации колеса (при этом удаляется первый найденный айди победителя, для того чтобы позже быть добавленным в конце массива, чтобы на нем закончилась анимация)
    const usedItemsWithoutWinner = [];
    let foundFirstInstanceOfWinner = false;
    currentFunnyWheel.list.forEach(id => {
      const curItemData = staticFunnyWheel.find(item => item._id === id);
      if (!curItemData)
        return;
      if (!foundFirstInstanceOfWinner && id === tempWinnerData._id) {
        foundFirstInstanceOfWinner = true;
        return;
      }
      usedItemsWithoutWinner.push(curItemData?.image);
    });

    // Добор предметов для большего размера колеса при необходимости
    const itemsForAWheel = [];
    while (itemsForAWheel.length < 50)
      itemsForAWheel.push(...usedItemsWithoutWinner);

    // Определение выигрышного паттерна, в котором будут расположены победные ячейки
    // Всего 5 вариантов паттерна
    // 1 - Победные ячейки в центре
    // 2 - Победные ячейки в снизу
    // 3 - Победные ячейки сверху
    // 4 - Победные ячейки наискосок с нижнего левого угла в правый верхний
    // 5 - Победные ячейки наискосок с левого верхнего угла в правый нижний
    const randomWinnerPattern = 1;
    // const randomWinnerPattern = Math.floor(Math.random() * 5) + 1;

    // Перемешиванние массива предметов (при этом два предмета подряд не попадаются), добавление в конец массива победителя и повторение этого действия для каждого из колес
    if (arraysOfItemsRef.current.length === 0) {
      for (let i = 0; i < howManyWheels; i++) {
        arraysOfItemsRef.current.push(shuffleArrayWithoutDuplicates(itemsForAWheel));
        switch (randomWinnerPattern) {
          case 1:
          default:
            arraysOfItemsRef.current[i].unshift(tempWinnerData?.image);
            break;
          case 2:
            arraysOfItemsRef.current[i].push(tempWinnerData?.image);
            break;
          case 3:
            arraysOfItemsRef.current[i].splice(1, 0, tempWinnerData?.image);
            break;
          case 4:
            switch (i) {
              case 0:
              default:
                arraysOfItemsRef.current[i].push(tempWinnerData?.image);
                break;
              case 1:
                arraysOfItemsRef.current[i].unshift(tempWinnerData?.image);
                break;
              case 2:
                arraysOfItemsRef.current[i].splice(1, 0, tempWinnerData?.image);
                break;
            }
            break;
          case 5:
            switch (i) {
              case 0:
              default:
                arraysOfItemsRef.current[i].splice(1, 0, tempWinnerData?.image);
                break;
              case 1:
                arraysOfItemsRef.current[i].unshift(tempWinnerData?.image);
                break;
              case 2:
                arraysOfItemsRef.current[i].push(tempWinnerData?.image);
                break;
            }
            break;
        }
      }
    }

    const howManyItems = arraysOfItemsRef.current[0].length;
    const diameter = howManyItems * widthModificator;
    const radius = diameter / 2;
    const angle = 360 / howManyItems;
    const circumference = Math.PI * diameter;
    const height = circumference / howManyItems;
    const iterationCount = Math.ceil(rollLength / howManyItems * speedModificator);
    const singleTurnDur = rollLength / iterationCount;
    const wheelStyle = { height: `${height * 4}px`, width: `${height}px`, transformOrigin: `50% calc(50% + ${height / 2}px)`, marginTop: `-${height}px`, animationDuration: `${singleTurnDur}s`, animationIterationCount: iterationCount };
    const wheelItemStyle = { height: `${height}px`, width: `${height}px` };
    setItemHeight(height);
  
    const markup = [];
    for (let i = 0; i < howManyWheels; i++) {
      markup.push(<Wheel key={i} delay={i * wheelAnimationDelay} shuffledWheel={arraysOfItemsRef.current[i]} startedRoll={startedRoll} radius={radius} angle={angle} wheelStyle={wheelStyle} wheelItemStyle={wheelItemStyle} isLastWheel={i === howManyWheels - 1} winnerAnimation={winnerAnimation} setWinnerAnimation={setWinnerAnimation} />);
    }
    return markup;
  },[startedRoll, winnerAnimation])

  return (
    <div className="App">
      <div className="container">
        <div className="wheel" style={{width: `${itemHeight * howManyWheels  + gapBetweenWheelsWidth * (howManyWheels - 1)}px`, gap: `${gapBetweenWheelsWidth}px`}}>
          {wheelsMarkup}
          <div style={{position: "absolute", height: `${itemHeight}px`, width: `${itemHeight * howManyWheels  + gapBetweenWheelsWidth * (howManyWheels - 1)}px`, borderTop: "1px solid red", borderBottom: "1px solid red"}}></div>
        </div>
      </div>
      {/* <img src={slot} alt="" className='wheel__bg'/> */}
      <button style={{position: "absolute", left: "0px", right: "0px", margin: "300px auto 0"}} onClick={rollWheel}>ROLL</button>
    </div>
  );
}

export default App;
