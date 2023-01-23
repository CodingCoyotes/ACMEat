import pycamunda
import pycamunda.processdef

url = 'http://localhost:8080/engine-rest'
start_instance = pycamunda.processdef.StartInstance(url=url, key='order_confirmation', tenant_id="acmeat")
start_instance.add_variable(name='order_id', value="ed0dfc8b-e455-43bf-9e37-77f112438b78")
start_instance()