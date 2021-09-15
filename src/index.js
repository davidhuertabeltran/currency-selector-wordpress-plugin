import {SelectControl, PanelBody, ColorPicker, PanelRow} from "@wordpress/components";
import "./index.scss";
import React, { useState, useEffect } from "react";
import {InspectorControls, BlockControls, AlignmentToolbar} from "@wordpress/block-editor";

wp.blocks.registerBlockType("myplugin/currency-selector-david", {
    title: "Currency Selector",
    icon: "money-alt",
    category: "common",
    description: "Select a currency to display in your post or page",
    attributes: {
        currency: {type: "string"},
        textAlignment: {type: "string", default: "left"},
        date: {type: "string" },
        backgroundColor: {type: "string", default: "EBEBEB"},
        textColor: {type: "string", default: "0A1414"},
        textAlignment: {type: "string", default: "center"},
    },
    edit: EditComponent,
    save: function(props) {
        return null
    }
})

function EditComponent(props) {
    const [ date, setDate ] = useState( props.attributes.date ? props.attributes.date : getYesterday() );
    const [ currency, setCurrency ] = useState( props.attributes.currency ? props.attributes.currency : "usd" );
    const [ error, setError ] = useState(null);

    function getYesterday() {
        let yesterday = new Date((new Date()).valueOf() - 1000*60*60*24);
        return yesterday.toISOString().split('T')[0];
    }

    useEffect(() => {
        props.setAttributes({date: date});
    }, date)

    useEffect(() => {
        props.setAttributes({currency: currency})
    }, currency)

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
    }

    function updateCurrency(value) {
        setCurrency(value);
    }

    return (
        <div className="edit-currency" style={{backgroundColor: props.attributes.backgroundColor, color: props.attributes.textColor}}>

            <BlockControls>
                <AlignmentToolbar value={props.attributes.textAlignment} onChange={x => props.setAttributes({textAlignment: x})} />
            </BlockControls>
            <InspectorControls>
                <PanelBody tittle="Background Color" initialOpen={true}>
                    <PanelRow>
                        <div>
                            <div>Background color</div>
                            <ColorPicker color={props.attributes.backgroundColor} onChangeComplete={x => props.setAttributes({backgroundColor: x.hex})} disableAlpha={true}/>
                        </div>
                    </PanelRow>
                </PanelBody>
                <PanelBody tittle="Font Color" initialOpen={true}>
                    <PanelRow>
                        <div>
                            <div>Text color</div>
                            <ColorPicker color={props.attributes.textColor} onChangeComplete={x => props.setAttributes({textColor: x.hex})} disableAlpha={true}/>
                        </div>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            
            <h3 className="currency-plugin-title">Convert PLN into your favorite currency</h3>
            <SelectControl 
                className="currency-dropdown"
                label="Select Currency:"
                value={currency}
                onChange={updateCurrency}
                options={ [
                    { label: 'USD', value: 'usd' },
                    { label: 'GBP', value: 'gbp' },
                    { label: 'EUR', value: 'eur' },
                ] }
            />

            <input className="calendar-ratio" type="date" value={date} max={getYesterday()} onChange={updateDate}/>

            <p className="error-plugin-date-weekend">{error}</p>

        </div>
    )

}