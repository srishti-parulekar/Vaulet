FROM python:3.9

WORKDIR /app

COPY vaulet/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--chdir", "vaulet", "--bind", "0.0.0.0:8000", "vaulet.wsgi:application"]
