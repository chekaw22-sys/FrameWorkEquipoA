# ia_fastapi.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
import pandas as pd
import re
import pickle
import json
import os
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import SGDClassifier
from sklearn.naive_bayes import MultinomialNB

SECRET_KEY = os.getenv("IA_SECRET", "SECRET_KEY_INTERNAL")
MODEL_FILE = "modelo_sintomas.pkl"
DATA_FILE = "sintomas_enfermedades.csv"
TREATMENTS_FILE = "treatments.json"

app = FastAPI()

# Cargar tratamientos
try:
    with open(TREATMENTS_FILE, 'r', encoding='utf-8') as f:
        treatments = json.load(f)
except FileNotFoundError:
    treatments = {}

# ----------------------------
# Pydantic Models
# ----------------------------
class IARequest(BaseModel):
    message: str
    token: str

class IAResponse(BaseModel):
    response: str

class UpdateRequest(BaseModel):
    symptoms: str
    correct_disease: str
    token: str

class UpdateResponse(BaseModel):
    status: str
    message: str

# ----------------------------
# Preprocesamiento y modelo
# ----------------------------
def preprocess_text(text):
    if isinstance(text, str):
        text = text.lower()
        text = re.sub(r'[^a-záéíóú0-9\s]', '', text)
        text = re.sub(r'\s+', ' ', text).strip()
    else:
        text = ""
    return text

def load_or_train_model():
    try:
        with open(MODEL_FILE, 'rb') as file:
            model = pickle.load(file)
        print("Modelo cargado exitosamente")
    except FileNotFoundError:
        print("No se encontró un modelo guardado. Creando uno nuevo.")
        data = pd.read_csv(DATA_FILE)
        data['sintomas'] = data['sintomas'].apply(preprocess_text)
        X = data['sintomas']
        y = data['enfermedad']
        # Pipeline actualizado para coincidir con modelo_ia.py si se reentrena aquí
        model = Pipeline([
           ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
           ('clf', SGDClassifier(loss='hinge', penalty='l2', alpha=1e-4, random_state=42, max_iter=50))
        ])
        model.fit(X, y)
        with open(MODEL_FILE, 'wb') as file:
            pickle.dump(model, file)
    return model

model = load_or_train_model()

def predict_disease(symptoms):
    return model.predict([symptoms])[0]

def get_treatment(disease):
    return treatments.get(disease, "Consulta a un médico especialista para determinar el tratamiento adecuado.")

def update_model(symptoms, correct_disease):
    global model
    data = pd.read_csv(DATA_FILE)
    new_data = pd.DataFrame({'sintomas': [symptoms], 'enfermedad': [correct_disease]})
    data = pd.concat([data, new_data], ignore_index=True)
    data['sintomas'] = data['sintomas'].apply(preprocess_text)
    X = data['sintomas']
    y = data['enfermedad']
    model.fit(X, y)
    with open(MODEL_FILE, 'wb') as file:
        pickle.dump(model, file)
    print(f"Modelo actualizado con la enfermedad: {correct_disease}")

# ----------------------------
# Endpoint de predicción
# ----------------------------
@app.post("/", response_model=IAResponse)
@app.post("/respond", response_model=IAResponse)
def respond(req: IARequest):
    if req.token != SECRET_KEY:
        raise HTTPException(status_code=401, detail="Token inválido")

    user_message = preprocess_text(req.message)
    diagnosis = predict_disease(user_message)
    treatment = get_treatment(diagnosis)
    
    response_text = f"Diagnóstico sugerido: {diagnosis}. \n\nTratamiento recomendado: {treatment}"

    return {"response": response_text}

# ----------------------------
# Endpoint para actualizar modelo
# ----------------------------
@app.post("/update_model", response_model=UpdateResponse)
def update_model_endpoint(req: UpdateRequest):
    if req.token != SECRET_KEY:
        raise HTTPException(status_code=401, detail="Token inválido")
    
    symptoms_clean = preprocess_text(req.symptoms)
    update_model(symptoms_clean, req.correct_disease)
    return UpdateResponse(status="OK", message=f"Modelo actualizado con la enfermedad: {req.correct_disease}")

@app.get("/")
def root():
    return {"status": "ok"}

@app.get("/health")
def health():
    return {"health": "ok"}

# ----------------------------
# Arranque del servidor
# ----------------------------
if __name__ == "__main__":
    # En Railway el env `PORT` es para el puerto público del servicio.
    # Cuando la IA corre junto a otros procesos, usa IA_PORT (default 5005).
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("IA_PORT", "5005")))


