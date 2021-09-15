import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "./currencyBlock.scss"

const divsToUpdate = document.querySelectorAll('.currency-plugin-container');

divsToUpdate.forEach(function(div) {
    const data = JSON.parse(div.querySelector("pre").innerHTML)
    ReactDOM.render(<Currency {...data}/>, div)
    div.classList.remove("currency-plugin-container")
})

function Currency(props) {

    const [buy, setBuy ] = useState(null);
    const [sell, setSell] = useState(null);
    const [error, setError] = useState(null);
    const [date, setDate] = useState(props.date);

    async function fetchCurrencyRatio() {
        const url = new URL(`http://api.nbp.pl/api/exchangerates/rates/c/${props.currency}/${date}/?format=json`);
        const response = await fetch(url.toJSON());
        const data = await response.json();
        setBuy(data.rates[0].ask);
        setSell(data.rates[0].bid);
    }

    useEffect(() => {
        fetchCurrencyRatio();
    }, [])

    function getYesterday() {
        let yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
        return yesterday.toISOString().split('T')[0];
    }

    function updateDate(e) {
        let day = new Date(e.target.value).getUTCDay();
        let isWeekend = [6,0].includes(day);
        if (isWeekend) {
            e.preventDefault();
            e.target.value = '';
            setError("Weekends not allowed, please choose a different date");
            return;
        }
        setDate(e.target.value);
        setError(null);
        fetchCurrencyRatio();
    }

    return (
        <div className="currency-plugin-frontend" style={{backgroundColor: props.backgroundColor, textAlign: props.textAlignment, color: props.textColor}}>
            <table>
                <tr>
                    <th>PLN</th>
                    <th>Ask</th>
                    <th>Bid</th>
                    <th>Currency</th>
                    <th>Date</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>{buy}</td>
                    <td>{sell}</td>
                    <td>{props.currency.toUpperCase()}</td>
                    <td>{date}</td>
                </tr>
            </table>
            <p className="error-plugin-date-weekend">{error}</p>
            <label for="date-currency">Choose a different date:</label>
            <br />
            <input type="date" value={date} max={getYesterday()} onChange={updateDate} id="date-currency" className="currency-calendar"/>
        </div>
    )
}
