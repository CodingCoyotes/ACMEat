"""
Script per la configurazione degli applicativi - post installazione
"""
import requests
import json

acmeat_config = {}


def get_access_token(url, email, password):
    r = requests.post(url + "/token",
                      data={"grant_type": "password", "username": email, "password": password})
    token = r.json()
    return token


def configure_acmeat():
    url = input("Inserire url backend acmeat: ")
    # Creazione città
    acmeat_admin_token = get_access_token(url, "admin@admin.com", "password")
    r = requests.post(url + "/api/cities/v1",
                      headers={"Authorization": "Bearer " + acmeat_admin_token['access_token'],
                               "Content-Type": "application/json",
                               "Accept": "application/json"},
                      data=json.dumps({"name": "Modena", "nation": "Italia"}))
    city = r.json()
    # Creazione ristoratore
    r = requests.post(url + "/api/user/v1",
                      headers={"Content-Type": "application/json",
                               "Accept": "application/json"},
                      data=json.dumps({"name": "Francesco", "surname": "Baldassarri", "email": "owner1@gmail.com",
                                       "password": "password"}))
    if r.status_code != 200:
        return
    # Creazione ristorante
    acmeat_token = get_access_token(url, "owner1@gmail.com", "password")
    r = requests.post(url + "/api/restaurants/v1",
                      headers={"Authorization": "Bearer " + acmeat_token['access_token'],
                               "Content-Type": "application/json",
                               "Accept": "application/json"},
                      data=json.dumps({"name": "Trattoria Da Gianni", "address": "via cesare razzaboni", "number": "12",
                                       "open_times": [{"day": "lunedi", "time": "12-15;19-22"},
                                                      {"day": "martedi", "time": "12-15;19-22"},
                                                      {"day": "mercoledi", "time": "12-15;19-22"},
                                                      {"day": "giovedi", "time": "12-15;19-22"},
                                                      {"day": "venerdi", "time": "12-15;19-22"},
                                                      {"day": "sabato", "time": "12-15;19-22"},
                                                      {"day": "domenica", "time": "12-15"}],
                                       "closed": False,
                                       "bank_address": "TrattoriaGianni",
                                       "city_id": city['id']}))
    if r.status_code != 200:
        return
    restaurant = r.json()
    print(f"L'id del ristorante è {restaurant['id']}. Il proprietario ha le credenziali owner1@gmail.com e password.\n"
          f"Ricordarsi di inserire queste informazioni nelle variabili d'ambiente del backend del ristorante.")
    # Creazione menu
    r = requests.post(url + "/api/menus/v1/" + restaurant['id'],
                      headers={"Authorization": "Bearer " + acmeat_token['access_token'],
                               "Content-Type": "application/json",
                               "Accept": "application/json"},
                      data=json.dumps({"name": "Menu Pizza",
                                       "contents": [
                                           {"name": "Pizza Margherita", "desc": "Una pizza con mozzarella e pomodoro"}],
                                       "cost": 10,
                                       "hidden": False}))
    # Creazione fattorini
    n = input("Quanti fattorini sono affiliati ad acmeat?")
    try:
        n = int(n)
    except Exception:
        return
    for i in range(n):
        print("Creazione SDS #1\n")
        nome = input("Nome SDS: ")
        url_api = input("URL Api: ")
        nazione = input("Nazione: ")
        citta = input("Citta': ")
        indirizzo = input("Indirizzo: ")
        numero_civico = input("Numero Civico: ")
        conto = input("Conto: ")

        # Login presso il fattorino con account amministrativo
        acmedeliver_token = get_access_token(url_api, "admin@admin.com", "password")

        r = requests.post(url_api + "/api/client/v1/",
                          headers={"Authorization": "Bearer " + acmedeliver_token['access_token'],
                                   "Content-Type": "application/json",
                                   "Accept": "application/json"},
                          data=json.dumps({"name": "Acmeat", "api_url": url,
                                           "remote_api_key": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}))
        client = r.json()

        r = requests.post(url + "/api/deliverers/v1/",
                          headers={"Authorization": "Bearer " + acmeat_admin_token['access_token'],
                                   "Content-Type": "application/json",
                                   "Accept": "application/json"},
                          data=json.dumps({"name": nome, "api_url": url_api, "nation": nazione, "city": citta,
                                           "address": indirizzo,
                                           "number": numero_civico, "bank_address": conto,
                                           "external_api_key": client['api_key'],
                                           "api_key": "3fa85f64-5717-4562-b3fc-2c963f66afa6"}))
        deliverer = r.json()

        r = requests.put(url_api + "/api/client/v1/" + client['id'],
                         headers={"Authorization": "Bearer " + acmedeliver_token['access_token'],
                                  "Content-Type": "application/json",
                                  "Accept": "application/json"},
                         data=json.dumps({"name": "Acmeat", "api_url": url,
                                          "remote_api_key": deliverer['api_key']}))
        client = r.json()
    print("Configurazione ACMEat e collegamento con fattorini completato.")


def configure_deliverer():
    n = input("Quanti fattorini vanno impostati?")
    try:
        n = int(n)
    except Exception:
        return
    for i in range(n):
        print("Setup SDS #1\n")
        url = input("URL Api: ")

        # Login presso il fattorino con account amministrativo
        acmedeliver_token = get_access_token(url, "admin@admin.com", "password")

        r = requests.post(url + "/api/user/v1",
                          headers={"Authorization": "Bearer " + acmedeliver_token['access_token'],
                                   "Content-Type": "application/json",
                                   "Accept": "application/json"},
                          data=json.dumps({"name": "Lorenzo", "surname": "Facchini", "email": "fattorino1@gmail.com",
                                           "password": "password"}))
        fattorino = r.json()
    print("Setup SDS completato!")


if __name__ == "__main__":
    print("Utilità di setup dati iniziale per il progetto acmeat.")
    print("Prima di eseguire questo programma, assicurarsi di aver avviato con successo almeno una volta i backend, "
          "al fine di consentire la creazione delle tabelle.")
    ans = input("Si vuole proseguire? (y/n) ")
    if ans.lower() != "y":
        exit()
    ans = input("Si vuole configurare il servizio acmeat? (y/n) ")
    if ans.lower() == "y":
        configure_acmeat()
    ans = input("Si vogliono configurare i fattorini? (y/n) ")
    if ans.lower() == "y":
        configure_deliverer()
