# Costanti globali
from typing import Tuple

import numpy as np

CHART_AREA_MARGINS = {
    'top': 0.13,
    'bottom': 0.12,
    'left': 0.265,
    #'left': 0.2705,
    'right': 0.05
}

def get_chart_area(image: np.ndarray) -> Tuple[int, int, int, int]:
    """
    Define the main chart area by excluding margins.
    Returns the coordinates
    """
    height, width = image.shape[:2]

    # Calculate boundaries
    top = int(height * CHART_AREA_MARGINS['top'])
    bottom = int(height * (1 - CHART_AREA_MARGINS['bottom']))
    left = int(width * CHART_AREA_MARGINS['left'])
    right = int(width * (1 - CHART_AREA_MARGINS['right']))

    return left, top, right, bottom