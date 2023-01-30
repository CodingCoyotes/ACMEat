from pycamunda.message import CorrelateSingle

url = 'http://localhost:8080/engine-rest'
a = CorrelateSingle(url, message_name="Message_Payment",
                    process_instance_id="f7dbf937-a08b-11ed-a678-0242ac110002"
                    )
a()