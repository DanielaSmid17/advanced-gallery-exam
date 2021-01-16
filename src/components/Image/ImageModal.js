import React from 'react'
import Modal from 'react-modal'
import './ImageModal.css'

export default class ImageModal extends React.Component {

    render() {
        const { isOpen, title, onClose, imgUrl, onRequestClose } = this.props
        return (
            <Modal isOpen={isOpen} onRequestClose={onRequestClose} >
                <div className='title-close'>
                    <h3>{title}</h3>
                    <i className="fa fa-times" aria-hidden="true" onClick={onClose}></i>
                </div>
                <img src={imgUrl} />
            </Modal>
        )
    }
}
