FROM python:3.12.2

WORKDIR /usr/app

COPY CloudStorage/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY CloudStorage/. .

CMD ["waitress-serve", "--call", "__init__:main"]
