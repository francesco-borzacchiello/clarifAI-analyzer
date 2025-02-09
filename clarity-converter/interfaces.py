from typing import List, Dict, Tuple
from abc import ABC, abstractmethod

import numpy as np

from config import ChartProcessorConfig


# Interfaces / Abstract Base Classes
class LabelExtractor(ABC):
    @abstractmethod
    def extract_labels(self, image: np.ndarray) -> List[Dict]:
        pass


class LegendExtractor(ABC):
    @abstractmethod
    def extract_legend(self, image: np.ndarray) -> List[Dict]:
        pass


class ContourProcessor(ABC):
    @abstractmethod
    def get_contours(self, image: np.ndarray) -> List[np.ndarray]:
        pass

    @abstractmethod
    def associate_labels_to_contours(self, labels, contours):
        pass


class ValueExtractor(ABC):
    @abstractmethod
    def extract_values_from_bars(
        self,
        image: np.ndarray,
        associations: List[Tuple],
        legend_items: List[Dict]
    ) -> List[Dict]:
        pass


class JSONFormatter(ABC):
    @abstractmethod
    def prepare_json(self, results: List[Dict]) -> Dict:
        pass