from pycamunda.message import CorrelateSingle

url = 'http://localhost:8080/engine-rest'
a = CorrelateSingle(url, message_name="Message_Payment",
                    process_instance_id="89b4b6a6-a154-11ed-b359-0242ac110002"
                    )
a()