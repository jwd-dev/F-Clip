# Image Classifier Shoes + Hats

This application allows users to upload an image which is then classified using a HF model. Currently picks between shoes and hats however since the model is CLIP those categories can be added to or changed easily. 

## Requirements

- Node.js (v14.0.0 or newer)
- npm (v6.0.0 or newer)


## Setup & Installation

   ```bash
   npm install
   pip3 install transformers
   pip3 install flask
   pip3 install flask_cors
   pip3 install PIL
   ```

  Start the application by running:

  ```bash
  npm start
  python3 server.py
  ```


After starting the application, you should be able to access it at [http://localhost:3000](http://localhost:3000) (or the URL/port indicated in your terminal).
