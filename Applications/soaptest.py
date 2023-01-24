import requests
from bs4 import BeautifulSoup

url = "http://127.0.0.1:2000"


def generate_soap(payload):
    soap_sample = f"""
    <SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <SOAP-ENV:Body>
            {payload}
        </SOAP-ENV:Body>
    </SOAP-ENV:Envelope>
    """
    return soap_sample


def login(username):
    payload = f"""
        <login>
            <name xsi:type="xsd:string">{username}</name>
        </login>
        """
    response = requests.post(url, data=generate_soap(payload), headers={'content-type': 'text/xml',
                                                                        'SOAPAction': '"/login"'})
    xml = BeautifulSoup(response.content, 'xml')
    return xml.find("sid").contents[0]


print(login("Lorenzo"))