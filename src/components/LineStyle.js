import React, { useState, useEffect } from 'react'
import { Button, Grid, Container, Row, Col, Form, Table, FormCheck } from 'react-bootstrap';




// theObject
// onChange(newObj)
function LineStyle(props) {

    const [currObject, setCurrObject] = useState(props.theObject);

    useEffect(() => {
        if (typeof props.theObject === 'undefined') {
            let obj1 = {};
            obj1.width = 0.5;
            obj1.color = { r: 0, g: 0, b: 0, a: 255 };
            obj1.style = 'solid';
            setCurrObject(obj1);
        } else {
            setCurrObject(props.theObject);
        }
    }, [props.theObject])

    const onWidthChanged = function (ev) {
        let newObj = { ...currObject };
        newObj.width = ev.target.value;
        setCurrObject(newObj);
        props.onChange(newObj) ;
    }

    const onColorChanged = function (ev) {
        let newObj = { ...currObject };
        const alpha1 = newObj.color.a ;
        newObj.color = hex2Rgb(ev.target.value);
        newObj.color.a = alpha1 ;
        setCurrObject(newObj);
        props.onChange(newObj) ;
    }

    const onLineStyleChanged = function (ev) {
        let o = {...currObject} ;
        o.style = ev.target.value ;
        setCurrObject(o) ;
        props.onChange(o) ;
    }

    const onAlphaChanged = function(ev){
        let newObj = { ...currObject };
        newObj.color.a = parseInt(ev.target.value) ;
        setCurrObject(newObj);
        props.onChange(newObj) ;
    }

    // hex #ffffff
    // retval {r:255,g:255,b:255,a:255}
    const hex2Rgb = function (hex) {
        if (/^#([a-f0-9]{3}){1,2}$/.test(hex)) {
            if (hex.length === 4) {
                hex = '#' + [hex[1], hex[1], hex[2], hex[2], hex[3], hex[3]].join('');
            }
            var c = '0x' + hex.substring(1);
            let color = {};
            color.r = (c >> 16) & 255;
            color.g = (c >> 8) & 255;
            color.b = c & 255;
            color.a = 255;
            return color;
        } else {
            return { r: 0, g: 0, b: 0, a: 255 };
        }
    }

    //rgb {r:255,g:255,b:255,a:255}
    //retval #ffffff
    const rgb2Hex = function (rgb) {
        return "#" + ((1 << 24) +
            (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
    }
    return (typeof currObject === 'undefined' || currObject === null ) ? "" : (
            <Table>
                <tbody>
                    <tr>
                        <td>线型</td>
                        <td>
                            <select className="form-select"
                                value={currObject.style}
                                onChange={onLineStyleChanged}
                            >
                                <option value='solid'>实线</option>
                                <option value='dot'>点线</option>
                                <option value='dash'>划线</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>线宽</td>
                        <td>
                            <Form.Control type="text" 
                            value={currObject.width}
                            onChange={onWidthChanged} />
                        </td>
                    </tr>
                    <tr>
                        <td>线色</td>
                        <td>
                            <Form.Control
                                type="color"
                                value={rgb2Hex(currObject.color)}
                                onChange={onColorChanged}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>透明度(0~255)</td>
                        <td>
                            <Form.Control type="text" 
                            value={currObject.color.a}
                            onChange={onAlphaChanged}
                            />
                        </td>
                    </tr>
                </tbody>
            </Table>
        )
}

export default LineStyle