class ChartProcessorConfig:
    INTEGER = '0123456789'
    lang = 'eng'
    tesseract_whitelist = INTEGER
    def __init__(self, tesseract_whitelist, lang):
        self.lang = lang
        self.tesseract_whitelist = tesseract_whitelist