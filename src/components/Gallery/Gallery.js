import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import FontAwesome from 'react-fontawesome';
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
      dragEnterIndex: null,
      disableHover: false,
      favoriteImages: [],
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
    this.removeFromFavoritesList(dto)
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
    this.setState({ draggedImage, dragEnterIndex, disableHover: true })
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

  addToFavoritesList = (dto) => {
    const favoritesCopy = [...this.state.favoriteImages]
    if (!favoritesCopy.includes(dto))
      favoritesCopy.push(dto)
    this.setState({ favoriteImages: favoritesCopy })
  }

  removeFromFavoritesList = (dto) => {
    const favoritesCopy = [...this.state.favoriteImages]
    let index = favoritesCopy.indexOf(dto)
    if (index >= 0) {
      favoritesCopy.splice(index, 1)
      this.setState({ favoriteImages: favoritesCopy })
    }
  }

  render() {
    return (
      <div className="gallery-root" id='gallery' >
        {this.state.favoriteImages.length > 0 &&
          <div className='favorites-gallery'>
            <h3>< FontAwesome name="heart" /> Your Favorite Pictures</h3>
            {this.state.favoriteImages.map((dto, index) => {
              return <Image
                isInFavoritesList
                removeFromFavoritesList={this.removeFromFavoritesList}
                addToFavoritesList={this.addToFavoritesList}
                onDrop={() => this.setState({ disableHover: false })}
                disableHover={this.state.disableHover}
                onGalleryDrag={this.handleGalleryDrag}
                onGalleryDragEnter={this.handleGalleryDragEnter}
                index={index}
                key={'image-' + dto.id + index}
                dto={dto}
                onDelete={this.handleDelete}
                size={this.state.imageSize}
              />
            })}
          </div>
        }
        <h3>Main Gallery</h3>
        {
          this.state.images.map((dto, index) => {
            return <Image
              removeFromFavoritesList={this.removeFromFavoritesList}
              addToFavoritesList={this.addToFavoritesList}
              onDrop={() => this.setState({ disableHover: false })}
              disableHover={this.state.disableHover}
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
      </div >
    );
  }
}

export default Gallery;