import React, { useState, useEffect } from 'react'
import { Button, Grid, Row, Col, FormCheck, Table, Form } from 'react-bootstrap';
import LineStyle from './LineStyle';
import FontStyle from './FontStyle';

// theObject
// onChange
function LayoutItemPropery(props) {

    const [currObject, setCurrObject] = useState(props.theObject);

    useEffect(() => {
        if (typeof props.theObject !== 'undefined') {
            setCurrObject(props.theObject);
        } else {
            setCurrObject(null);
        }
    }, [props.theObject])

    const onChangeEnabled = function (ev) {
        let newobj = {...currObject} ;
        if( ev.target.checked ){
            newobj.frame.enabled = 1 ;
        }else{
            newobj.frame.enabled = 0 ;
        }
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }

    const onChangeLine = function (obj) {
        let newobj = {...currObject} ;
        const tenabled = newobj.frame.enabled ;
        newobj.frame = obj;
        newobj.frame.enabled = tenabled ;
        setCurrObject(newobj) ;
        props.onChange(newobj) ;
    }

    const oneZero2Bool = function(ival){
        if( ival===0)return false ;
        else return true ;
    }


    return (
        <>
            {
                (typeof currObject === 'undefined') ? "currObject undefined." : (
                    <>
                        <tr>
                            <td md="3">边框</td>
                            <td>
                                <FormCheck
                                    type={'checkbox'}
                                    label={""}
                                    checked={oneZero2Bool(currObject.frame.enabled)}
                                    onChange={onChangeEnabled}
                                />
                            </td>
                        </tr>
                        <tr>
                            <td md="3">边框属性</td>
                            <td>
                                <LineStyle theObject={currObject.frame}
                                onChange={onChangeLine}
                                />
                            </td>
                        </tr>
                    </>
                )
            }
        </>
    )
}

export default LayoutItemPropery