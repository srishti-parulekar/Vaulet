FROM python:3.9

WORKDIR /app

COPY vaulet/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["gunicorn", "--bind", "0.0.0.0:$PORT", "vaulet.wsgi:application"]