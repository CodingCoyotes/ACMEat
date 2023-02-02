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
        """Exception to be raised when a service task fails.

        :param message: Error message that describes the reason of the failure.
        :param details: Error description.
        :param retry_timeout: Timeout in milliseconds until the external task becomes available.
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
        """Worker that fetches and completes external Camunda service tasks.

        :param url: Camunda Rest engine URL.
        :param worker_id: Id of the worker.
        :param max_tasks: Maximum number of tasks the worker fetches at once.
        :param async_response_timeout: Long polling in milliseconds.
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
            lock_duration: int = 10000,
            variables: typing.Iterable[str] = None,
            deserialize_values: bool = False
    ):
        """Subscribe the worker to a certain topic.

        :param topic: The topic to subscribe to.
        :param func: The callable that is executed for a task of the respective topic.
        :param lock_duration: Duration the fetched tasks are locked for this worker in milliseconds.
        :param variables: Variables to request from the Camunda process instance.
        :param deserialize_values: Whether serializable variables values are deserialized on server
                                   side.
        """
        print(f"Worker subbed to topic '{topic}'")
        self.fetch_and_lock.add_topic(topic, lock_duration, variables, deserialize_values)
        self.topic_funcs[topic] = func

    def unsubscribe(self, topic):
        """Unsubscribe the worker from a topic.

        :param topic: The topic to unsubscribe from.
        """
        for i, topic_ in enumerate(self.fetch_and_lock.topics):
            if topic_['topicName'] == topic:
                del self.fetch_and_lock.topics[i]
                break

    def run(self):
        """Run the worker."""
        print(f"All Green, worker ready to start.")
        threadlist = []
        while not self.stopped:
            tasks = self.fetch_and_lock()
            thread = Thread(target=work, args=(self, tasks))
            print(f"Number of threads: {len(threadlist)}")
            threadlist.append(thread)
            thread.start()
            newlist = []
            for t in threadlist:
                if not t.is_alive():
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
            if 'success' not in return_variables.keys() or return_variables['success']:
                try:
                    complete_task()
                except Exception:
                    return
    sys.exit()