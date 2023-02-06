"""
Questo modulo contiene l'implementazione del server che rimane in ascolto tramite un worker per task provenienti dai processi camunda
"""
from acmeat.services.activate_delivery import activate_delivery
from acmeat.services.closings import closings
from acmeat.services.deliverer_abort import deliverer_abort
from acmeat.services.order_delete import order_delete
from acmeat.services.pay_deliverer import pay_deliverer
from acmeat.services.pay_restaurant import pay_restaurant
from acmeat.services.user_refund import user_refund
from worker import Worker
from restaurant_confirmation import restaurant_confirmation
from deliverer_preview import deliverer_preview
from deliverer_confirmation import deliverer_confirmation
from payment_request import payment_request
from payment_received import payment_received
from order_confirm import order_confirm
from restaurant_abort import restaurant_abort


if __name__ == '__main__':
    print("ACMEManager Camunda Server started.")
    url = 'http://localhost:8080/engine-rest'
    worker_id = '1'
    worker = Worker(url=url, worker_id=worker_id)
    # I Topic vengono assegnati al worker
    worker.subscribe(
        topic='restaurant_confirmation',
        func=restaurant_confirmation,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW', 'restaurant_accepted']
    )
    worker.subscribe(
        topic='deliverer_preview',
        func=deliverer_preview,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW', 'found_deliverer']
    )
    worker.subscribe(
        topic='deliverer_confirmation',
        func=deliverer_confirmation,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='payment_request',
        func=payment_request,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='payment_received',
        func=payment_received,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='confirm_order',
        func=order_confirm,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='restaurant_abort',
        func=restaurant_abort,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='deliverer_abort',
        func=deliverer_abort,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='user_refund',
        func=user_refund,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='order_delete',
        func=order_delete,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='activate_delivery',
        func=activate_delivery,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='pay_restaurant',
        func=pay_restaurant,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic='pay_deliverer',
        func=pay_deliverer,
        variables=['order_id', 'success', 'paid', 'payment_success', 'TTW']
    )
    worker.subscribe(
        topic="closings_reset",
        func=closings,
        variables=[]
    )
    worker.run()
