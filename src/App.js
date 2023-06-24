import React, {useCallback, useState} from "react";
import axios from 'axios';

import {QueryClient, QueryClientProvider, useQuery} from 'react-query';


import {debounce} from 'lodash';
import imageCompression from 'browser-image-compression';
import styles from './App_Classification.css';


const convertImageToArray = async (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0);
            const imageData = context.getImageData(0, 0, img.width, img.height).data;
            const red = [], green = [], blue = [];
            for (let i = 0; i < imageData.length; i += 4) {
                red.push(imageData[i]);
                green.push(imageData[i + 1]);
                blue.push(imageData[i + 2]);
            }
            resolve({
                image: [red, green, blue],
                width: img.width,
                height: img.height,
            });
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};


function ImageClassifier() {
    const [selectedImage, setSelectedImage] = useState();
    const [imageFile, setImageFile] = useState();

    const [error, setError] = useState("");
    const [classif, setClassif] = useState("");


    const onImageChange = async event => {
        setSelectedImage(URL.createObjectURL(event.target.files[0]));

        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true
        }
        try {
            const compressedFile = await imageCompression(event.target.files[0], options);
            const imageData = await convertImageToArray(compressedFile);
            setImageFile(imageData);
            setError(""); // clear previous errors
        } catch (error) {
            console.error('Error occured while compressing the image.', error);
            setError("An error occurred while processing the image. Please try another image.");
        }
    };


    const classifyImage = useCallback(debounce(async () => {
        if (!selectedImage) return;

        let imageBlob = await fetch(selectedImage).then(r => r.blob());

        const formData = new FormData();
        formData.append('image', imageBlob);

        axios.post('http://localhost:5000/classify', formData)
            .then((response) => {
                const classification = response.data.classification;
                console.log(classification);
                setClassif(classification);
            })
            .catch((error) => {
                console.error('Error during API call', error);
                setError("An error occurred while processing the image. Please try another image.");
            });
    }, 500), [selectedImage]);
    return (
        <div className={styles.appContainer}>
            <h1 className={styles.title}>Image Classifier</h1>
            <form onSubmit={(e) => e.preventDefault()}>
                <input className={styles.imageUploader} type="file" onChange={onImageChange}/>
                <button className={styles.classifyButton} type="button" onClick={classifyImage}>Classify</button>
            </form>
            {classif &&
                <div><h2>Classification:</h2><p className={styles.classifyText}>{classif}</p></div>}
            {error && <div><h2>Error:</h2><p className={styles.errorText}>{error}</p></div>}
        </div>
    );
}

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ImageClassifier/>
        </QueryClientProvider>
    );
}

export default App;

