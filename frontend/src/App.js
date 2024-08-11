import React, { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import axios from 'axios';
import { Container, Box, Button, Typography, Input } from '@mui/material';

function App() {
  const [image, setImage] = useState(null);
  const cropperRef = useRef(null);

  const onChange = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (files && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log('Image loaded:', reader.result);
        setImage(reader.result);
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const cropImage = () => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && cropper.getCroppedCanvas) {
      const croppedImage = cropper.getCroppedCanvas().toDataURL();
      console.log('Cropped Image:', croppedImage);
      sendCroppedImage(croppedImage);
    } else {
      console.log('Cropper instance is not ready');
    }
  };

  const sendCroppedImage = (croppedImage) => {
    console.log('Sending cropped image to backend');
    axios
      .post('http://localhost:8000/api/upload/', { image: croppedImage }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log('Response from backend:', response.data);
        alert('Text saved to CSV successfully!');
      })
      .catch((error) => {
        console.error('There was an error!', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          alert(`Error: ${error.response.data.error}`);
        }
      });
  };

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Image Crop and OCR
        </Typography>
        <Input type="file" onChange={onChange} />
        {image && (
          <Cropper
            src={image}
            style={{ height: 400, width: '100%' }}
            // Cropper.js options
            aspectRatio={16 / 9}
            guides={false}
            ref={cropperRef}
          />
        )}
        <Button variant="contained" color="primary" onClick={cropImage}>
          Crop Image
        </Button>
      </Box>
    </Container>
  );
}

export default App;