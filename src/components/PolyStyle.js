import React, { useState, useEffect } from 'react'
import { Button, Grid, Container, Row, Col, Form, Table, FormCheck } from 'react-bootstrap';
import LineStyle from './LineStyle'


//theObject
//onChange
function PolyStyle(props) {

    const [currObject, setCurrObject] = useState(props.theObject) ;



    const isObjectOk = function(obj){
        if( typeof obj==='undefined') return false ;
        if( obj===null) return false ;
        return true ;
    }

    useEffect(() => {
        if(isObjectOk(props.theObject)){
            setCurrObject(props.theObject) ;
        }else{
            let obj1 = {
                "fillcolor": {
                    "a": 255,
                    "b": 255,
                    "g": 255,
                    "r": 255
                },
                "linesymbol": {
                    "color": {
                        "a": 255,
                        "b": 0,
                        "g": 0,
                        "r": 0
                    },
                    "style": "solid",
                    "width": 0.3
                }
            }
            setCurrObject(obj1) ;
        }

    }, [props.theObject])
    



    const onChangeLine = function (obj) {
        let newobj = {...currObject} ;
        newobj.linesymbol = obj ;
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }


    const onColorChanged = function (ev) {
        let newobj = {...currObject} ;
        const alpha1 = currObject.fillcolor.a ;
        newobj.fillcolor = hex2Rgb(ev.target.value) ;
        newobj.fillcolor.a = alpha1 ;
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }

    const onAlphaChanged = function(ev) {
        let newobj = {...currObject} ;
        newobj.fillcolor.a = parseInt(ev.target.value) ;
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
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


    return (isObjectOk(currObject))?(
    <>
        <tr>
            <td>
                填充色
            </td>
            <td>
                <Form.Control
                    type="color"
                    value={rgb2Hex(currObject.fillcolor)}
                    onChange={onColorChanged}
                />
            </td>
        </tr>
        <tr>
            <td>透明度(0~255)</td>
            <td>
                <Form.Control type="text"
                    value={currObject.fillcolor.a}
                    onChange={onAlphaChanged}
                />
            </td>
        </tr>
        <tr>
            <td>
                描边样式
            </td>
            <td>
                <LineStyle
                    theObject={currObject.linesymbol}
                    onChange={onChangeLine}
                />
            </td>
        </tr>
    </>

    ):""
        
}

export default PolyStyle