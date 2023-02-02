# -*- coding: utf-8 -*-
import sys
import typing
from threading import Thread

import pycamunda.externaltask
import pycamunda.variable


class ExternalTaskException(Exception):
    def __init__(
            self, *args, message: str, details: str = '', retry_timeout: int = 10000, **kwargs
    ):
        """Eccezione da sollevare quando la task fallisce.

        :param message: Messaggio d'errore
        :param details: Descrizone del fallimento
        :param retry_timeout: Timeout in ms
        """
        super().__init__(*args, **kwargs)
        self.message = message
        self.details = details
        self.retry_timeout = retry_timeout


class Worker:

    def __init__(
            self,
            url: str,
            worker_id: str,
            max_tasks: int = 10,
            async_response_timeout: int = 1000
    ):
        """Worker che rimane in ascolto per task da eseguire tramite camunda.

        :param url: Camunda Rest engine URL.
        :param worker_id: Id del worker.
        :param max_tasks: Numero massimo di task per fetch.
        :param async_response_timeout: Attesa prima del fetch successivo.
        """
        print("Starting up the ACMEat Camunda External Worker...")
        self.fetch_and_lock = pycamunda.externaltask.FetchAndLock(
            url, worker_id, max_tasks, async_response_timeout=async_response_timeout
        )
        self.complete_task = pycamunda.externaltask.Complete(
            url, id_=None, worker_id=worker_id
        )
        self.url = url
        self.handle_failure = pycamunda.externaltask.HandleFailure(
            url,
            id_=None,
            worker_id=worker_id,
            error_message='',
            error_details='',
            retries=0,
            retry_timeout=0
        )
        self.worker_id = worker_id
        self.stopped = False
        self.topic_funcs = {}
        self.max_tasks = max_tasks
        self.async_response_timeout = async_response_timeout

    def subscribe(
            self,
            topic: str,
            func: typing.Callable,
            lock_duration: int = 16000,
            variables: typing.Iterable[str] = None,
            deserialize_values: bool = False
    ):
        """Iscrive il worker ad un certo topic.

        :param topic: il topic a cui iscriversi.
        :param func: La funzione che esegue la task.
        :param lock_duration: Durata del lock sulla task per il worker.
        :param variables: Variabili di processo.
        :param deserialize_values: Flag, indica se i valori vengono deserializzati lato server.
        """
        print(f"Worker subbed to topic '{topic}'")
        self.fetch_and_lock.add_topic(topic, lock_duration, variables, deserialize_values)
        self.topic_funcs[topic] = func

    def unsubscribe(self, topic):
        """Rimuove un topic dal worker

        :param topic: Il topic da rimuovere.
        """
        for i, topic_ in enumerate(self.fetch_and_lock.topics):
            if topic_['topicName'] == topic:
                del self.fetch_and_lock.topics[i]
                break

    def run(self):
        """
        Esegue il worker
        :return:
        """
        print(f"All Green, worker ready to start.")
        threadlist = []
        while not self.stopped:
            # Viene creata una lista di thread
            tasks = self.fetch_and_lock()
            thread = Thread(target=work, args=(self, tasks))
            print(f"Number of threads: {len(threadlist)}")
            threadlist.append(thread)
            thread.start()
            newlist = []
            for t in threadlist:
                if not t.is_alive():
                    # I thread terminati vengono joinati
                    t.join()
                else:
                    newlist.append(t)
            threadlist = newlist

        print("Shutting down worker...")
        for thread in threadlist:
            try:
                thread.join()
            except Exception:
                pass


def work(worker, tasks):
    """
    Funzione parallelizzata, gestisce le task in parallelo con gli altri thread
    :param worker: il worker
    :param tasks: le task da gestire
    :return:
    """
    handle_failure = pycamunda.externaltask.HandleFailure(
        worker.url,
        id_=None,
        worker_id=worker.worker_id,
        error_message='',
        error_details='',
        retries=0,
        retry_timeout=0
    )
    complete_task = pycamunda.externaltask.Complete(
        worker.url, id_=None, worker_id=worker.worker_id
    )
    for task in tasks:
        try:
            return_variables = worker.topic_funcs[task.topic_name](**task.variables)
        except ExternalTaskException as exc:
            handle_failure.id_ = task.id_
            handle_failure.error_message = exc.message
            handle_failure.error_details = exc.details
            handle_failure.retry_timeout = exc.retry_timeout
            if task.retries is None:
                handle_failure.retries = 3
            else:
                handle_failure.retries = task.retries - 1
            handle_failure()
        else:
            complete_task.variables = {}
            complete_task.id_ = task.id_
            for variable, value in return_variables.items():
                complete_task.add_variable(name=variable, value=value)
            # Se la task non ha avuto successo, il worker non procede e rimane fermo su questa task
            if 'success' not in return_variables.keys() or return_variables['success']:
                try:
                    complete_task()
                except Exception:
                    return
    sys.exit()