import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      page: 1,
      totalPhotos: 0,
      imageSize: 200,
      draggedImage: {},
      dragEnterIndex: null
    };
  }

  getImages(tag, page = 1, replace = true) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${page}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({ url: getImagesUrl, baseURL: baseUrl, method: 'GET' })
      .then(res => res.data)
      .then(res => {
        if (res && res.photos && res.photos.photo && res.photos.photo.length > 0) {
          const images = replace ? res.photos.photo : [...this.state.images, ...res.photos.photo]
          this.setState({ images, totalPhotos: res.photos.total });
        }
      });
  }

  calcImageSize() {
    const galleryWidth = window.innerWidth - 20;
    const targetSize = 200;
    const imagesPerRow = Math.floor(galleryWidth / targetSize);
    const imageSize = (galleryWidth / imagesPerRow);
    this.setState({ imageSize });
  }

  componentDidMount() {
    this.getImages(this.props.tag);
    this.calcImageSize();
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  handleDelete = (dto) => {
    const imagesList = [...this.state.images]
    const index = imagesList.indexOf(dto)
    imagesList.splice(index, 1)
    this.setState({ images: imagesList })
  }

  scrollListener = () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      const newPage = this.state.page + 1
      this.getImages(this.props.tag, newPage, false)
      this.setState({ page: newPage })
      // Show loading spinner
    }
  }

  resizeListener = () => {
    this.calcImageSize()
  }

  componentWillMount() {
    window.addEventListener('scroll', this.scrollListener);
    window.addEventListener('resize', this.resizeListener)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollListener);
    window.removeEventListener('resize', this.resizeListener)
  }

  handleGalleryDrag = (dragEnterIndex) => {
    const draggedImage = { ...this.state.images[dragEnterIndex] }
    this.setState({ draggedImage, dragEnterIndex })
  }

  handleGalleryDragEnter = (currentDragEnterIndex) => {
    const { images, dragEnterIndex, draggedImage } = this.state
    if (dragEnterIndex !== currentDragEnterIndex) {
      const imagesCopy = [...images]
      imagesCopy.splice(dragEnterIndex, 1)
      imagesCopy.splice(currentDragEnterIndex, 0, draggedImage)
      this.setState({ images: imagesCopy, dragEnterIndex: currentDragEnterIndex })
    }
  }

  render() {
    return (
      <div className="gallery-root" id='gallery' >
        {
          this.state.images.map((dto, index) => {
            return <Image
              onGalleryDrag={this.handleGalleryDrag}
              onGalleryDragEnter={this.handleGalleryDragEnter}
              index={index}
              key={'image-' + dto.id + index}
              dto={dto}
              onDelete={this.handleDelete}
              size={this.state.imageSize}
            />;
          })
        }
        {
          (this.state.totalPhotos > 0
            && (this.state.images.length == this.state.totalPhotos))
          && <h4>You've reached the end of the {this.props.tag} search!</h4>
        }
      </div>
    );
  }
}

export default Gallery;