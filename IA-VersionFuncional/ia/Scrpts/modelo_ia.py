import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.pipeline import make_pipeline
import pickle
import re
import json
import os

# Cargar datos desde un CSV o DataFrame
data = pd.read_csv('sintomas_enfermedades.csv')

# Cargar tratamientos
try:
    with open('treatments.json', 'r', encoding='utf-8') as f:
        treatments = json.load(f)
except FileNotFoundError:
    treatments = {}

# Preprocesar los síntomas
def preprocess_text(text):
    if isinstance(text, str):
        text = text.lower()
        text = re.sub(r'[^a-záéíóú0-9\s]', '', text)
        # Eliminar espacios extra
        text = re.sub(r'\s+', ' ', text).strip()
    else:
        text = ""
    return text

# Aplicar el preprocesamiento
data['sintomas'] = data['sintomas'].apply(preprocess_text)

# Dividir los datos
X = data['sintomas']
y = data['enfermedad']

# Dividir en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

# Crear un pipeline optimizado: Tfidf + SVM (SGDClassifier)
# SVM lineal suele ser mejor y más ligero que Naive Bayes para texto
model = make_pipeline(
    TfidfVectorizer(
        ngram_range=(1, 2),  # Usar unigramas y bigramas para capturar contexto
        strip_accents='unicode',
        use_idf=True
    ),
    SGDClassifier(
        loss='hinge',        # SVM lineal
        penalty='l2',
        alpha=1e-4,
        random_state=42,
        max_iter=50,
        tol=None
    )
)

# Entrenar el modelo
model.fit(X_train, y_train)

# Guardar el modelo entrenado
with open('modelo_sintomas.pkl', 'wb') as file:
    pickle.dump(model, file)

print("Modelo optimizado (SVM) entrenado y guardado con éxito.")

# Función para predecir enfermedades a partir de síntomas
def predict_disease(symptoms):
    cleaned_symptoms = preprocess_text(symptoms)
    prediction = model.predict([cleaned_symptoms])
    disease = prediction[0]
    return disease

# Función para obtener tratamiento
def get_treatment(disease):
    return treatments.get(disease, "Consulta a un médico especialista para determinar el tratamiento adecuado.")

# Función para actualizar el modelo
def update_model(symptoms, correct_disease):
    global model
    # Recargar datos
    data = pd.read_csv('sintomas_enfermedades.csv')
    new_data = pd.DataFrame({'sintomas': [symptoms], 'enfermedad': [correct_disease]})
    data = pd.concat([data, new_data], ignore_index=True)
    data['sintomas'] = data['sintomas'].apply(preprocess_text)
    
    X = data['sintomas']
    y = data['enfermedad']
    
    model.fit(X, y)
    
    with open('modelo_sintomas.pkl', 'wb') as file:
        pickle.dump(model, file)
    
    print(f"Modelo actualizado con la enfermedad: {correct_disease}")

# Ejemplo de uso:
if __name__ == "__main__":
    while True:
        symptoms_input = input("Introduce los síntomas del paciente (o 'salir' para terminar): ")
        if symptoms_input.lower() == 'salir':
            print("Finalizando...")
            break
        
        # Predicción del modelo
        diagnosis = predict_disease(symptoms_input)
        treatment = get_treatment(diagnosis)
        
        print(f"Diagnóstico sugerido: {diagnosis}")
        print(f"Tratamiento recomendado: {treatment}")
        
        # Confirmación del diagnóstico (solo para test local)
        correct = input("¿Es este diagnóstico correcto? (sí/no): ").lower()
        
        if correct == 'no':
            correct_disease = input("¿Cuál es la enfermedad correcta?: ")
            update_model(symptoms_input, correct_disease)
