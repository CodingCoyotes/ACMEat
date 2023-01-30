import pycamunda
import pycamunda.processdef
from worker import Worker
from test_common import common
from test_branchA import branch_a
from test_branchB import branch_b


if __name__ == '__main__':
    url = 'http://localhost:8080/engine-rest'
    worker_id = '1'
    worker = Worker(url=url, worker_id=worker_id)
    worker.subscribe(
        topic='common',
        func=common,
        variables=['variable1', 'variable2']
    )
    worker.subscribe(
        topic='branchA',
        func=branch_a,
        variables=['variable1', 'variable2']
    )
    worker.subscribe(
        topic='branchB',
        func=branch_b,
        variables=['variable1', 'variable2']
    )
    worker.run()
