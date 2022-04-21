import React, { useState, useEffect } from 'react'
import { Button, Grid, Container, Row, Col, Form, Table, FormCheck } from 'react-bootstrap';
import LineStyle from './LineStyle'
import PolyStyle from './PolyStyle';

//theObject
//onChange
function PointStyle(props) {

    const [currObject, setCurrObject] = useState(props.theObject);

    const isObjectOk = function (obj) {
        if (typeof obj === 'undefined') return false;
        if (obj === null) return false;
        return true;
    }

    useEffect(() => {
        if (isObjectOk(props.theObject)) {
            setCurrObject(props.theObject);
        } else {
            let obj1 = {
                "shape": "circle",
                "size": 2,
                "polysymbol": {
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
            }
            setCurrObject(obj1);
        }

    }, [props.theObject])

    const onChangeShape = function (ev) {
        let newobj = { ...currObject };
        newobj.shape = ev.target.value;
        setCurrObject(newobj);
        props.onChange(newobj);
    }

    const onChangeSize = function (ev) {
        let newobj = { ...currObject };
        newobj.size = parseFloat(ev.target.value);
        setCurrObject(newobj);
        props.onChange(newobj);
    }

    const onChangePoly = function (obj) {
        let newobj = { ...currObject };
        newobj.polysymbol = obj;
        setCurrObject(newobj);
        props.onChange(newobj);
    }



    return (isObjectOk(currObject)) ? (
        <Table><tbody>
            <tr>
                <td>
                    点形状
                </td>
                <td>
                    <select className="form-select"
                    value={currObject.shape} onChange={onChangeShape}>
                        <option value='square'>正方形</option>
                        <option value='diamond'>钻石</option>
                        <option value='pentagon'>五边形</option>
                        <option value='star'>五角星</option>
                        <option value='triangle'>三角形</option>
                        <option value='circle'>圆形</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td>点尺寸</td>
                <td>
                    <Form.Control type="text"
                        value={currObject.size}
                        onChange={onChangeSize}
                    />
                </td>
            </tr>
            <tr>
                <td>
                    点样式
                </td>
                <td>
                    <PolyStyle
                        theObject={currObject.polysymbol}
                        onChange={onChangePoly}
                    />
                </td>
            </tr>
        </tbody></Table>
    ) : ""
}

export default PointStyle