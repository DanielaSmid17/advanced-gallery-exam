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
    this.calcImageSize = this.calcImageSize.bind(this);
    this.state = {
      size: 200,
      openModal: false
    };
  }

  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
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


  render() {
    return (
      <div
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.dto)})`,
          width: this.state.size + 'px',
          height: this.state.size + 'px'
        }}
      >
        <div>
          <FontAwesome className="image-icon" name="sync-alt" title="rotate" />
          <FontAwesome className="image-icon" name="trash-alt" title="delete" />
          <FontAwesome className="image-icon" name="expand" title="expand" onClick={this.handleExpandClick} />
        </div>
        <ImageModal isOpen={this.state.openModal} onClose={this.handleModalClose} onRequestClose={this.handleRequestModalClose} imgUrl={this.urlFromDto(this.props.dto)} title={this.props.dto.title} />
      </div>
    );
  }
}

export default Image;