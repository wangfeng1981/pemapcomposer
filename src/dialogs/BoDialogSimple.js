import React ,  {useState,useEffect} from 'react'
import { Toast, Modal, Button } from 'react-bootstrap';


import "./BoDialogSimple.css";




//props:
//onCancel
//onOk
//title
//renderContent
//isOpen
function BoDialogSimple(props) {
  return (
    <Modal show={props.isOpen} onHide={props.onCancel}
    >
    <Modal.Header 
    style={{padding:'2px'}}
    >
      <Modal.Title 
      style={{padding:'1px',backgroundColor:'#3597D1',width:'100%'}}>
          <div className="BoDialogTitleSlash"></div>
          {props.title}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
        {
            props.renderContent()
        }
    </Modal.Body>
    <Modal.Footer>
      
      <Button variant="primary" size="sm" 
      style={{width:'80px',backgroundColor:'#3597D1'}}
      onClick={props.onOk}>
        确定
      </Button>
      
      <Button variant="secondary" size="sm" 
      style={{width:'80px'}} onClick={props.onCancel}>
        取消
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default BoDialogSimple