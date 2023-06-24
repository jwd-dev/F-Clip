from flask import Flask, request
from flask_cors import CORS
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

app = Flask(__name__)
CORS(app)

@app.route('/classify', methods=['POST'])
def classify_image():
    if True:
        if 'image' not in request.files:
            return {'error': 'No image file provided'}, 400
        image_file = request.files['image']
        texts = ["a hat", "a shoe"]
        image = Image.open(image_file)
        inputs = processor(text=["a hat", "a shoe"], images=image, return_tensors="pt",
                           padding=True)
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1)

        # Get the index of the highest probability
        prediction_index = probs.argmax()

        # Map the prediction index to the corresponding text label
        prediction_label = texts[prediction_index]

        return {'classification': prediction_label}



if __name__ == '__main__':
    model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
    processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
    app.run(port=5000)
