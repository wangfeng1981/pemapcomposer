import React, { useState, useEffect } from 'react'
import { Button, Grid, Container, Row, Col, Form, Table, FormCheck } from 'react-bootstrap';




// theObject 
// onChange
function FontStyle(props) {

    const [currObject, setCurrObject] = useState(props.theObject);


    useEffect(() => {
        if (typeof props.theObject === 'undefined') {
            let obj1 = {};
            obj1.size = 12;
            obj1.color = { r: 0, g: 0, b: 0, a: 255 };
            obj1.bold = 0;
            obj1.align = 'left';
            setCurrObject(obj1);
        } else {
            setCurrObject(props.theObject);
        }
    }, [props.theObject])



    const onChangeBold = function(ev) {
        let newobj ={...currObject} ;
        if( ev.target.checked ){
            newobj.bold = 1 ;
        }else{
            newobj.bold = 0 ;
        }
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }

    const onChangeColor = function(ev) {
        let newobj = {...currObject} ;
        newobj.color = hex2Rgb(ev.target.value) ;
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }

    const onChangeSize = function(ev) {
        if( isNaN(ev.target.value) ) return ;
        let newobj = {...currObject} ;
        newobj.size = ev.target.value ;
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }

    const onAlignChanged = function(ev){
        let newobj = {...currObject};
        newobj.align = ev.target.value;
        setCurrObject(newobj) ;
        props.onChange(newobj);
    }



    // hex #ffffff
    // retval {r:255,g:255,b:255,a:255}
    const hex2Rgb = function (hex) {
        if (/^#([a-f0-9]{3}){1,2}$/.test(hex)) {
            if (hex.length == 4) {
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

    return (
        <Table>
            {
                (typeof currObject === 'undefined') ? "" : (
                    <tbody>
                        <tr>
                            <td>对齐</td>
                            <td>
                                <Form.Select onChange={onAlignChanged} value={currObject.align}>
                                    <option value='left'>左对齐</option>
                                    <option value='center'>居中</option>
                                    <option value='right'>右对齐</option>
                                </Form.Select>
                            </td>
                        </tr>
                        <tr>
                            <td>加粗</td>
                            <td>
                                <FormCheck
                                    type={'checkbox'}
                                    label={""}
                                    value={currObject.bold}
                                    onChange={onChangeBold}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>字体尺寸</td>
                            <td>
                                <Form.Control type="text" 
                                value={currObject.size}
                                onChange={onChangeSize}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>字色</td>
                            <td>
                                <Form.Control
                                    type="color"
                                    value={ rgb2Hex(currObject.color) }
                                    onChange={onChangeColor}
                                />
                            </td>
                        </tr>
                    </tbody>
                )
            }
        </Table>
    )
}

export default FontStyle