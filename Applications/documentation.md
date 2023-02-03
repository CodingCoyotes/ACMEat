# Documentazione Backend di ACMEat

## Introduzione

Il progetto acmeat, da specifica, richiede la realizzazione di diversi servizi:

* Il servizio centrale ACMEat, utilizzando anche il BPMS Camunda;
* Il servizio bancario, utilizzando Jolie;
* Il servizio delle società di consegna (ACMEDeliver);
* Il servizio delle società di ristorazione (ACMERestaurant);
* Il servizio di geo-localizzazione (ACMEGeolocate);

I backend realizzati, di conseguenza, sono i seguenti:

* **acmeat**, backend REST per interagire con il database di ACMEat e con la coreografia;
* **acmedeliver**, backend REST che rappresenta una società di consegna e ne consente la gestione e utilizzo;
* **acmerestaurant**, backend REST minimale per la gestione utenti di un ristorante e che consente l'autenticazione
  presso ACMEat per la gestione degli ordini;
* **acmegeolocate**, backend REST per la geo-localizzazione (implementata appoggiandosi ad openstreetmap);
* **bank**, backend Jolie per la gestione dei fondi dei clienti, fattorini, ristoranti e di acmeat;
* **bank_intermediary**, backend REST per superare le restrizioni CORS di Jolie, usato solo ed esclusivamente dal
  frontend della banca;

Tutti i backend (fatta eccezione per **bank**) sono stati realizzati con le medesime tecnologie:

* Python 3.8+;
    * fastapi - Framework per la creazione di REST API;
    * bcrypt - Modulo crittografico;
    * beautifulsoup4 - Parsing risposte SOAP;
    * psycopg2-binary - Driver per Postgres;
    * pycamunda - Framework per la comunicazione con Camunda;
    * requests - Framework per la gestione di richieste HTTP;
    * SQLAlchemy - ORM
    * Dipendenze dei moduli sopra indicati;
* Poetry (Package Manager Python);
* Postgres;

## Backend Python

In questa sezione verranno approfonditi i backend sviluppati in Python, ovvero tutti meno **bank**.  
La struttura utilizzata all'interno dei vari backend è identica (in alcuni determinate cartelle potrebbero mancare, in
quanto un certo componente potrebbe non venire utilizzato), ed è così costituita:

* /
    * **database**: contiene la definizione delle tabelle che vengono create all'interno del DB, la definizione di enum
      e l'oggetto Session tramite il quale si interroga la base di dati;
    * **deps**: contiene le dipendenze di Fastapi, un meccanismo che consente di ottenere informazioni prima di entrare
      nel corpo della funzione che gestisce un certo endpoint - ad esempio, sapere in anticipo se un utente è
      autenticato o meno.
    * **errors**: contiene la definizione degli errori personalizzati;
    * **routers**: contiene le funzioni che gestiscono le richieste ai vari endpoint del backend, nella struttura
      gerarchica di cartelle /api/[soggetto]/v1/[soggetto].py;
    * **schemas**: contiene gli schemi di risposta e richiesta accettati dall'applicazione;
    * **services**: contiene il server, il worker e le funzioni necessarie per eseguire le task della coreografia di
      ACMEat;
    * \_\_main\_\_.py: runner del server;
    * authentication.py: modulo per l'autenticazione tramite JWT;
    * configuration.py: modulo per la configurazione dell'applicazione;
    * crud.py: modulo che contiene funzioni di utility per la creazione, l'aggiornamento e la ricerca di dati all'
      interno del database;
    * dependencies.py: modulo che contiene funzioni da cui dipendono altri moduli dell'applicazione;
    * handlers.py: gestori di eccezioni specifici per l'applicazione;
    * responses.py: risposte personalizzate non-json;

### Parametri di configurazione

Al fine di poter operare, è necessario che ai backend vengano fornite le corrette variabili d'ambiente.

##### acmeat

* JWT_KEY=pippo: la password con cui i JWT vengono cifrati;
* DB_URI=postgresql://postgres:password@localhost/acmeat: l'uri del database di acmeat;
* BIND_IP=127.0.0.1: l'indirizzo ip su cui eseguire il binding del socket;
* BIND_PORT=8004: la porta su cui eseguire il binding del socket;
* BANK_URI=http://127.0.0.1:2000: l'indirizzo a cui contattare la banca;
* BANK_USERNAME=acmeat: l'username per l'accesso alla banca;
* BANK_PASSWORD=password: la password per l'accesso alla banca;

#### acmedeliver

* JWT_KEY=pippo: la password con cui i JWT vengono cifrati;
* DB_URI=postgresql://postgres:password@localhost/acmedeliver: l'uri del database di acmedeliver;
* BIND_IP=127.0.0.1: l'indirizzo ip su cui eseguire il binding del socket;
* BIND_PORT=8003: la porta su cui eseguire il binding del socket;
* PRICE_PER_KM=2: il costo per chilometro della società di spedizioni;
* GEOLOCATE_URL=http://127.0.0.1:8001: l'indirizzo a cui contattare il servizio di geo-localizzazione;

#### acmegeolocate

* BIND_IP=127.0.0.1: l'indirizzo ip su cui eseguire il binding del socket;
* BIND_PORT=8001: la porta su cui eseguire il binding del socket;

#### acmerestaurant

* JWT_KEY=pippo: la password con cui i JWT vengono cifrati;
* DB_URI=postgresql://postgres:password@localhost/acmerestaurant: l'uri del database di acmerestaurant;
* BIND_IP=127.0.0.1: l'indirizzo ip su cui eseguire il binding del socket;
* BIND_PORT=8007: la porta su cui eseguire il binding del socket;
* ACME_EMAIL=owner1@gmail.com: l'email del proprietario dell'attività tramite la quale accede ad ACMEat;
* ACME_PASSWORD=password: la password del proprietario dell'attività tramite la quale accede ad ACMEat;
* ACME_RESTAURANT_ID=59294bd6-f61b-48a2-9f53-f76d378b95d9: l'id del ristorante su ACMEat;
* ACME_URL=http://127.0.0.1:8004: l'indirizzo a cui contattare ACMEat;

#### bank_intermediary

* BIND_IP=127.0.0.1: l'indirizzo ip su cui eseguire il binding del socket;
* BIND_PORT=8006: la porta su cui eseguire il binding del socket;
* BANK_URI=http://127.0.0.1:2000: l'indirizzo a cui contattare la banca;

### Dettagli sui backend

In questa sezione, verranno specificate le caratteristiche dei vari backend. Per informazioni sulle route disponibili
per ogni backend, visitare la pagina /docs dei backend una volta avviati. Per la documentazione del codice, visionare il
sorgente e relativi commenti.

#### acmeat

Acmeat è il backend principale, e consente di:

* Permettere a nuovi utenti di iscriversi al servizio, in veste di cliente o ristoratore;
* Registrare un ristorante e gestirne le caratteristiche, menu inclusi;
* Permettere agli utenti di eseguire ordinazioni presso un locale, e tramite la coreografia Camunda gestirne il ciclo di
  vita;
* Permettere agli amministratori di registrare città in cui il serizio è attivo, e gestire la lista dei fattorini
  affiliati ad ACMEat;

Tutte le informazioni necessarie vengono immagazzinate all'interno di una base di dati così strutturata:  
[Immagine qui]

Il ciclo di vita di un ordine passa attraverso le seguenti fasi:

* **Created**: l'ordine è stato appena creato;
* **w_restaurant_ok**: l'ordine è in attesa di conferma da parte del ristorante;
* **w_deliverer_ok**: l'ordine è in attesa di conferma da parte di un fattorino;
* **confirmed_by_thirds**: l'ordine è stato confermato dalle terze parti (ristorante e fattorino);
* **cancelled**: l'ordine è stato cancellato, dall'utente oppure dal processo camunda per problemi riscontrati;
* **w_payment**: l'ordine è in attesa di essere pagato. Se non pagato entro 5 minuti, o pagato in modo errato, verrà
  cancellato;
* **w_cancellation**: l'ordine può venire cancellato dall'utente fino ad un'ora prima dall'orario indicato;
* **w_kitchen**: l'ordine sta venendo preparato in cucina;
* **w_transport**: l'ordine è in attesa del fattorino;
* **delivering**: l'ordine è in consegna;
* **delivered**: l'ordine è stato consegnato;

Gli utenti di acmeat possono appartenere ad una di tre categorie:

* **Cliente**: Possono solo creare ordini e gestire i propri, può creare un ristorante (a quel punto il tipo di utente
  verrà modificato);
* **Ristoratore**: Può gestire il proprio locale e crearne di nuovi, oltre ai privilegi del cliente;
* **Amministratore**: Può gestire la lista delle città e dei fattorini;

Le società di consegna accedono ai sistemi di acmeat tramite un token, e questo consente loro di aggiornare lo stato
dell'ordine (da "in consegna" a "consegnato")

##### ACMEmanager

ACMEmanager è il server a cui la coreografia camunda delega l'esecuzione dei job. Le task vengono svolte da un worker,
il quale è in ascolto per i seguenti topic:

* **restaurant_confirmation**: ricezione di una conferma (o meno) da parte del ristorante;
* **deliverer_preview**: ottenimento dei preventivi dei fattorini nel raggio di 10km dal locale;
* **deliverer_confirmation**: conferma con il fattorino con il prezzo minore dell'ordine;
* **payment_request**: attesa della ricezione di un pagamento da parte dell'utente;
* **payment_received**: verifica del pagamento ricevuto con la banca;
* **confirm_order**: conferma dell'ordine;
* **restaurant_abort**: notifica annullamento ordine dal lato del ristoratore;
* **deliverer_abort**: notifica annullamento ordine dal lato del fattorino;
* **user_refund**: se pagato, l'ordine viene rimborsato all'utente;
* **order_delete**: l'ordine viene indicato come cancellato;
* **pay_restaurant**: acmeat paga il ristorante;
* **pay_deliverer**: acmeat paga il fattorino;

A questi topic corrispondono funzioni omonime, le quali utilizzano le seguenti variabili di processo:

* **order_id**: l'id dell'ordine interno ad acmeat;
* **success**: flag che indica se l'ultima operazione ha avuto successo o meno;
* **paid**: flag che indica se l'ordine è stato pagato;
* **payment_success**: flag che indica se l'ordine è stato pagato correttamente;
* **TTW**: TimeToWait, durata in secondi alla fine del periodo di cancellazione;
* **found_deliverer**: flag che indica se è stato trovato un fattorino;
* **restaurant_accepted**: flag che indica se il ristorante ha accettato la richiesta;

Il worker è basato su Pycamunda, è multithreaded ed è in grado di interagire con il database tramite SQLAlchemy.  
Le richieste fatte alla banca vengono trasmesse tramite soap.

#### acmedeliver

Acmedeliver è il backend che rappresenta un'azienda di consegne. Permette di:

* Gestire il personale;
* Gestire e ricevere richieste di consegna;
* Gestire la lista dei propri clienti, a cui viene dato accesso;
* Aggiornare il cliente sullo stato della consegna;

Tutte le informazioni necessarie vengono immagazzinate all'interno di una base di dati così strutturata:  
[Immagine qui]

Gli utenti di acmedeliver possono essere fattorini oppure amministratori, dove gli amministratori sono in grado di
aggiungere fattorini all'azienda.

#### acmegeolocate

Acmegeolocate è il backend che fornisce il servizio di geo-localizzazione. Dato lo stato, la città, la via e il numero
civico utilizza openstreetmap per ricavarne le coordinate, e in base alla richiesta fornire la distanza tra i due punti
in km.

#### acmerestaurant

Acmerestaurant è il backend che fornisce autenticazione alle richieste del ristorante, che comunica poi con acmeat.  
Gli utenti contenuti all'interno del database non sono utenti di acmeat, ma del ristorante (ad esempio, ogni cameriere
può avere un account all'interno del ristorante), e le richieste vengono fatte a nome del titolare del ristorante (che
ha un account su acmeat). Il backend consente di eseguire un numero limitato di operazioni, ovvero la lettura degli
ordini e accettare/rifiutare/consegnare (ad un fattorino) un ordine.  
La gestione dei menu, così come degli orari di apertura e delle altre caratteristiche del ristorante è da eseguire su
acmeat.

La struttura del database è la seguente:  
[Immagine qui]

#### bank_intermediary

Intermediario per superare il blocco CORS di Jolie, si limita a inoltrare le richieste che gli arrivano in "
simil-soap" (soap dentro un oggetto json) al backend della banca. Viene usato solo ed esclusivamente dal frontend di
acmebank.

### Istruzioni per l'avvio in ambiente di testing

1. Installare postgresql, python3 e poetry;
2. Creare un database per l'applicazione che si vuole avviare;
3. Clonare il repository github;
4. Entrare nella cartella "Applications" del repository, eseguire il comando ```poetry install```;
5. Eseguire il comando ```poetry shell```;
6. Impostare le variabili d'ambiente richieste dal servizio desiderato;
7. Eseguire il comando ```python -m ${service_name}```;

Se si vuol eseguire il servizio acmeat, è necessario preparare anche Camunda:

8. Installare Camunda Platform e Camunda Modeler;
9. Caricare i processi "acmeat_order_confirmation" e "acmeat_restaurant_closings_reset" con tenant_id "acmeat";
10. Eseguire tramite la poetry shell lo script ```Applications/acmeat/services/ACMEManager.py``` e con le stesse
    variabili d'ambiente di acmeat;

### Istruzioni per il deployment in produzione

In questa sezione, vengono indicati i passaggi necessari per il deployment dell'applicazione in produzione.  
Si suppone l'utilizzo del sistema operativo Ubuntu, e vengono omessi i passaggi per la realizzazione del reverse poxy e
dei certificati per l'https.

#### Setup iniziale

1. Da root, inserire il comando ```useradd ${nome_servizio}```;
2. Da root, creare inserire il comando ```adduser user"``` per creare un utente con cui proseguire la configurazione;
3. Da root, inserire il comando ```"usermod -aG sudo user"``` per inserire l'utente user nel gruppo sudoers;
4. Eseguire l'accesso con l'utente user;

#### Installazione dipendenze software

1. Inserire il comando ```sudo apt-get update```;
2. Inserire il comando ```sudo apt-get install postgresql python3```
3. Eseguire il comando ```curl -sSL https://install.python-poetry.org | python3 -``` per installare poetry

#### Setup del singolo backend

1. Spostarsi nella cartella "/srv" e scaricare il repository git;
2. Spostarsi nella sottocartella del repository "Applications";
3. Eseguire l'accesso come l'utente ```${nome_servizio}```
4. Installare le dipendenze tramite poetry install. Sarà necessario capire quale sia il percorso dell'ambiente creato,
   il quale dovrebbe essere sotto la cartella ```/home/${nome_servizio}/.cache/pypoetry/virtualenvs/``` e a cui ci si
   riferirà come ```${poetry_path}```;
5. Eseguire l'accesso con l'utente postgres, eseguire il comando psql;
6. Creare il database ```${nome_database}```;
7. Creare l'utente ${nome_servizio} con ```“CREATE USER ‘${nome_servizio}’ WITH ENCRYPTED PASSWORD ‘${password}’;”```;
8. Fornire all'utente appena creato i privilegi sul database
   con ```da “GRANT ALL PRIVILEGES ON DATABASE ${nome_database} TO "${nome_servizio}";”```
9. Inserire il comando ```exit``` 2 volte;
10. Trasferire il possesso della cartella del servizio interessato all'utente ```${nome_servizio}``` con il
    comando ```sudo chown ${nome_servizio} ${cartella_servizio}```

#### Configurazione del server come servizio systemd

1. Creare il file ```${nome_servizio}.service``` nella cartella "/etc/systemd/system" tramite il
   comando ```sudo touch /etc/systemd/system/${nome_servizio}.service```;
2. Creare la cartella ```${nome_servizio}.service.d``` nella cartella "/etc/systemd/system" tramite il
   comando ```sudo mkdir /etc/systemd/system/${nome_servizio}.service.d```;
3. Inserire nel file ```${nome_servizio}.service``` le seguenti righe:

```
[Unit]
Name=${nome_servizio}
Description=${nome_servizio} fastapi server
Wants=network-online.target
After=network-online.target nss-lookup.target

[Service]
Type=exec
User=${nome_servizio}
Group=${nome_servizio}
# Replace with the directory where you cloned the repository
WorkingDirectory=/srv/ACMEat/Applications/${nome_servizio}/
# Replace with the directory where you cloned the repository and the poetry path
ExecStart=/home/${nome_servizio}/.cache/pypoetry/virtualenvs/${poetry_path}/bin/python3 __main__.py

[Install]
WantedBy=multi-user.target
```

4. Creare un file nella cartella appena creata chiamato ```override.conf``` e popolarlo in questo modo, tenendo conto
   delle variabili d'ambiente necessarie per quel particolare servizio:

```
[Service]
Environment=KEY=value
```

5. Ricaricare i file di configurazione dei servizi con ```sudo systemctl daemon-reload```, per poi avviarlo con il
   comando ```sudo systemd start ${nome_servizio}```.

#### Configurazione di Camunda

Questa sezione è necessaria se si sta tentando il deploy del servizio acmeat.

1. Installare tramite docker Camunda Platform;
2. Tramite Camunda Modeler, caricare sul server i processi ""acmeat_order_confirmation" e "
   acmeat_restaurant_closings_reset" con tenant_id "acmeat"";
3. Creare, in modo pressochè analogo al precedente, un servizio systemd per lo
   script ```Applications/acmeat/services/ACMEManager.py``` con le stesse variabili d'ambiente utilizzate per ACMEat

### Post-Installazione

Per poter testare l'applicazione senza dover riempire a mano il database, eseguire lo script ```post_install.py``` nella
cartella "Applications".

## Backend Jolie

[Something something]