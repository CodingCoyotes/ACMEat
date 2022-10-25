import time
from camunda.external_task.external_task import ExternalTask, TaskResult
from camunda.external_task.external_task_worker import ExternalTaskWorker

# configuration for the Client
default_config = {
    "maxTasks": 100,
    "lockDuration": 100,
    "asyncResponseTimeout": 5000,
    "retries": 3,
    "retryTimeout": 5000,
    "sleepSeconds": 30
}


def echo_task(task: ExternalTask) -> TaskResult:
    """
    This task handler you need to implement with your business logic.
    After completion of business logic call either task.complete() or task.failure() or task.bpmn_error()
    to report status of task to Camunda
    """
    # add your business logic here
    # ...
    username = task.get_variable("username")
    print(username)
    # pass any output variables you may want to send to Camunda as dictionary to complete()
    return task.complete({"username": username})

if __name__ == '__main__':
    print("Hi")
    ExternalTaskWorker(worker_id="1", config=default_config).subscribe("echo", echo_task)
