import React from 'react'
import axios from 'axios';

const fileUploadEndPoint = 'http://localhost:8081/upload';

const Form = () => {
    const fileRef = React.createRef();
    const [showLoader, setShowLoader] = React.useState(false);
    const [image, setImage] = React.useState(null);

    const handleUpload = async () => {
        console.log('** Uploading to S3 **');
        //get the file information
        if(fileRef.current.files.length > 0) {
            const fileInfo = fileRef.current.files[0]; //1 file
            const formData = new FormData(); //JS defines it "multipart/form-data"
            formData.append('file', fileInfo); //name=file
            console.log(fileInfo);

            setShowLoader(true);
            //make HTTP call
            const response = await axios.post(fileUploadEndPoint, formData, {
                onUploadProgress: (progressEvent) => {
                    //progress upload till our Node server
                    console.log(progressEvent);

                    //% loaded
                    //setLoaded((progressEvent.loaded/progressEvent.total) * 100);
                }
            });
            setShowLoader(false);
            console.log(response.data);
            setImage(response.data);
        } else {
            console.log('No files selected');
        }
    }
    return (
        <div>
            <h2>Upload file to S3 bucket</h2>
            <input type="file" ref={fileRef} accept="image/jpeg, image/png"/>
            <button onClick={handleUpload}>Upload</button>
            {showLoader && (<p>Uploading ...</p>)}
            <div>
                {image && (
                    <img src={image} width="400" alt=""/>
                )}
            </div>
        </div>
    );
}

export default Form;