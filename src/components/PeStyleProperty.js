import React, { useState, useEffect } from 'react'
import { Button, Grid, Container, Row, Col, Form, Table, FormCheck } from 'react-bootstrap';
import FontStyle from './FontStyle';

//props.theObject={currObject.data}
//props.onChange={onChangePeStylePpt}
function PeStyleProperty(props) {
    const [currObject, setCurrObject] = useState(props.theObject);
    const [textFont, setTextFont] = useState(null);

    const isObjectOk = function (obj) {
        if (typeof obj === 'undefined') return false;
        if (obj === null) return false;
        return true;
    }

    const convertAlignIntVal2Str = function (ival) {
        const ival2 = parseInt(ival);
        if (ival2 === 0) return 'left';
        else if (ival2 === 1) return 'center';
        else return 'right';
    }
    const convertAlignStr2Int = function (str) {
        if (str === 'left') return 0;
        else if (str === 'center') return 1;
        else return 2;
    }

    useEffect(() => {
        let tempObj1 = {};
        if (isObjectOk(props.theObject)) {
            tempObj1 = props.theObject;
            setCurrObject(props.theObject);
        } else {
            let obj1 = {
                drawDirection: 0,
                labelFontSize: 10,
                labelDirectionAngle: 0,
                labelOffsetX: 2,
                labelOffsetY: 0,
                boxWid: 20,
                boxHei: 10,
                boxMarginX: 40,
                boxMarginY: 4,
                boxBorderWidth: 2,
                boxBorderColorR: 0,
                boxBorderColorG: 0,
                boxBorderColorB: 0,
                tickWid: 2,
                tickColorR: 0,
                tickColorG: 0,
                tickColorB: 0,
                nRows: 3,
                nCols: 3,
                textAlign: 0,
                textColorR: 0,
                textColorG: 0,
                textColorB: 0
            }
            tempObj1 = obj1;
            setCurrObject(obj1);
        }
        let tempTextFont = {};
        tempTextFont.size = tempObj1.labelFontSize;
        tempTextFont.color = {
            r: tempObj1.textColorR,
            g: tempObj1.textColorG,
            b: tempObj1.textColorB,
            a: 255
        };
        tempTextFont.bold = 0;
        tempTextFont.align = convertAlignIntVal2Str(tempObj1.textAlign);
        setTextFont(tempTextFont);

    }, [props.theObject])


    const onChange_drawDirection = function (ev) {
        let newobj = { ...currObject };
        newobj.drawDirection = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_textFont = function (obj) {
        let newobj = { ...currObject };
        newobj.labelFontSize = obj.size;
        newobj.textColorR = obj.color.r;
        newobj.textColorG = obj.color.g;
        newobj.textColorB = obj.color.b;
        newobj.textAlign = convertAlignStr2Int(obj.align);
        setCurrObject(newobj);
        setTextFont(obj);
        props.onChange(newobj);
    }
    const onChange_labelDirectionAngle = function (ev) {
        let newobj = { ...currObject };
        newobj.labelDirectionAngle = parseFloat(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_labelOffsetX = function (ev) {
        let newobj = { ...currObject };
        newobj.labelOffsetX = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_labelOffsetY = function (ev) {
        let newobj = { ...currObject };
        newobj.labelOffsetY = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_boxWid = function (ev) {
        let newobj = { ...currObject };
        newobj.boxWid = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_boxHei = function (ev) {
        let newobj = { ...currObject };
        newobj.boxHei = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_boxMarginX = function (ev) {
        let newobj = { ...currObject };
        newobj.boxMarginX = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_boxMarginY = function (ev) {
        let newobj = { ...currObject };
        newobj.boxMarginY = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_boxBorderWidth = function (ev) {
        let newobj = { ...currObject };
        newobj.boxBorderWidth = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_boxBorderColor = function (ev) {
        let newobj = { ...currObject };
        const tempcolor = hex2Rgb(ev.target.value);
        newobj.boxBorderColorR = tempcolor.r;
        newobj.boxBorderColorG = tempcolor.g;
        newobj.boxBorderColorB = tempcolor.b;
        setCurrObject(newobj);
        props.onChange(newobj);
    }

    const onChange_tickWid = function (ev) {
        let newobj = { ...currObject };
        newobj.tickWid = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_tickColor = function (ev) {
        let newobj = { ...currObject };
        const tempcolor = hex2Rgb(ev.target.value);
        newobj.tickColorR = tempcolor.r;
        newobj.tickColorG = tempcolor.g;
        newobj.tickColorB = tempcolor.b;
        setCurrObject(newobj);
        props.onChange(newobj);
    }


    const onChange_nRows = function (ev) {
        let newobj = { ...currObject };
        newobj.nRows = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }
    const onChange_nCols = function (ev) {
        let newobj = { ...currObject };
        newobj.nCols = parseInt(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
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

    return (isObjectOk(currObject)) ? (
        <>
            <tr>
                <td>
                    绘制方向
                </td>
                <td>
                    <select 
                    className="form-select"
                    value={currObject.drawDirection} onChange={onChange_drawDirection}>
                        <option value={0}>垂直</option>
                        <option value={1}>水平</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>文本样式</td>
                <td>
                    {
                        (textFont !== null) ? (
                            <FontStyle
                                theObject={textFont}
                                onChange={onChange_textFont}
                            />
                        ) : null
                    }

                </td>
            </tr>
            <tr>
                <td>文字角度</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.labelDirectionAngle}
                        onChange={onChange_labelDirectionAngle}
                    />
                </td>
            </tr>
            <tr>
                <td>文字偏移X</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.labelOffsetX}
                        onChange={onChange_labelOffsetX}
                    />
                </td>
            </tr>
            <tr>
                <td>文字偏移Y</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.labelOffsetY}
                        onChange={onChange_labelOffsetY}
                    />
                </td>
            </tr>
            <tr>
                <td>色块宽度</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.boxWid}
                        onChange={onChange_boxWid}
                    />
                </td>
            </tr>
            <tr>
                <td>色块高度</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.boxHei}
                        onChange={onChange_boxHei}
                    />
                </td>
            </tr>
            <tr>
                <td>色块间隔X</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.boxMarginX}
                        onChange={onChange_boxMarginX}
                    />
                </td>
            </tr>
            <tr>
                <td>色块间隔Y</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.boxMarginY}
                        onChange={onChange_boxMarginY}
                    />
                </td>
            </tr>
            <tr>
                <td>色块描边线宽</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.boxBorderWidth}
                        onChange={onChange_boxBorderWidth} />
                </td>
            </tr>
            <tr>
                <td>色块描边颜色</td>
                <td>
                    <Form.Control
                        type="color"
                        value={rgb2Hex({
                            r: currObject.boxBorderColorR,
                            g: currObject.boxBorderColorG,
                            b: currObject.boxBorderColorB,
                            a: 255
                        })}
                        onChange={onChange_boxBorderColor}
                    />
                </td>
            </tr>

            <tr>
                <td>刻度线宽</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.tickWid}
                        onChange={onChange_tickWid} />
                </td>
            </tr>
            <tr>
                <td>刻度颜色</td>
                <td>
                    <Form.Control
                        type="color"
                        value={rgb2Hex({
                            r: currObject.tickColorR,
                            g: currObject.tickColorG,
                            b: currObject.tickColorB,
                            a: 255
                        })}
                        onChange={onChange_tickColor}
                    />
                </td>
            </tr>
            <tr>
                <td>色块行数</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.nRows}
                        onChange={onChange_nRows} />
                </td>
            </tr>
            <tr>
                <td>色块列数</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.nCols}
                        onChange={onChange_nCols} />
                </td>
            </tr>
        </>
    ) : ""
}

export default PeStyleProperty