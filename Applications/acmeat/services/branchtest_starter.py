import pycamunda
import pycamunda.processdef
import datetime

url = 'http://localhost:8080/engine-rest'
start_instance = pycamunda.processdef.StartInstance(url=url, key='timetest', tenant_id="test")
start_instance.add_variable(name='variable1', value="PT5S")
start_instance.add_variable(name='variable2', value="PT20S")
start_instance()