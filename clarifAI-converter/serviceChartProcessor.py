import pytesseract

from ChartProcessor import ChartProcessorConfig, ChartProcessor
from default_extractors import DefaultLabelExtractor, DefaultLegendExtractor, DefaultContourProcessor, \
    DefaultValueExtractor, DefaultJSONFormatter, InitialValueExtractor

def image_to_json(image_bytes, whitelist = ChartProcessorConfig.INTEGER, value_extractor_type='default', lang='eng'):
    # Configure Tesseract path
    pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

    # Instantiate concrete implementations
    label_extractor = DefaultLabelExtractor()
    legend_extractor = DefaultLegendExtractor()
    contour_processor = DefaultContourProcessor()
    json_formatter = DefaultJSONFormatter()

    if value_extractor_type == 'initial':
        value_extractor = InitialValueExtractor()
    else:
        value_extractor = DefaultValueExtractor()

    # Create configuration
    ChartProcessorConfig(whitelist, lang)

    # Create ChartProcessor
    chart_processor = ChartProcessor(
        label_extractor=label_extractor,
        legend_extractor=legend_extractor,
        contour_processor=contour_processor,
        value_extractor=value_extractor,
        json_formatter=json_formatter
    )

    return chart_processor.process_image(image_bytes)

if __name__ == "__main__":
    #with open("test-images/app-1/canvas-screenshot.png", "rb") as img_file:

    with open("C:\\Users\\fborz\\OneDrive - Università di Napoli Federico II\\Tesi Magistrale\\Esperimenti\\Playwright\\learning-phase\\chart-3-from=1606777200000-to=1630792800000-none+test.png", "rb") as img_file:
    # with open("C:\\Users\\fborz\\OneDrive - Università di Napoli Federico II\\Tesi Magistrale\\Esperimenti\\Playwright\\learning-phase\\chart-3-from=1606777200000-to=1630792800000-1920x1080.png", "rb") as img_file:
        image_bytes = img_file.read()
    result = image_to_json(image_bytes, ChartProcessorConfig.INTEGER, 'default', 'eng')
    print(result)