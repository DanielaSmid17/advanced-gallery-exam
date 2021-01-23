import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';
import ImageModal from './ImageModal'
class Image extends React.Component {

  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      imageRotation: 0,
      buttonsRotation: 0,
      borderColor: '#FFFFFF',
      isFavorite: this.props.isInFavoritesList,
    };
  }

  handleExpandClick = () => {
    this.setState({ openModal: true })
  }

  handleModalClose = () => {
    this.setState({ openModal: false })
  }

  handleRequestModalClose = () => {
    this.setState({ openModal: false })
  }

  handleFlipButton = () => {
    this.setState({ imageRotation: (this.state.imageRotation + 90) % 360 })
    this.setState({ buttonsRotation: (this.state.buttonsRotation - 90) % 360 })
  }

  handleDragStart = (e) => {
    const initialPosition = Number(e.currentTarget.dataset.position)
    this.props.onGalleryDrag(initialPosition)
    this.setState({ borderColor: "#F7F700" })
  }

  handleDragEnter = (e) => {
    const currentPosition = Number(e.currentTarget.dataset.position)
    this.props.onGalleryDragEnter(currentPosition)
    console.log('after', this.state.imageClassName);
  }

  handleDrop = () => {
    this.props.onDrop()
    this.setState({ borderColor: "#FFFFFF" })
  }

  handleFavoriteClick = () => {
    if (!this.state.isFavorite)
      this.props.addToFavoritesList(this.props.dto)
    else
      this.props.removeFromFavoritesList(this.props.dto)

    this.setState({ isFavorite: !this.state.isFavorite })
  }


  render() {

    return (
      <div
        data-position={this.props.index}
        draggable="true"
        onDragStart={this.handleDragStart}
        onDragEnter={this.handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        className={this.props.disableHover ? 'image-dragged' : 'image-root'}
        onDrop={this.handleDrop}
        style={{
          transform: `rotate(${this.state.imageRotation}deg)`,
          backgroundImage: `url(${this.props.url})`,
          width: this.props.size + 'px',
          height: this.props.size + 'px',
          justifyItems: 'center',
          border: `1px solid ${this.state.borderColor}`
        }}
      >
        <div style={{ transform: `rotate(${this.state.buttonsRotation}deg)` }}>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" onClick={this.handleFlipButton} />
          {!this.props.isInFavoritesList && <FontAwesome className="image-icon" name="trash-alt" title="delete" onClick={() => this.props.onDelete(this.props.dto)} />}
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.handleExpandClick} />
          {!this.props.isInFavoritesList && < FontAwesome className="image-icon"
            name="heart"
            title="favorite"
            style={this.state.isFavorite ? { color: "red" } : { color: "#ccc" }}
            onClick={this.handleFavoriteClick} />}
        </div>
        <ImageModal isOpen={this.state.openModal} onClose={this.handleModalClose} onRequestClose={this.handleRequestModalClose} imgUrl={this.props.url} title={this.props.dto.title} />
      </div >
    );
  }
}

export default Image;