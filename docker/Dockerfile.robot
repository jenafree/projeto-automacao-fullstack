FROM python:3.11-slim
WORKDIR /tests
RUN pip install robotframework requests
COPY ./tests/robot .
CMD ["robot", "test_form.robot"]