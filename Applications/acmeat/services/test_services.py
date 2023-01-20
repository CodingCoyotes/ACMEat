import pycamunda
import pycamunda.processdef

url = 'http://localhost:8080/engine-rest'
start_instance = pycamunda.processdef.StartInstance(url=url, key='order_confirmation', tenant_id="acmeat")
start_instance.add_variable(name='order_id', value="bbf7b4ce-2422-4269-a11d-ab56710fec78")
start_instance()