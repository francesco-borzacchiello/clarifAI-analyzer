from typing import Dict, Tuple
import cv2
import numpy as np

from config import ChartProcessorConfig
from interfaces import LabelExtractor, LegendExtractor, ContourProcessor, JSONFormatter, ValueExtractor

# Main Coordinator
class ChartProcessor:
    def __init__(
        self,
        label_extractor: LabelExtractor,
        legend_extractor: LegendExtractor,
        contour_processor: ContourProcessor,
        value_extractor: ValueExtractor,
        json_formatter: JSONFormatter
    ):
        self.label_extractor = label_extractor
        self.legend_extractor = legend_extractor
        self.contour_processor = contour_processor
        self.value_extractor = value_extractor
        self.json_formatter = json_formatter

    def process_image(self, image_bytes: bytes) -> Dict:
        """
        Processo principale per elaborare un'immagine e restituire i risultati in formato JSON.
        """
        image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

        # Step 1: Extract labels
        labels = self.label_extractor.extract_labels(image)

        # Step 2: Get and process contours
        contours = self.contour_processor.get_contours(image)

        # Step 3: Associate labels to contours
        associations = self.contour_processor.associate_labels_to_contours(labels, contours)

        # Step 4: Extract legend
        legend_items = self.legend_extractor.extract_legend(image)

        # Step 5: Extract values
        results = self.value_extractor.extract_values_from_bars(image, associations, legend_items)

        # Step 6: Ensure all labels are present in results
        label_keys = {label['text'] for label in labels}
        result_keys = {result['label'] for result in results}

        missing_labels = label_keys - result_keys

        for missing_label in missing_labels:
            results.append({
                'label': missing_label,
                'legend_item': None,
                'value': None
            })

        # Step 7: Format JSON
        return self.json_formatter.prepare_json(results)