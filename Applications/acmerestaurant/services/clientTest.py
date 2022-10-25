from camunda.client.engine_client import EngineClient


def main():
    client = EngineClient()
    resp_json = client.start_process(process_key="echo_test", variables={"username": "test"},
                                     tenant_id="test")
    print(resp_json)


if __name__ == '__main__':
    main()