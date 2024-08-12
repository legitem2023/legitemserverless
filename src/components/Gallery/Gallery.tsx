import React from 'react'
import ImageGallery from "react-image-gallery";
import 'react-image-gallery/styles/css/image-gallery.css';
import noImage from '../../../public/NoImage.png';

const Gallery = ({ data }: any) => {
    const GalleryImages = data.map((item: any) => {
        return {
            "original": item.thumbnail===null?noImage.src:item.thumbnail,
            "thumbnail": item.thumbnail===null?noImage.src:item.thumbnail
        }
    })
    return <ImageGallery items={GalleryImages} thumbnailPosition="right" />;

}

export default Gallery