import React from "react";
import "components/DayListItem.scss";
import classNames from "classnames";


export default function DayListItem(props) {
    return (
        <li 
        data-testid='dayItem'
        className={classNames(
            'day-list__item',
            { 'day-list__item--selected': props.selected },
            { 'day-list__item--full': props.spots === 0 }
        )}
            onClick={() => { props.setDay(props.name); }}>
            <h2 className="text--regular">{props.name}</h2>
            <h3 className="text--light">
            {props.spots===1 ? `${props.spots} spot remaining` : 
            props.spots === 0 ? 'no spots remaining' : `
            ${props.spots} spots remaining`}</h3>
        </li>
    );
}