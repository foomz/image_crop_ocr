from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
from io import BytesIO
import pytesseract
import base64
import csv
import os
import json
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)

@csrf_exempt
def upload_image(request):
    if request.method == 'POST':
        try:
            logging.debug("Request method is POST")

            # Parse JSON data
            data = json.loads(request.body.decode('utf-8'))
            logging.debug(f"Received data: {data}")
            
            image_data = data.get('image')
            if not image_data:
                logging.error("No image data provided")
                return JsonResponse({'error': 'No image data provided'}, status=400)

            logging.debug("Decoding image data")
            image_data = base64.b64decode(image_data.split(',')[1])
            image = Image.open(BytesIO(image_data))
            logging.debug("Image opened successfully")
            
            text = pytesseract.image_to_string(image)
            logging.debug(f"Extracted text: {text}")

            # Define the file path and name
            csv_file_path = os.path.join('extracted_text.csv')
            logging.debug(f"CSV file path: {csv_file_path}")

            # Write the extracted text to the CSV file
            with open(csv_file_path, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([text])
                logging.debug("Text written to CSV file")

            return JsonResponse({'text': text, 'message': 'Text saved to CSV'})
        except Exception as e:
            logging.error(f"Exception occurred: {e}", exc_info=True)
            return JsonResponse({'error': str(e)}, status=500)
    logging.error("Invalid request method")
    return JsonResponse({'error': 'Invalid request'}, status=400)