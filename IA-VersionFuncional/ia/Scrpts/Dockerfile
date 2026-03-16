FROM python:3.12-slim

WORKDIR /app

COPY requirements.docker.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY ia_fastapi2_0.py /app/ia_fastapi2_0.py
COPY sintomas_enfermedades.csv /app/sintomas_enfermedades.csv
COPY treatments.json /app/treatments.json

ENV PORT=5005
EXPOSE 5005

CMD ["python", "/app/ia_fastapi2_0.py"]

