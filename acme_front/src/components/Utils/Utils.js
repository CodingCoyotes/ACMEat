//get number of the day of today
export function getNumDay(time) {
    let today = new Date();
    let sDay = "";
    let list = [];
    switch (today.getDay()) {
        case 1:
            sDay = "lunedi"
            break;
        case 2:
            sDay = "martedi"
            break;
        case 3:
            sDay = "mercoledi"
            break;
        case 4:
            sDay = "giovedi"
            break;
        case 5:
            sDay = "venerdi"
            break;
        case 6:
            sDay = "sabato"
            break;
        case 0:
            sDay = "domenica"
            break;
    }
    return sDay;
}

export function DateToString(info) {
    const dateFormat = new Date(info * 1000)
    let string = "Il " + dateFormat.getDate() +
        "/" + (dateFormat.getMonth() + 1) +
        "/" + dateFormat.getFullYear() +
        " alle " + dateFormat.getHours() +
        ":" + dateFormat.getMinutes() +
        ":" + dateFormat.getSeconds();
    return string;
}

//ritorna true se sono passate le 10 di oggi, false altrimenti
export function checkTodayAfterTen(){
    let today = new Date();
    let ten = new Date();
    ten.setHours(10);
    ten.setMinutes(0);
    return ten < today;
}

//divide la stringa del tempo 9-15/19-22 in [9,15,19,22]
export function splitTime(time){
    let pran1 = ""
    let pran2 = ""
    let cen1 = ""
    let cen2 = ""
    let split = time.split("/")
    if(split[0] !== ""){
        let s = split[0].split("-")
        pran1= s[0];
        pran2= s[1];
    }
    if(split[1] !== ""){
        let s = split[1].split("-")
        cen1= s[0];
        cen2= s[1];
    }
    return [pran1, pran2, cen1, cen2];
}

//dati due orari, restituisce la lista degli slot orari in un array a distanza di 15 minuti
export function getSlots(ora1, ora2){
    let list = [];
    let time = new Date();
    let h = "";
    let now = new Date();
    if(ora1 !== ""){
        time.setHours(ora1);
        time.setMinutes(0);
        h = time.getHours();
        while (h < ora2){
            time.setMinutes(time.getMinutes() + 15);
            h = time.getHours();

            if(time > now)
                list = list.concat(time.getHours() + ":" + time.getMinutes());
        }
    }
    return list;
}

//controlla se nel giorno di oggi il ristorante è già chiuso
export function checkClosed(time){
    let today = new Date();
    let sDay =getNumDay(today.getDay());
    let orari = [];
    let chiusura = new Date()
    time.map(item =>{
        if(item.day === sDay){
            orari = splitTime(item.time)
            if(orari[3] === ""){
                return false;
            }
            else{
                chiusura.setHours(orari[3])
                if(chiusura < today){
                    return true;
                }
            }
        }
    })
    return false;
}

//dati gli orari restituisce la lista di tutte le fascie orarie diponibili
export function getTimeList(time){
    let today = new Date();
    let sDay =getNumDay(today.getDay());
    let list = [];
    let orari = [];
    time.map(item =>{
        if(item.day === sDay){
            orari = splitTime(item.time)
            list = list.concat(getSlots(orari[0], orari[1]));
            list = list.concat(getSlots(orari[2], orari[3]));
        }
    })
    return list;
}

//controlla se nel giorno di oggi sto ordinando nelle fascie orarie in cui il negozio è aperto (true) o chiuso (false)
export function checkInFasciaOraria(time){
    let today = new Date();
    let sDay =getNumDay(today.getDay());
    let list = [];
    let orari = [];
    let apertura1 = new Date ()
    let apertura2 = new Date ()
    let chiusura1 = new Date()
    let chiusura2 = new Date ()
    let dentro = false;
    time.map(item =>{
        if(item.day === sDay){
            orari = splitTime(item.time)
            if(orari[0] != "" && orari[3] != ""){
                console.log("entrambi orari")
                apertura1.setHours(orari[0])
                apertura1.setMinutes(0)
                chiusura1.setHours(orari[1])
                chiusura1.setMinutes(0)
                apertura2.setHours(orari[2])
                apertura2.setMinutes(0)
                chiusura2.setHours(orari[3])
                chiusura2.setMinutes(0)
                dentro = ((apertura1 < today && today < chiusura1) || (apertura2 < today && today < chiusura2));
            }
            else {
                if(orari[0] === ""){
                    apertura2.setHours(orari[2])
                    apertura2.setMinutes(0)
                    chiusura2.setHours(orari[3])
                    chiusura2.setMinutes(0)
                    dentro = (apertura2 < today && today < chiusura2);
                }
                else {
                    apertura1.setHours(orari[0])
                    apertura1.setMinutes(0)
                    chiusura1.setHours(orari[1])
                    chiusura1.setMinutes(0)
                    dentro = (apertura1 < today &&  today < chiusura1);
                }
            }
        }
    })
    return dentro;
}

export function StringToDate(time){
    let timeOk = new Date();
    let split = time.split(":");
    timeOk.setHours(split[0]);
    timeOk.setMinutes(split[1]);
    return timeOk
}