import cv2
import numpy as np
from matplotlib.pyplot import legend
from scipy.spatial import distance
import pytesseract
import json
from typing import Dict, List, Tuple
import matplotlib.pyplot as plt

CHART_AREA_MARGINS = {
    'top': 0.13,
    'bottom': 0.12,
    'left': 0.265,
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

    return (left, top, right, bottom)

def extract_labels(image: np.ndarray) -> List[Dict]:
    """
    Extract labels from the left side of the chart.
    Returns list of labels with their positions.
    """
    height, width = image.shape[:2]

    top = int(height * CHART_AREA_MARGINS['top'])
    bottom = int(height * (1 - CHART_AREA_MARGINS['bottom']))

    label_area = image[top:bottom, :int(width * CHART_AREA_MARGINS['left'])]

    label_area = cv2.cvtColor(label_area, cv2.COLOR_BGR2YCrCb)
    label_area = cv2.cvtColor(label_area, cv2.COLOR_BGR2GRAY)
    label_area = cv2.GaussianBlur(label_area, (5, 5), 0)

    # Configure tesseract for line detection
    custom_config = r'--psm 6'
    text_data = pytesseract.image_to_data(label_area, config=custom_config, output_type=pytesseract.Output.DICT)

    labels = []
    threshold_distance = 20  # Maximum distance between labels to consider them close enough

    for i, word in enumerate(text_data['text']):
        if word.strip() and text_data['conf'][i] > 60:  # Filter out low confidence detections
            x, y = text_data['left'][i], text_data['top'][i]
            w, h = text_data['width'][i], text_data['height'][i]

            # Calculate the center of the label
            y_center = top + (y + (h // 2))

            # Only consider text in the label area
            if x < int(width * CHART_AREA_MARGINS['left']):
                if labels:  # Check against the last label
                    last_label = labels[-1]
                    last_x, last_y, last_w, last_h = last_label['position']
                    last_y_center = last_label['y_center']

                    # Check if the labels are on the same horizontal line
                    same_line = abs(last_y_center - y_center) <= h // 2

                    # Check if the distance between labels is small enough
                    close_enough = (x - (last_x + last_w)) <= threshold_distance

                    if same_line and close_enough:
                        # Concatenate labels
                        last_label['text'] += f" {word}"
                        last_label['position'] = (
                            last_x,
                            last_y,
                            (x + w) - last_x,
                            max(last_h, h)
                        )
                        continue

                labels.append({
                    'text': word,
                    'position': (x, top + y, w, h),
                    'y_center': y_center
                })

    return labels

def adjust_contours(contours, offset_x, offset_y):
    adjusted_contours = []
    for contour in contours:
        # Somma l'offset alle coordinate dei contorni
        contour[:, 0, 0] += offset_x  # Aggiungi offset_x alle coordinate x
        contour[:, 0, 1] += offset_y  # Aggiungi offset_y alle coordinate y
        adjusted_contours.append(contour)
    return adjusted_contours

def remove_inner_contours(contours):
    """
    Rimuove i contorni che sono completamente contenuti in altri contorni.
    """
    def is_contour_inside(inner, outer):
        """
        Controlla se il contorno 'inner' è contenuto completamente nel contorno 'outer'.
        """
        '''
        for point in inner:
            if cv2.pointPolygonTest(outer, (int(point[0][0]), int(point[0][1])), False) <= 0:  # Punto non dentro o sul bordo
                return False
        return True
        '''
        x_inner, y_inner, w_inner, h_inner = cv2.boundingRect(inner)
        x_outer, y_outer, w_outer, h_outer = cv2.boundingRect(outer)

        # Verifica se il bounding box di `inner` è contenuto in quello di `outer`
        return (
                x_inner >= x_outer and
                y_inner >= y_outer and
                x_inner + w_inner <= x_outer + w_outer and
                y_inner + h_inner <= y_outer + h_outer
        )

    filtered_contours = []
    for i, contour1 in enumerate(contours):
        contained = False
        for j, contour2 in enumerate(contours):
            if i != j and is_contour_inside(contour1, contour2):
                contained = True
                break
        if not contained:
            filtered_contours.append(contour1)
    return filtered_contours


def are_contours_adjacent(contour1, contour2, tolerance=2):
    """
    Controlla se due contorni hanno punti adiacenti entro una certa tolleranza.
    """
    for point1 in contour1:
        for point2 in contour2:
            if np.linalg.norm(point1[0] - point2[0]) <= tolerance:
                return True
    return False

def merge_contours(contours, tolerance=2):
    """
    Unisce contorni che hanno punti adiacenti.
    """
    merged = []
    while contours:
        contour = contours.pop(0)
        i = 0
        while i < len(contours):

            if are_contours_adjacent(contour, contours[i], tolerance):
                # Unisci i contorni
                contour = np.concatenate((contour, contours.pop(i)))
            else:
                i += 1
        merged.append(contour)
    return merged


def get_contours(image: np.ndarray):
    left, top, right, bottom = get_chart_area(image)
    img_ycbcr = cv2.cvtColor(image[top:bottom, left:right], cv2.COLOR_BGR2YCrCb)
    gray = cv2.cvtColor(img_ycbcr, cv2.COLOR_BGR2GRAY)
    canny = cv2.Canny(gray, 30, 200)

    contours, hierarchy = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    return adjust_contours(contours, left, top)


def associate_labels_to_contours(labels, contours):
    """
    Associa ogni label al contorno più vicino considerando la distanza euclidea tra i punti chiave.

    Args:
        labels: Lista di bounding box delle label [(x1, y1, x2, y2), ...].
        contours: Lista di contorni.

    Returns:
        associations: Lista di tuple (label_box, contour_box).
    """
    associations = []
    for label in labels:
        x, y, w, h = label['position']  # Coordinate della label
        top_right_label = (x + w, y)  # Punto in alto a destra della label
        bottom_right_label = (x + w, y + h)  # Punto in basso a destra della label

        min_distance = float('inf')
        best_contour = None

        for contour in contours:
            # Ottieni il bounding box del contorno
            cx, cy, cw, ch = cv2.boundingRect(contour)
            contour_box = (cx, cy, cx + cw, cy + ch)

            # Calcola i punti rilevanti del contorno
            top_left_contour = (cx, cy)  # Punto in alto a sinistra del contorno
            bottom_left_contour = (cx, cy + ch)  # Punto in basso a sinistra del contorno

            # Calcola le distanze euclidee tra i punti
            distance_top = distance.euclidean(top_right_label, top_left_contour)
            distance_bottom = distance.euclidean(bottom_right_label, bottom_left_contour)

            # Usa la somma o la media delle due distanze
            space = (distance_top + distance_bottom) / 2

            if space < min_distance:
                min_distance = space
                best_contour = contour_box

        # Associa la label al contorno più vicino
        if best_contour:
            associations.append((label, best_contour))

    return associations

def extract_legend(image: np.ndarray) -> List[Dict]:
    """
    Estrae la leggenda dalla parte superiore del grafico.
    Restituisce una lista di dizionari con `color` e `text`.
    """

    height, width = image.shape[:2]
    legend_area = image[:int(height * CHART_AREA_MARGINS['top']), :]

    # Convertiamo in grigio e applichiamo un filtro
    img_ycbcr = cv2.cvtColor(legend_area, cv2.COLOR_BGR2YCrCb)
    gray = cv2.cvtColor(img_ycbcr, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    canny = cv2.Canny(blurred, 30, 70)

    # Troviamo i contorni (rettangoli smussati)
    contours, _ = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    legend_items = []

    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)

        # Filtriamo i rettangoli che appaiono nella parte superiore
        aspect_ratio = w / h
        if 0.8 < aspect_ratio < 2 and h > 5 and h < 30:  # Adatti per rettangolini smussati
            # Estrarre il colore mediano del rettangolo
            color = np.median(legend_area[y:y + h, x:x + w], axis=(0, 1)).astype(int).tolist()

            legend_items.append({
                'bounding_box': (x, y, w, h),
                'color': color
            })

    # Ordiniamo i rettangoli in base alla coordinata x
    legend_items = sorted(legend_items, key=lambda item: item['bounding_box'][0])

    # Aggiungiamo il testo associato
    for i, item in enumerate(legend_items):
        x, y, w, h = item['bounding_box']

        # Determina la larghezza in base al successivo rettangolo
        if i < len(legend_items) - 1:  # Non è l'ultimo
            next_x, _, _, _ = legend_items[i + 1]['bounding_box']
            text_width = next_x - (x + w) - 5
        else:  # Ultimo elemento
            text_width = 300  # Default

        # Determina l'area da cui estrarre il testo
        text_area = legend_area[y:y + h, x + w + 5:x + w + 5 + text_width]
        text = pytesseract.image_to_string(text_area, config='--psm 6').strip()

        if text:
            item['text'] = text

    # Filtriamo eventuali rettangoli senza testo
    legend_items = [item for item in legend_items if 'text' in item]

    return legend_items

def extract_values_from_bars(image: np.ndarray, associations: List[Tuple], legend_items: List[Dict], min_distance_threshold: float = 50.0) -> List[Dict]:
    """
    Estrae i valori numerici dalle barre associate alle label,
    verificando che il colore della barra corrisponda a un elemento della legenda.
    """
    results = []

    for label, contour_box in associations:
        label_text = label['text']
        x1, y1, x2, y2 = contour_box
        bar_area = image[y1:y2, x1:x2]

        for legend in legend_items:
            color = legend['color']
            text = legend['text']
            found_values_count = 0  # Contatore dei valori trovati per questa label e legenda

            # Crea una maschera per il colore specifico
            lower = np.array(color) - 10  # Tolleranza di colore
            upper = np.array(color) + 10
            mask = cv2.inRange(bar_area, lower, upper)

            # Controlla se la maschera ha pixel non nulli (cioè una corrispondenza)
            if cv2.countNonZero(mask) == 0:
                continue  # Salta se non ci sono corrispondenze

            # Applica la maschera all'area della barra
            masked_area = cv2.bitwise_and(bar_area, bar_area, mask=mask)

            # Trova il bounding box della regione mascherata
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for contour in contours:
                x, y, w, h = cv2.boundingRect(contour)

                # Ritaglia solo la porzione mascherata
                cropped_masked_area = masked_area[y:y + h, x:x + w]

                # Converti la porzione ritagliata in scala di grigi
                gray_cropped_area = cv2.cvtColor(cropped_masked_area, cv2.COLOR_BGR2GRAY)

                # Applica Tesseract per trovare valori numerici
                value_data = pytesseract.image_to_string(
                    gray_cropped_area,
                    config='-c tessedit_char_whitelist=0123456789 --psm 6',
                    output_type=pytesseract.Output.DICT
                )

                # Estrai il testo rilevato
                extracted_text = value_data.get('text', '').strip()
                if extracted_text.isdigit():  # Consideriamo solo numeri validi
                    results.append({
                        'label': label_text,
                        'legend_item': text,
                        'value': int(extracted_text)  # Convertiamo in intero
                    })
                    found_values_count += 1

            # Se non è stato trovato alcun valore per questa label e legenda, esegui un OCR completo
            if found_values_count == 0:
                # Converti tutta l'area mascherata in scala di grigi
                gray_masked_area = cv2.cvtColor(masked_area, cv2.COLOR_BGR2GRAY)

                # Applica Tesseract con image_to_data per ottenere risultati dettagliati
                ocr_data = pytesseract.image_to_data(
                    gray_masked_area,
                    config='-c tessedit_char_whitelist=0123456789 --psm 6',
                    output_type=pytesseract.Output.DICT
                )

                # Cerca il valore con la confidenza più alta (escludendo confidenze negative)
                max_conf = -1
                best_value = None
                for i in range(len(ocr_data['text'])):
                    text = ocr_data['text'][i].strip()
                    conf = int(ocr_data['conf'][i])

                    if text.isdigit() and conf > max_conf:
                        max_conf = conf
                        best_value = int(text)

                # Se troviamo un valore valido, lo aggiungiamo ai risultati
                if best_value is not None and max_conf >= 0:  # Confidenza non negativa
                    results.append({
                        'label': label_text,
                        'legend_item': legend['text'],
                        'value': best_value,
                        'step': 2
                    })
                # STEP FINALE: OCR su tutta la bar_area e calcolo distanza minima dal centroide della maschera
                if best_value is None:
                    # Calcola il centroide della maschera
                    mask_moments = cv2.moments(mask)
                    if mask_moments['m00'] != 0:
                        mask_cx = int(mask_moments['m10'] / mask_moments['m00'])
                        mask_cy = int(mask_moments['m01'] / mask_moments['m00'])
                    else:
                        continue  # Salta se la maschera non ha momenti validi

                    # OCR su tutta la bar_area
                    ocr_data_full = pytesseract.image_to_data(
                        cv2.cvtColor(bar_area, cv2.COLOR_BGR2GRAY),
                        config='-c tessedit_char_whitelist=0123456789 --psm 6',
                        output_type=pytesseract.Output.DICT
                    )

                    # Cerca il valore con il centroide più vicino
                    min_distance = float('inf')
                    closest_value = None
                    for i in range(len(ocr_data_full['text'])):
                        text = ocr_data_full['text'][i].strip()
                        conf = int(ocr_data_full['conf'][i])

                        if text.isdigit() and conf > 0:  # Considera solo numeri validi
                            # Calcola il centroide del bounding box del valore
                            x, y, w, h = (ocr_data_full['left'][i], ocr_data_full['top'][i],
                                          ocr_data_full['width'][i], ocr_data_full['height'][i])
                            value_cx = x + w // 2
                            value_cy = y + h // 2

                            # Calcola la distanza euclidea
                            distance_value_mask = distance.euclidean((value_cx, value_cy), (mask_cx, mask_cy))
                            if distance_value_mask < min_distance:
                                min_distance = distance_value_mask
                                closest_value = int(text)

                    # Aggiungi il valore se la distanza minima è sotto la soglia
                    if closest_value is not None and min_distance <= min_distance_threshold:
                        results.append({
                            'label': label_text,
                            'legend_item': legend['text'],
                            'value': closest_value,
                            'step': 3
                        })
    return results

def prepare_json(results: List[Dict]):
    # Trasforma i risultati in una struttura JSON-friendly
    json_result = {}
    for entry in results:
        label = entry['label']
        legend_item = entry['legend_item']
        value = entry['value']

        # Aggiungi la label al JSON, se non già presente
        if label not in json_result:
            json_result[label] = {}

        # Aggiungi la coppia legend_item:value
        json_result[label][legend_item] = value
    return json_result

def dump_results_into_json(results: List[Dict]):
    with open('output.json', 'w') as json_file:
        json.dump(prepare_json(results), json_file, indent=4)

# Main function
def image_to_json(image_bytes):
    # image = cv2.imread(image_path)
    # Converte i byte dell'immagine in un array NumPy
    image = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)

    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

    # Extract labels and detect bars
    labels = extract_labels(image)

    contours = get_contours(image)
    contours = remove_inner_contours(contours)
    contours = merge_contours(contours)

    associations = associate_labels_to_contours(labels, contours)

    legend_items = extract_legend(image)

    results = extract_values_from_bars(image, associations, legend_items)

    return prepare_json(results)

# Example usage
if __name__ == "__main__":

    image_path = 'test-images/app-1/canvas-screenshot.png'
    test = image_to_json(image_path)
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Could not read image file")

    tesseract_path = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

    # Extract labels and detect bars
    labels = extract_labels(image)
    contours = get_contours(image)

    print("len(contours): ", contours.__len__())

    contours = remove_inner_contours(contours)

    print("len(contours): ", contours.__len__())

    contours = merge_contours(contours)

    print("len(contours): ", contours.__len__())

    associations = associate_labels_to_contours(labels, contours)
    legend_items = extract_legend(image)

    # Estrazione valori numerici dalle barre
    results = extract_values_from_bars(image, associations, legend_items)

    dump_results_into_json(results)

    '''
    index = 0
    for label, contour_box in associations:
        x, y, w, h = label['position']
        cv2.putText(image, str(index), (x, y - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)  # Label in verde
        cv2.putText(image, str(index), contour_box[:2], cv2.FONT_HERSHEY_SIMPLEX, 2, (255, 0, 0), 1)
        cv2.rectangle(image, contour_box[:2], contour_box[2:], (255, 0, 0), 2)  # Contorno in blu
        index+=1

    cv2.imshow("Associations", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    '''

    rois = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        roi = image[y:y + h, x:x + w]  # Estrai la regione
        '''
        plt.figure(figsize=(10, 5))
        plt.title("Roi")
        plt.imshow(cv2.cvtColor(roi, cv2.COLOR_BGR2RGB))
        plt.show(block=True)
        '''
        rois.append(roi)

    # Create debug visualizations
    debug_image = image.copy()

    height, width = image.shape[:2]
    top = int(height * CHART_AREA_MARGINS['top'])

    # Draw labels
    for label in labels:
        x, y, w, h = label['position']
        cv2.rectangle(debug_image, (x, y), (x + w, y + h), (255, 0, 0), 2)
        cv2.putText(debug_image, label['text'], (x, y - 5),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 0, 0), 1)

    # Draw bars
    cv2.drawContours(debug_image, contours, -1, (0, 255, 0), 3)

    # Display debug image
    plt.figure(figsize=(15, 10))
    plt.imshow(cv2.cvtColor(debug_image, cv2.COLOR_BGR2RGB))
    plt.title("Debug Visualization")
    plt.axis('off')
    plt.show()
