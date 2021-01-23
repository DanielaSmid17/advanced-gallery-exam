import React from 'react'
import Modal from 'react-modal'
import './ImageModal.css'

export default class ImageModal extends React.Component {
    constructor() {
        super()
        this.state = {
            colors: null,
        };
    }

    handleClick = (e) => {
        this.setState({ colors: e.target.value })

    }


    render() {
        const { isOpen, title, onClose, imgUrl, onRequestClose } = this.props

        return (
            <Modal className='modal' isOpen={isOpen} onRequestClose={onRequestClose} >
                <div className='close-btn'>
                    <i className="fa fa-times" aria-hidden="true" onClick={onClose}></i>
                </div>
                <div className='modal-content'>
                    <h3 className='title'>{title}</h3>
                    <div className='color-btns'>
                        <button value={null} onClick={this.handleClick}>Original</button>
                        <button value="blacknwhite" onClick={this.handleClick}>Black & white</button>
                        <button value="sepia" onClick={this.handleClick}>Sepia</button>
                    </div>
                    <img className={`img ${this.state.colors}`} src={imgUrl} />
                </div>
            </Modal>
        )
    }
}
