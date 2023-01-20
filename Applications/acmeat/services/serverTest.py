import pycamunda
import pycamunda.processdef
from worker import Worker
from restaurant_confirmation import restaurant_confirmation
from deliverer_preview import deliverer_preview
from deliverer_confirmation import deliverer_confirmation
from payment_request import payment_request
from payment_received import payment_received


if __name__ == '__main__':
    url = 'http://localhost:8080/engine-rest'
    worker_id = '1'
    worker = Worker(url=url, worker_id=worker_id)
    worker.subscribe(
        topic='restaurant_confirmation',
        func=restaurant_confirmation,
        variables=['order_id']
    )
    worker.subscribe(
        topic='deliverer_preview',
        func=deliverer_preview,
        variables=['order_id']
    )
    worker.subscribe(
        topic='deliverer_confirmation',
        func=deliverer_confirmation,
        variables=['order_id']
    )
    worker.subscribe(
        topic='payment_request',
        func=payment_request,
        variables=['order_id']
    )
    worker.subscribe(
        topic='payment_received',
        func=payment_received,
        variables=['order_id']
    )

    worker.run()
