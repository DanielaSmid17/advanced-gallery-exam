import React from 'react'
import Modal from 'react-modal'
import './ImageModal.css'

export default class ImageModal extends React.Component {


    render() {
        const { isOpen, title, onClose, imgUrl, onRequestClose } = this.props

        return (
            <Modal className='modal' isOpen={isOpen} onRequestClose={onRequestClose} >
                <div className='title-close'>
                    <i className="fa fa-times" aria-hidden="true" onClick={onClose}></i>
                </div>
                <div className='img'>
                    <h3>{title}</h3>
                    <img src={imgUrl} />
                </div>
            </Modal>
        )
    }
}
