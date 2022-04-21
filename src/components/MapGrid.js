import React, { useState, useEffect } from 'react'
import { Button, Grid, Row, Col, FormCheck, Table, Form } from 'react-bootstrap';

import LineStyle from './LineStyle'
import FontStyle from './FontStyle'



//theObject
//onChange(newObj)
function MapGrid(props) {


	const [currObject, setCurrObject] = useState(null);

	useEffect(() => {
		if (typeof props.theObject === 'undefined') {
			let obj1 = {} ;
			obj1.enabled = 0 ;
			obj1.linesymbol = {width:0.5, style:'solid', color:{r:0,g:0,b:0,a:255}} ;
			obj1.font = {size:12,bold:0,align:'left',color:{r:0,g:0,b:0,a:255}} ;
			obj1.stepx = 0 ;
			obj1.stepy = 0 ;
			obj1.offsetx = 0 ;
			obj1.offsety = 0 ;
			setCurrObject(obj1) ;
		} else {
			let obj1 = {...props.theObject} ;
			if( typeof props.theObject.stepx === 'undefined'){
				obj1.stepx = 0 ;
				obj1.stepy = 0 ;
				obj1.offsetx = 0 ;
				obj1.offsety = 0 ;
			}
			setCurrObject(obj1);
		}
	}, [props.theObject])



	const onChangeEnabled=function(ev){
		let newobj ={...currObject} ;
		newobj.enabled = ev.target.checked?1:0 ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}

	const onChangeFont = function(obj){
		let newobj ={...currObject} ;
		newobj.font = obj ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}


	const onChangeLineSytle = function(obj){
		let newobj ={...currObject} ;
		newobj.linesymbol = obj ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}

	const onChangeStepX = function(ev){
		let newobj ={...currObject} ;
		newobj.stepx = ev.target.value ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}

	const onChangeStepY = function(ev){
		let newobj ={...currObject} ;
		newobj.stepy = ev.target.value ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}

	const onChangeOffsetX = function(ev){
		let newobj ={...currObject} ;
		newobj.offsetx = ev.target.value ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}

	const onChangeOffsetY = function(ev){
		let newobj ={...currObject} ;
		newobj.offsety = ev.target.value ;
		setCurrObject(newobj) ;
		props.onChange(newobj) ;
	}



	return (
		<>
			{
				(currObject === null) ? "" : (
					<>
						<tr>
							<td md="3">网格线</td>
							<td>
								<FormCheck
									type={'checkbox'}
									label={""}
									checked={currObject.enabled}
									onChange={onChangeEnabled}
								/>
							</td>
						</tr>
						<tr>
							<td md="3">网格线属性</td>
							<td>
								<Table>
									<tbody>
										<tr>
											<td>
												线样式
											</td>
											<td>
												<LineStyle
												theObject={currObject.linesymbol} 
												onChange={onChangeLineSytle}
												/>
											</td>
										</tr>
										<tr>
											<td>
												标签样式
											</td>
											<td>
												<FontStyle 
												theObject={currObject.font}
												onChange={onChangeFont}
												/>
											</td>
										</tr>
										<tr>
											<td>
												X间隔
											</td>
											<td>
												<Form.Control type="text"
												value={currObject.stepx}
												onChange={onChangeStepX}
												/>
											</td>
										</tr>
										<tr>
											<td>
												Y间隔
											</td>
											<td>
												<Form.Control type="text"
												value={currObject.stepy}
												onChange={onChangeStepY}
												/>
											</td>
										</tr>
										<tr>
											<td>
												X起始值
											</td>
											<td>
												<Form.Control type="text" 
												value={currObject.offsetx}
												onChange={onChangeOffsetX}
												/>
											</td>
										</tr>
										<tr>
											<td>
												Y起始值
											</td>
											<td>
												<Form.Control type="text"
												value={currObject.offsety}
												onChange={onChangeOffsetY}
												/>
											</td>
										</tr>
									</tbody>
								</Table>

							</td>
						</tr>
					</>
				)
			}
		</>
	)
}

export default MapGrid