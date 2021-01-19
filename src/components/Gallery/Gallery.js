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
      imageSize: 200
    };
  } 

  getImages(tag, page = 1) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${page}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET',
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          const renderedImages = [...this.state.images, ...res.photos.photo]
          this.setState({ images: renderedImages, totalPhotos: res.photos.total });
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
      this.getImages(this.props.tag, newPage)
      this.setState({ page: newPage })
      // Show loading spinner and make fetch request to api
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



  render() {
    return (
      <div className="gallery-root" id='gallery' >
        {
          this.state.images.map((dto, index) => {
            return <Image
              key={'image-' + dto.id + index}
              dto={dto}
              onDelete={this.handleDelete}
              size={this.state.imageSize}
            />;
          })
        }
        {(this.state.totalPhotos < 0 && this.state.images.length === this.state.totalPhotos) && <h6>You've reached the end of this search!</h6>}
      </div>
    );
  }
}

export default Gallery;