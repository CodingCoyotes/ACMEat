from pycamunda.message import CorrelateSingle

url = 'http://localhost:8080/engine-rest'
a = CorrelateSingle(url, message_name="Message_Payment",
                    process_instance_id="895130c7-a2d0-11ed-90ee-0242ac110002"
                    )
a()