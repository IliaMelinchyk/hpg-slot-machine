import './App.css';
import { staticFunnyWheel } from './staticFunnyWheel';
import React from 'react';
import { currentFunnyWheel } from './currentFunnyWheel';

const numberOfCycles = 5
const itemHeight = 100

function App() {
  const [ winnerData, setWinnerData ] = React.useState(null);
  const [ winnerPosition, setWinnerPosition ] = React.useState(0);
  const [ startedRoll, setStartedRoll ] = React.useState(false);
  React.useEffect(() => {
    setWinnerData(staticFunnyWheel.find(item => item._id === currentFunnyWheel.winner.id));
  },[ winnerData ]);
  
  const itemsMarkup = React.useMemo(() =>
	{
    if (!winnerData)
      return;

    console.log(winnerData)
    const itemsForAWheel = [];
    currentFunnyWheel.list.forEach(id => {
      const curItemData = staticFunnyWheel.find(item => item._id === id);
      if (!curItemData)
        return;
      itemsForAWheel.push(curItemData?._id);
    });

    const markup = [];
    for (let i = 1; i <= numberOfCycles; i++) {
      const randomizedItemsForAWheel = itemsForAWheel.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
  
      for (let j = 0; j <= randomizedItemsForAWheel.length - 1; j++)
        markup.push(<div key={"slot_item-" + i + "-" + j} style={{width: "300px", height: `${itemHeight}px`, background: "gray"}}>{randomizedItemsForAWheel[j]}</div>);
    }

    setWinnerPosition(markup.length * itemHeight)


		return markup;
	}, [winnerData]);
  
  const roll = React.useMemo(() =>
	{
    setStartedRoll(true)
	}, []);

  return (
    <div className="App">
      <button style={{position: "absolute", left: "0px", right: "0px"}} onClick={roll}>ROLL</button>
      <div className="container">
        <div className="window" style={{height: `${itemHeight}px`}}>
          <div className={`items`} style={{bottom: `${startedRoll ? winnerPosition : 0}px`}}>
          {itemsMarkup}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
