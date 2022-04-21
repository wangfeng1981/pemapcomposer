import React, { useState, useEffect } from 'react'
import { Button, Grid, Container, Row, Col, Form, Table, FormCheck } from 'react-bootstrap';
import FontStyle from './FontStyle';




//theObject
//onChange
function LabelProperty(props) {

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
                "font": {
					"align": "left",
					"bold": 0,
					"color": {
						"a": 255,
						"b": 0,
						"g": 0,
						"r": 0
					},
					"size": 12
				},
				"text": "Please input text..."
            }
            setCurrObject(obj1) ;
        }

    }, [props.theObject])



	const onChangedFont = function(obj){
		let newobj = {...currObject} ;
		newobj.font = obj ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}


	const onChangedText = function(ev) {
		let newobj = {...currObject} ;
		newobj.text = ev.target.value ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}



	return (isObjectOk(currObject)) ? (
		<>
			<tr>
				<td>
					文字样式
				</td>
				<td>
					<FontStyle
					theObject={currObject.font}
					onChange={onChangedFont}
					/>
				</td>
			</tr>
			<tr>
				<td>文本内容</td>
				<td>
					<Form.Control as="textarea" 
					rows={3}
					value={currObject.text}
					onChange={onChangedText} />
				</td>
			</tr>
		</>
	) : ""
}

export default LabelProperty