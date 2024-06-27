FROM python:3.12.2

ENV DATABASE_URI=mongodb+srv://atlasmongodbcluster:IY58P5M18d25zmR4@cloudcomputingcluster.zdbl9bs.mongodb.net

WORKDIR /usr/app

COPY CloudCronJob/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY CloudCronJob/. .

CMD ["python", "app.py"]
