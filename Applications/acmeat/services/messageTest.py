"""
Script di prova per testare i messaggi
"""
from pycamunda.message import CorrelateSingle

url = 'http://localhost:8080/engine-rest'
a = CorrelateSingle(url, message_name="Message_Restaurant",
                    process_instance_id="bb275063-a6c4-11ed-b0d1-0242ac110002"
                    )
a()