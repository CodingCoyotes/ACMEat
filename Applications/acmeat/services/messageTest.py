"""
Script di prova per testare i messaggi
"""
from pycamunda.message import CorrelateSingle

url = 'http://localhost:8080/engine-rest'
a = CorrelateSingle(url, message_name="Message_Abort",
                    process_instance_id="ad9154f3-a399-11ed-8754-0242ac110002"
                    )
a()