import './App.css';
import React from 'react';
import useSound from 'use-sound'
import coin from './coin.m4a'

const Wheel = ({ startedRoll, shuffledWheel, delay, radius, angle, wheelStyle, wheelItemStyle, isLastWheel, winnerAnimation, setWinnerAnimation }) => {
    const [ coinSound ] = useSound(coin, { volume: 0.2 });

    const itemsMarkup = React.useMemo(() => {
        const markup = [];

        for (let i = 0; i < shuffledWheel.length; i++) {
            markup.push(<div key={"slot_item-" + i} style={{ ...wheelItemStyle, transform: `rotateX(${angle * i}deg) translateZ(${radius}px)` }} className={`wheel__segment ${winnerAnimation && i === 0 ? "wheel__segment-winner" : ""}`}>
                <img style={{ ...wheelItemStyle, objectFit: "contain"}} src={process.env.PUBLIC_URL  + "./wheelImgs/" + shuffledWheel[i] } alt=""/>
            </div>);
        }

        return markup;
	}, [angle, radius, shuffledWheel, wheelItemStyle, winnerAnimation]);

    const onRollEnd = React.useCallback(() =>
	{
        coinSound();
        if (isLastWheel)
            setWinnerAnimation(true);
	}, [coinSound, isLastWheel, setWinnerAnimation]);

    return <div className={startedRoll ? "wheel__container-appear" : "wheel__container"} style={{animationDelay: `${delay}s`}}>
        <div style={{...wheelStyle, animationDelay: `${delay}s`}} className={`wheel__inner ${startedRoll ? "wheel__inner-spin" : ""}`} onAnimationEnd={onRollEnd}>
            {itemsMarkup}
        </div>
    </div>

}

export default Wheel;
