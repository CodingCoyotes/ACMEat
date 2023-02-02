"""
Script di prova per testare i messaggi
"""
from pycamunda.message import CorrelateSingle

url = 'http://localhost:8080/engine-rest'
a = CorrelateSingle(url, message_name="Message_Restaurant",
                    process_instance_id="cb953df5-a306-11ed-90ee-0242ac110002"
                    )
a()