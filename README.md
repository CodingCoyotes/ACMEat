# ACMEat
[Try it live!](https://codingcoyotes.github.io/ACMEat_Index/)

Main repository for SOA-SwEng exam project @UniBo, A.Y.: 2021/2022.

```
Teachers: Ivan Lanese
          Davide Rossi

Students: Lorenzo Balugani
          Alberto Paparella
          Mae Sosto
```

## Context (IT)
La società ACMEat propone ai propri clienti un servizio che permette di selezionare un menu da uno fra un insieme di locali convenzionati e farselo recapitare a domicilio.

Per poter usufruire del servizio il cliente deve inizialmente selezionare un comune fra quelli nei quali il servizio è attivo. A fronte di questa selezione ACMEat presenta la lista dei locali convenzionati che operano in quel comune e dei menù che offrono. Il cliente può quindi specificare locale e menù di suo interesse e una fascia oraria per la consegna (si tratta di fasce di 15 minuti tra le 12 e le 14 e tra le 19 e le 21).

Segue quindi una fase di pagamento che viene gestita attraverso un istituto bancario terzo al quale il cliente viene indirizzato. A fronte del pagamento l’istituto rilascia un token al cliente il quale lo comunica ad ACMEat, che a sua volta lo usa per verificare con la banca che il pagamento sia stato effettivamente completato. A questo punto l’ordine diventa operativo. I clienti possono comunque ancora annullare l’ordine ma non più tardi di un’ora prima rispetto all’orario di consegna. In tal caso ACMEat chiede alla banca l’annullamento del pagamento.

ACMEat conosce tutti i locali convenzionati nei vari comuni nei quali opera e i loro giorni e orari di operatività. Nel caso in cui un locale non sia disponibile in un giorno in cui dovrebbe normalmente essere aperto è responsabilità del locale stesso contattare ACMEat entro le 10 del mattino comunicando tale indisponibilità. Entro tale orario vanno anche comunicati cambiamenti dei menu proposti (in mancanza di tale comunicazione si assume che siano disponibili gli stessi del giorno precedente). I locali vengono anche contattati ad ogni ordine per verificare che siano effettivamente in grado di far fronte alla richiesta del cliente. In caso negativo l’accettazione dell’ordine si interrompe prima che si passi alla fase di pagamento.

Per la consegna ACMEat si appoggia a più società esterne: per ogni consegna vengono contattate tutte le società che abbiano sede entro 10 chilometri dal comune interessato specificando: indirizzo del locale dove ritirare il pasto, indirizzo del cliente cui recapitarlo e orario previsto di consegna. A fronte di questa richiesta le società devono rispondere entro 15 secondi specificando la loro disponibilità e il prezzo richiesto; ACMEat sceglierà fra le disponibili che avranno risposto nel tempo richiesto quella che propone il prezzo più basso. Nel caso in cui nessuna società di consegna sia disponibile l’ordine viene annullato prima che si passi alla fase di pagamento.
