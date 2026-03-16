
import pandas as pd
import random

# Definir diccionario de enfermedades y sus conjunto de síntomas probables
diseases_symptoms = {
    "Esquizofrenia": [
        "alucinaciones visuales", "alucinaciones auditivas", "pensamientos confusos", "aislamiento social", 
        "delirios", "voces en la cabeza", "paranoia", "comportamiento desorganizado", "falta de emoción", 
        "habla incoherente", "miedo irracional", "agitación"
    ],
    "Infarto": [
        "dolor en el pecho", "falta de aire", "sudoración excesiva", "opresión torácica", "dolor en el brazo izquierdo", 
        "mareos", "náuseas", "palpitaciones", "ansiedad repentina", "dolor en la mandíbula", "fatiga inusual"
    ],
    "Cáncer de pulmón": [
        "tos persistente", "sangre en el esputo", "dificultad respiratoria", "dolor en el pecho al toser", "pérdida de peso", 
        "fatiga", "ronquera", "infecciones respiratorias frecuentes", "dolor de huesos", "dolor de cabeza"
    ],
    "Depresión mayor": [
        "falta de interés", "tristeza profunda", "cansancio extremo", "insomnio", "exceso de sueño", 
        "cambios en el apetito", "sentimientos de inutilidad", "dificultad para concentrarse", "agitación", "pensamientos de muerte"
    ],
    "Migraña": [
        "dolor de cabeza severo", "náuseas", "sensibilidad a la luz", "sensibilidad al sonido", "vómitos", 
        "visión borrosa", "puntos ciegos", "hormigueo en la cara", "mareos", "latidos en la cabeza"
    ],
    "Diabetes tipo 2": [
        "sed excesiva", "orina frecuente", "hambre extremo", "pérdida de peso inexplicable", "fatiga", 
        "visión borrosa", "llagas que no sanan", "infecciones frecuentes", "zonas de piel oscura", "hormigueo en manos"
    ],
    "Hipotiroidismo": [
        "fatiga", "aumento de peso", "piel seca", "frío constante", "estreñimiento", 
        "debilidad muscular", "colesterol alto", "dolor en las articulaciones", "cabello fino", "depresión", "memoria deficiente"
    ],
    "Enfermedad de Alzheimer": [
        "pérdida de memoria", "desorientación", "confusión", "dificultad para hablar", "cambios de personalidad", 
        "dificultad para realizar tareas", "perder objetos", "problemas visuales", "aislamiento", "ansiedad"
    ],
    "Asma": [
        "dificultad para respirar", "sibilancias", "tos nocturna", "presión en el pecho", "falta de aire al hacer ejercicio", 
        "ataques de tos", "respiración rápida", "cansancio", "problemas para dormir", "infecciones respiratorias"
    ],
    "Gripe": [
        "fiebre alta", "dolores musculares", "tos seca", "fatiga extrema", "dolor de garganta", 
        "secreción nasal", "dolor de cabeza", "escalofríos", "sudoración", "vómitos"
    ],
    "Anemia ferropénica": [
        "fatiga extrema", "debilidad", "piel pálida", "dolor en el pecho", "latidos cardíacos rápidos", 
        "falta de aliento", "dolor de cabeza", "mareos", "manos y pies fríos", "uñas quebradizas"
    ]
}

templates = [
    "El paciente presenta {}.",
    "Sufre de {}.",
    "Tiene síntomas como {}.",
    "Se queja de {}.",
    "Experimenta {} de forma recurrente.",
    "Reporta tener {}.",
    "Los síntomas incluyen {}.",
    "Muestra signos de {}.",
    "El cuadro clínico incluye {}.",
    "{}, y además presenta otros signos."
]


data = []

# Generar 200 casos por cada enfermedad definida (aprox 2200 casos nuevos)
for disease, symptoms_list in diseases_symptoms.items():
    for _ in range(200):
        # Seleccionar de 2 a 5 síntomas aleatorios
        num_symptoms = random.randint(2, 5)
        selected_symptoms = random.sample(symptoms_list, min(num_symptoms, len(symptoms_list)))
        
        # Unir síntomas de forma natural
        if len(selected_symptoms) > 1:
            symptoms_text = ", ".join(selected_symptoms[:-1]) + " y " + selected_symptoms[-1]
        else:
            symptoms_text = selected_symptoms[0]
            
        # Elegir un template aleatorio
        template = random.choice(templates)
        full_text = template.format(symptoms_text)
        
        data.append([full_text, disease])

# Crear DataFrame y guardar
new_df = pd.DataFrame(data, columns=["sintomas", "enfermedad"])

# Cargar el CSV existente para no perder los datos originales
try:
    existing_df = pd.read_csv("sintomas_enfermedades.csv")
    final_df = pd.concat([existing_df, new_df], ignore_index=True)
except FileNotFoundError:
    final_df = new_df

# Guardar
final_df.to_csv("sintomas_enfermedades.csv", index=False)
print(f"Dataset expandido. Total de casos: {len(final_df)}")
