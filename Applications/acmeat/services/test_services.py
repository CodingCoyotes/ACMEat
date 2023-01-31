import pycamunda
import pycamunda.processdef

url = 'http://localhost:8080/engine-rest'
start_instance = pycamunda.processdef.StartInstance(url=url, key='order_confirmation', tenant_id="acmeat")
start_instance.add_variable(name='order_id', value="ed0dfc8b-e455-43bf-9e37-77f112438b79")
start_instance.add_variable(name='success', value=False)
start_instance.add_variable(name="paid", value=False)
start_instance.add_variable(name="payment_success", value=False)
start_instance.add_variable(name="TTW", value="PT")
start_instance.add_variable(name="found_deliverer", value=False)
start_instance.add_variable(name="restaurant_accepted", value=False)
a = start_instance()  # A CONTIENE L'ID DEL JOB
print(a.id_)
