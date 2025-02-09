from flask import Flask, jsonify, request

from config import ChartProcessorConfig
from utils import CHART_AREA_MARGINS
from serviceChartProcessor import image_to_json

import jiwer
from sklearn.metrics import precision_score, recall_score, f1_score, accuracy_score

app = Flask(__name__)

@app.route('/extract-json-from-horizontal-bar-chart', methods=['POST'])
def extract():
    file = request.files['image']
    whitelist = request.form.get('whitelist', ChartProcessorConfig.INTEGER)
    print(whitelist)
    value_extractor_type = request.form.get('value_extractor_type', 'initial')
    tmp = CHART_AREA_MARGINS['left']
    CHART_AREA_MARGINS['left'] = float(request.form.get('left', CHART_AREA_MARGINS['left']))
    print(CHART_AREA_MARGINS['left'])
    lang = request.form.get('lang', 'eng')

    # Carica l'immagine in OpenCV
    image_bytes = file.read()

    result = jsonify(image_to_json(image_bytes, whitelist, value_extractor_type, lang))
    CHART_AREA_MARGINS['left'] = tmp
    return result
