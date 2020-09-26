### **BP - Prijatie objednávky na pobyt alebo zájazd**


#### **Cieľ**

Cieľom biznis procesu `Prijatie objednávky na pobyt alebo zájazd` je umožniť zákazníkovi úspešne dokončiť objednávku na pobyt alebo zájazd, s korektným prihlásením, prípadne ak sa rozhodne zaregistrovať sa rezerváciu nedokonćiť.


#### **Používateľské roly**

V tomto biznis procese ś jednotlive kroky vykonávané 5 rolami



*   **zákazník **- zamestnanec vykonáva pridanie alebo úpravu ponuky pobytov/zájazdov cestovnej kancelárie prostredníctvom formulára
*   **systém **- načítava udaje o ponuke zo zoznamu a zároveň pridáva nový údaj do zoznamu ktorý zamestnanec pridal
*   ** WS Booking **- webová služba, ktorá slúži na správu (pridávanie, upravovanie, odstraňovanie a čítanie) ponúk, rezervácií a vecí s nimi spojenými, je súčasťou systému
*   **WS CardPayment** - webová služba, ktorá slúži na úhradu pomocou falošnej karty, táto služba je pripravená byť kedykoľvek nahradená skutočnou platobnou bránou \

*   **WS Customer** - webová služba, ktorá slúži na správu zákazníckych účtov,  na registráciu, prihlásenie a kontrolu oprávnení
*   **WS EmailNotification** - webová služba, ktorá slúži na odosielanie emailových správ


#### **Biznis objekty**

Biznis proces používa nasledujúce biznis objekty:


    `pobyt/zájazd` - je vytvorený vopred, tieto objekty sú jednotlivými položkami ponuky


    `zákazník` - vytvorí sa pred prihlásením a následne je použitý na autentifikáciu a držanie autentifikačného tokenu


    `objednávka` - vytvorí sa po vybratí termínu pred prihlásením registráciou slúži na “zapamätanie si dopytu”


    `platba` - vytvorí sa po zhrnutí objednávku slúži na prechod cez platbu sú do nej postupne zapisované údaje a nakoniec je využitá na vykonanie transakcie


#### **Opis procesu**

Jednotlivé kroky biznis procesu `Prijatie objednávky na pobyt alebo zájazd `sú nasledujúce:



1. **zákazník **- vyberie ponuku zo zoznamu ponúk v užívateľskom rozhraní
2. **systém pomocou WS Booking** - načíta dostupné termíny danej ponuky 
3. **zákazník** - vyberie dostupný termín vybranej cenovej ponuky v užívateľskom rozhraní
4. **systém **- zobrazí kontextové okno na výber medzi prihlásením a registráciou
5. **zákazník** - vyberie v kontextovom okne “prihlásenie” medzi prihlásením alebo registráciou
    1. ak sa zákazník rozhodne prihlásiť prípad použitia pokračuje bodom **7**
6. **systém **- presmeruje zákazníka na registráciu a tento bod sa vykoná pomocou Biznis procesu `registrácia zákazníka`
    2. ak registrácia dopadne úspešne biznis proces pokračuje bodom **9**
    3. inak biznis proces končí
7. **zákazník** - vyplní prihlasovací formulár a potvrdí jeho odoslanie
8. **systém pomocou WS Customer **- spracuje prihlásenie
    4. ak je prihlásenie chybné biznis proces pokračuje bodom **7**
9. **systém pomocou WS Booking** - zhrnie rezerváciu a vyčísli ju
10. **zákazník **- potvrdí objednávku
11.  **systém **- nasledujúce body vykoná paralelne
    5. **WS CardPayment** pripraví platbu nasledovanú ďalšou paralelnou vetvou, ktorá zotrvá kvôli časovaču.
    6. **WS EmailNotification** odošle email s informáciami o objednávku
12. **zákazník** - vyplní platobný formulár a odošle ho
13. **systém pomocou WS CardPayment **- spracuje platbu a pripravú ju na transakciu
    7. ak bolo spracovanie s chybami biznis proces pokračuje bodom 
14. **Systém **vykoná nasledujúce kroky paralelne
    8. **Systém pomocou WS CardPayment **vykoná transakciu a následne hodí udalosť o úspešnej transakcí
    9. **Systém pomocou WS CardPayment **sleduje či sa vykoná skôr transakcia alebo skončí časovač.
        1. ak sa časovač skončí skôr zrušia sa všetky ostatné paralelné vetvy a pokračuje bodom **15**.
        2. inak sa zrušia všetky ostatné paralelné vetvy a pokračuje bodom **17**.
15. **Systém pomocou WS EmailNotification** odošle email o vypršaní platnosti neúspešnej transakcie.
16. **Zákazník **môže kedykoľvek pomocou emailu proces obnoviť do bodu 9.
17. **Biznis proces končí neúspešne.**
18. **Systém pomocou WS EmailNotification** odošle email s dokladom o zaplatení.
19. **Systém pomocou WS Booking** uloží transakciu a obsadí termíny.
20. **Biznis proces končí úspešne.**

**Kroky procesu**

Uvádzame podrobný opis krokov rozhodovacích blokov biznis procesu `prijatie objednávky na pobyt alebo zájazd` : 



*   **Záujem o ponuku**
    *   zákazník si chce rezervovať` pobyt/zájazd` cestovnej kancelárie
*   **Výber ponuky - ľudská úloha:**
    *   **rola:** zákazník
    *   **vstup:` `**premenná so zoznamom objektov typu `pobyt/zájazd` 
    *   **výstup:** `pobyt/zájazd`
    *   **popis:** zákazník si vyberie ponuku pobytu alebo zájazdu ponúkaného cestovnou kanceláriou





*   **Načítanie dostupných termínov - webová služba:**
    *   **rola: **WS Booking
    *   **vstup:** `pobyt/zájazd`
    *   **výstup:** zoznam `termínov` daného  `pobytu/zájazdu `ponúkaných cestovnou kanceláriou
    *   **popis:** webová služba na základe požiadavky od zákazníka vráti zoznam ponúkaných termínov pobytu alebo zájazdu ponúkaných cestovnou kanceláriou na výber
*   **Výber termínu - ľudská úloha:**
    *   **rola:** zákazník
    *   **vstup:` `**zoznam `termínov` daného  `pobytu/zájazdu `ponúkaných cestovnou kanceláriou
    *   **výstup: **globálna premenná obsahujúca objekt typu `objednávka `s atribútom obsahujúci vyplnený atribút `od` a `do`.
    *   **popis:** zákazník si vyberie termín ponuky pobytu alebo zájazdu ponúkaného cestovnou kanceláriou


*   **Výber medzi prihlásením alebo registráciou - ľudská úloha:**
    *   **rola:** zákazník
    *   **vstup:` NULL`**
    *   **výstup:** `akcia` s enumerovanými hodnotami, “prihlásenie”, “registrácia”.
    *   **popis:** zákazník si vyberie či sa chce registrovať alebo prihlásiť.

*   **Prihlásenie alebo registrácia - rozhodovací blok:**
    *   **atribút rozhodovania: `akcia`** s enumerovanými hodnotami, “prihlásenie”, “registrácia”
    *   **popis: **na základe hodnoty sa rozhodne či zákazník bude presmerovaný na registráciu alebo prihlásenie. Ak je enumerovaná hodnota zhodná s “prihlásenie”, biznis proces pokračuje vetvou prihlásenie, ktorá ho následne dostane do prihlásenia. Ak je enumerovaná zhodná s “registrácia”, biznis proces pokračuje vetvou registrácia, ktorá následne zákazníka presmeruje do biznis procesu, ktorý zabezpečí registráciu
*   **Registrácia - volaný podproces _(vetva registrácia)_:**
    *   **rola:** systém
    *   **vstup:` NULL`**
    *   **výstup:** Buď prázdny objekt typu `zákazník` alebo ak registrácia prebehla úspešne, tak vyplnený objekt typu `zákazník`
    *   **popis:** zákazník vstúpi do iného biznis procesu registrácia, s účelom spracovania jeho údajov, tento proces však nemusí dopadnúť úspešne. Zákazník je automaticky prihlásený po úspešnej registrácií
*   **Prebehla registrácia úspešne? - rozhodovací blok _(vetva registrácia)_:**
    *   **atribút rozhodovania: **Objektu typu `zákazník.`
    *   **popis: **Na základe toho či sa jedná o prázdny objekt sa rozhodne, či registrácia prebehla úspešne. Ak je objekt `zákazník` rovný `NULL`, biznis proces pokračuje vetvou nie, kde sa proces ukončí. Inak biznis proces pokračuje vetvou áno, ktorá zabezpečí pokračovanie objednávky
*   **Nedokončená rezervácia - ukončovacia aktivita _(vetva registrácia; vetva nie)_:**
    *   zákazník nedokončil registráciu, vzdaním sa opakovaného zadania neplatných údajov alebo nezadaním potrebných údajov
*   **Prihlásenie - vnorený podproces _(vetva prihlásenie)_:**
    *   **role:** zákazník, systém, WS Calendar, WS EmailNotification
    *   **vstup:` NULL`**
    *   **výstup:** Vyplnený objekt typu `zákazník` s vyplneným autorizačným tokenom
    *   **popis:** zákazník vstúpi do podprocesu prihlásenie, tento proces slúži na overenie existencie účtu a identifikáciu zákazníka správnym heslom



*   **Vyplnenie prihlasovacieho formuláru - ľudská úloha _(vetva prihlásenie, podproces prihlásenie)_:**
    *   **rola:** zákazník
    *   **vstup:` `**NULL
    *   **výstup:** Vyplnený objekt typu `zákazník `bez autorizačného tokenu, s vyplnenými atribútmi názov účtu a heslo
    *   **popis:** zákazník vyplní formulár prihlásenie, čím vyplní objekt v pozadí, ktorý je následne pripravený na spracovanie
*   **Spracovanie prihlásenia - webová služba _(vetva prihlásenie, podproces prihlásenie)_:**
    *   **rola:** WS Customer
    *   **vstup:` `**Vyplnený objekt typu `zákazník `bez vyplneného atribútu  `authToken`, s vyplnenými atribútmi názov účtu a heslo
    *   **výstup:** Vyplnený objekt typu `zákazník`, objekt má vyplnený atribút `authToken`, ak prihlásenie prebehlo úspešne, inak nie je zmenený, objekt je vrátený vždy bez vyplneného atribútu heslo
    *   **popis:** Webové služba overí kombináciu zadanú v objekte `zákazník `a ak je kombinácia názvu účtu a hesla správna, je odoslaný objekt naspäť aj s vygenerovaným autentifikačným tokenom, pár autentifikačného tokenu je zaradený do databázy, čo značí platné prihlásenie, heslo už ďalej nie je prenášané po sieti
*   **Bolo prihlásenie chybné? - rozhodovací blok _(vetva prihlásenie, podproces prihlásenie)_:**
    *   **atribút rozhodovania: **Atribút autentifikačný token objektu typu `zákazník`
    *   Na základe toho či je atribút autentifikačný token vyplnený, sa rozhodne či prihlásenie prebehlo úspešne. Ak je atribút `authToken` objektu typu `zákazník` rovný `NULL`, biznis proces pokračuje vetvou áno, kde sa podroces sa vráti na prvý krok. Inak biznis proces pokračuje vetvou nie, ktorá ktorá ukončí 
*   **Úspešne prihlásený používateľ - ukončovacia aktivita podprocesu _(vetva prihlásenie, podproces prihlásenie, vetva nie)_:**
    *   zákazník správne vyplnil formulár prihlásenia, bol mu vytvorený autentifikačný token, takže môže využívať služby a funkcie, na ktoré má oprávnenie
*   **Rozhodovací blok - uzatvárací:**
    *   spojenie vetiev
*   **Zhrnutie rezervácie - webová služba:**
    *   **rola:** WS Booking
    *   **vstup:** globálna premenná s čiastočne vyplneným objekt typu `objednávka`
    *   **výstup:** globálna premenná s vyplneným objektom typu `objednávka`, s vyplneným atribútom id
    *   **popis:** Webová služba zhrnie objednávku, priradí jej identifikačné číslo, čím je identifikovateľná v systéme
    

*   **Potvrdenie objednávky - ľudská úloha:**
    *   **rola:** zákazník
    *   **vstup:** globálna premenná s vyplneným objektom typu `objednávka`, s vyplneným atribútom id
    *   **výstup:** globálna premenná s objektom typu `platba` s vyplneným atribútom `objednávka`
    *   **popis:**  Zákazník potvrdí objednávku, čím sa vytvorí objekt platby.
*   **Paralelná brána** **- otváracia:**
    *   Vykonávanie procesu následne pokračuje dvomi vetvami, ktoré sa vykonávajú paralelne
*   **Príprava platby - webová služba _(paralelná vetva 1)_:**
    *   **rola: **WS CardPayment
    *   **vstup:** globálna premenná s objektom typu `platba` s vyplneným atribútom `objednávka`
    *   **výstup:** globálna premenná s čiastočne vyplneným objektom typu `platba` s vyplneným atribútom id a vyplnením atribútu timerId
    *   **popis:** Webová služba priradí platbe identifikačné číslo a spustí časovač, časovač je spustený až do doby úspešného overenia platby.


*   **Paralelná brána - otváracia _(paralelná vetva 1)_:**
    *   Vykonávanie procesu následne pokračuje rozdelením vetvy 1 na dve vetvy, ktoré sa vykonávajú paralelne
*   **10 min. - odpočítavanie zachytenia času _(paralelná vetva 1a)_**
    *   Vetva 1a bude pokračovať po desiatich minútach
*   **Vypršanie časovaču - stredná vrhacia udalosť _(paralelná vetva 1a)_**
*   **Notifikácia o objednávke - webová služba _(paralelná vetva 2)_:**
    *   **rola:** WS EmailNotification
    *   **vstup: **globálna premenná s vyplneným objektom typu `objednávka`
    *   **výstup**: `NULL`
    *   **popis:** Webová služba odošle zákazníkovi email s informáciami o objednávke a možnosťami prípadného obnovenia, pokiaľ platbu zákazník nevykoná včas.
*   **Paralelná brána** **- uzatváracia:**
    *   V tomto kroku sa vetvy 1a a 2 spoja
*   **Vyplnenie platobného formulára - ľudská úloha:**
    *   **rola:** zákazník
    *   **vstup:** globálna premenná s čiastočne vyplneným objektom typu `platba` s vyplneným atribútom id a vyplnením atribútu timerId
    *   **výstup: ** globálna premenná s vyplneným objektom typu `platba` s vyplnenými údajmi platobnej karty
    *   **popis:** Zákazník vyplní platobný formulár čím dokončí platbu, následne je platba pripravená na spracovanie
*   **Spracovanie platby - webová služba:**
    *   **rola:** WS CardPayment
    *   **vstup: **globálna premenná s vyplneným objektom typu `platba` s vyplnenými údajmi platobnej karty
    *   **výstup:** `boolean` o chybovosti platby
    *   **popis: **Ak sú údaje správne, platba je v tomto kroku spracovaná, jej údaje overené a pripravená na vykonanie transakcie, inak je na transakciu nutné údaje zadať znovu.
*   **Bola platba chybná? - rozhodovací blok:**
    *   **rozhodovací atribút: `boolean`** o chybovosti platby
    *   **popis**: na základe hodnoty o chybovosti platby sa rozhodne či zákazník bude musieť údaje zadať znovu alebo môže pokračovať ďalej.
*   **Paralelná brána - otváracia _(vetva nie)_:**
    *   Vykonávanie procesu následne pokračuje 2 vetvami, ktoré sa budú vykonávať paralelne
*   **Vykonanie transakcie - webová služba _(vetva nie; paralelná vetva 2)_:**
    *   **rola: **WS CardPayment
    *   **vstup: **globálna premenná s vyplneným objektom typu `platba` s vyplnenými údajmi platobnej karty
    *   **výstup: `null`**
    *   **popis:** Samotné vykonanie transakcie, prevedenie peňazí medzi účtami zákazníka a cestovnej kancelárie
*   **Úspešná transakcia - stredná vrhacia udalosť _(vetva nie; paralelná vetva 2)_**
*   **Exkluzívna udalostná brána _(vetva nie; paralelná vetva 1)_:**
    *   Biznis proces pokračuje udalosťou, ktorá nastane skôr.
*   **Časovač vypršal_ (vetva nie;; paralelná vetva 1)_:**
    *   Ak bola vrhnutá udalosť vypršanie časovaču, biznis proces pokračuje touto vetvou
*   **Notifikácia o vypršanej objednávke - ukončovacia udalosť so správou _(vetva nie; ; paralelná vetva 1; vetva časovač vypršal)_**
*   **Transakcia bola úspešná_ (vetva nie; paralelná vetva 1)_:**
    *   Ak bola vrhnutá udalosť vypršanie časovaču, biznis proces pokračuje touto vetvou
*   **Notifikácia o objednávke - webová služba _(vetva nie; paralelná vetva 1; vetva úspešná transakcia)_:**
    *   **rola:** WS EmailNotification
    *   **vstup: **globálna premenná s objektom typu `platba`
    *   **výstup**: `NULL`
    *   **popis:** Webová služba odošle zákazníkovi email s potvrdením o platbe
*   **Uloženie rezervácie - webová služba _(vetva nie; paralelná vetva 1; vetva úspešná transakcia)_:**
    *   **rola:** WS Booking
    *   **vstup: **globálna premenná s objektom typu `platba` globálna premenná s objektom typu `objednávka`
    *   **výstup**: `NULL`
    *   **popis:** Webová služba uloží rezerváciu a označí daný termín, danej ponuky ako obsadený
*   **Úspešne ukončená rezervácia – ukončovacia aktivita _(vetva nie; paralelná vetva 1; vetva úspešná transakcia)_**



V projekte sme využili dátové modely pre zoznam zákazníkov, objednávok, platieb, destinácií, ponúk, krajín.



## Použité technológie

Systém _Cestovná Kancelária_ pozostáva z dvoch častí, klientskej aplikácie a serverovej časti. 

Klientska časť aplikácie je napísaná v html/css/typescript vo frameworku **Angular 9**. Klientská časť zobrazuje používateľské zobrazenie s aktuálnym stavom aplikácie, overuje vstupy zadané používateľom, zobrazuje teda formuláre a dostupné možnosti. Klientská časť komunikuje so systémovou serverovou časťou pomocou implementovaných** RESTful** mikroslužieb. \
 \
Serverová časť aplikácie je napísaná v programovacom jazyku **Node.js **vo frameworku** express **a s rozšírením pre webové služby **vpulin/node-soap**, má na starosti vykonávanie logiky biznis procesov spolu s komunikáciou s používanými webovými službami. Server s ostatnymi servermi navzájom komunikujú pomocou **webových služieb SOAP **implementovaných pomocou knižnice **vpulin/node-soap** a správcom modelov webových služieb na stránke predmetu PIS a štandardnými webovými službami predmetu PIS.  \
 \
Databázová časť aplikácie funguje na databázovom serveri **MongoDB**, ktorý ponúka veľmi jednoduché rozhranie (_“driver”_) do jazyka **Node.js**.

Implementovali sme vlastnú webovú službu definovanú WSDL súborom a spustenú pomocou knižnice **vpulin/node-soap**.


### Spustenie systému

Pre spustenie systému je potrebné mať nainštalovaný **npm** _(Node package manager)_ a **Node.js**, aj na strane front-endu aj na strane backendu sú závolistosti (dependencies) sú pomocou **npm** nainštalované a uschované v priečinku `node_modules/`, podľa súboru `package.json` a `package-lock.json`.  \


Stiahnutie a inštalácia **Node.js** a **npm**: \
[https://docs.npmjs.com/downloading-and-installing-node-js-and-npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) \


Rovnako pre úplné rozbehnutie serverovej časti aj s webovými službami pre rezervácie je nutné mať nainštalovaný databázový server **MongoDB \
**

Stiahnutie a inštalácia **MongoDB**:

[https://docs.mongodb.com/manual/administration/install-community/](https://docs.mongodb.com/manual/administration/install-community/)


#### Spustenie front-end časti systému:



1. Inštalácia Node.js a NPM.
2. Rozbalenie projektu:
    1. Rozbalenie hlavného priečinku
    2. Rozbalenie časti klient. (pozn. súbor `part-client.zip`).
    3. Rozbalenie časti server. (pozn súbor `part-server.zip`).
    4. Rozbalenie časti databáza. (pozn súbor `part-database.zip`).
3. Spustenie klientskej časti:
    5. Je nutná inštalácia CLI pre framework **Angular 9**, urobíme tak pomocou príkazu: 

        <code>npm install -g @angular/cli@9.1.6 \
<strong><em>Pozor inštaluje globálnu inštanciu Angular CLI!</em></strong></code>

    6. V termináli prejdeme do rozbaleného adresára zo súboru `part-client.zip`.
    7. Zadáme príkazy na inštalovanie závislostí projektu: \
<code>npm install --save \
npm install --save-dev \
<em>Mal by objaviť adresár </em>node_modules/</code>
    8. V tejto chvíli môžeme spustiť lokálny server s bežiacou front-end časťou pomocou príkazu. \
<code>ng serve --proxy-config src/app/proxy-conf.json</code>

        <em>Ak nie je špecifikované inak server s klientskou časťou by mal bežať na uri:  \
<code>http://localhost:4200</code></em>

4. Spustenie serverovej časti:
    9. V termináli prejdeme do rozbaleného adresára zo súboru `part-server.zip`.
    10. Zadáme príkazy na inštalovanie závislostí projektu: \
`npm install --save \
npm install --save-dev`
    11. Spustíme serverovú časť pomocou príkazu: \
<code>npm run \
<em>Ak nie je špecifikované inak server so serverovou časťou by mal bežať na uri: </em> \
[http://localhost:3001](http://localhost:3001)</code> \
<strong><em>Pozor na správny beh systému je dôležité, aby bol port tohto servera nastavený na 3001!</em></strong>
5. Spustenie databázového servera:
    12. Po inštalácií a spustení pomocou databázového servera je nutné vytvoriť databázu v počítačovom termináli zadáme (Command Line/Prompt): \
<code>mongorestore -d "pis-reservation" -o "&lt;cesta k rozbalenému adresáru zo part-database.zip>"</code>
    13. Spustenie servera pomocou:

        ```
        mongod [<specificka konfiguracia>]
        ```



        **_Pozor na správny beh systému je dôležité, aby bol port databázového servera nastavený na 27017!_**


**Všetky porty a konfigurácie sú nastavené, prípadne sa používajú predvolené.**


## Implementácia biznis objektov

Počas implementácie sme využívali biznis objekty tak, ako sme si ich navrhli a opísali v predošlých častiach. Keďže sme ale zdrojový kód našej aplikácie písali v anglickom jazyku, názvy jednotlivý biznis objektov a ich atribútov sme museli preložiť do daného jazyka preložiť. 



*   **pobyt/zájazd **- `Offer`
    *   názov - `name`
    *   popis - `description`
    *   typ - `type`
    *   platí od - `date_from`
    *   platí do - `date_to`
    *   maximálny počet osôb  - `max_persons`
    *   cena v EUR - `price`
*   **zákazník **- `Customer`
    *   meno - `name`
    *   priezvisko - `surname`
    *   e-mail - `email`
    *   pohlavie - `gender`
    *   mena - `currency`
    *   narodený - `born_at`
*   **rezervácia - `Reservation`**
    *   id zákazníka - `customer_id`
    *   id ponuky - `offer_id`
    *   od - `date_from`
    *   do - `date_to`
    *   počet osôb - `persons`
    *   celková cena - `price`
    *   dátum evidencie - `created_at`
*   **platba - `Payment`**
    *   id ponuky - `offer_id`
    *   meno držiteľa karty - `card_holder`
    *   id používateľa - `customer_id`


## Implementácia systémových úloh

Stručný opis implementácie jednotlivých systémových úloh, ktoré sú implementované naprieč serverovou časťou v adresári _routes/ _a _models/_


### Načítanie ponúk

Načítanie ponúk pomocou webovej služba <code><em>Offer</em></code>. Webová služba ponúka funkciu na vrátenie všetkých ponúk <code><em>getAll()</em></code>. Táto systémová služba bola do serverovej časti implementovaná zo správcu modelov webových služieb zo stránky PIS. Do klienskej časti je implementovaná ako RESTful služba sprostredkovaná serverovou častou.

**Názov akcie:** api/reservations -> get

**Webová služba_ metódy[]_:** <code><em>Offers [getAll]</em></code>

**Vstup:** 



*   žiadny - `null`

**Výstup:** 



*   Zoznam **pobytov/zájazdov - **pole objektov typu `Offer`

    -> výstup z <code><em>getAll</em></code>



### Načítanie dostupných termínov

Načítanie ponúk pomocou webovej služby <code><em>Booking</em></code>. Webová služba ponúka funkciu na vrátenie všetkých obsadených termínov danej ponuky <code><em>checkedDates</em></code>. Táto systémová služba bola implementovaná v jednom aspekte serverovej časti pomocou vlastného WSDL aj s vlastným ovládačom, modelom a kolekciou v databáze. Do klientskej časti bola implementovaná ako RESTful služba sprostredkovaná iným aspektom serverovej časti.

**Názov akcie:** api/reservations/:offer_id -> get

**Webová služba_ metódy[]_:** <code><em>Booking [checkedDates]</em></code>

**Vstup:** 



*   Id ponuky - `offer_id `

**Výstup:** 



*   Zoznam **rezervácií** -** **pole objektov typu **<code>Reservation</code></strong> s obmedzenými atribútmi iba s <strong>dátumom od </strong> <code>date_from</code> a <strong>dátumom do </strong> <code>date_to</code>  \
-> výstup z <code><em>checkedDates</em></code>


### Spracovanie prihlásenia

Táto systémová úloha overí údaje používateľa a tímu, ktorý akciu volá. Realizované pomocou webovej služby <code><em>Customer</em></code> a jej metódy <code><em>checkPassword</em></code> a <code><em>getIdByEmail</em></code> do metódy checkPassword je vstupom tímové id a heslo a do getIdByEmail, je to email konkrétneho zákazníka (kvôli tvaru Webovej služby zo stránky PIS na testovacie účely. Táto webová služba bola do serverovej časti implementovaná zo správcu modelov webových služieb zo stránky PIS. Do klientskej časti je implementovaná ako RESTful služba sprostredkovaná serverovou častou.  \


**Názov akcie:** `api/users/login -> POST`

**Webová služba_ metódy[]_:** <code><em>Customer [checkPassword,getIdByEmail]</em></code>

**Vstup:** 



*   email - `email` -> vstup do <code><em>getIdByEmail</em></code>
*   heslo - <code>password</code> -> vstup do <code><em>checkPassword</em></code>
*   tímové id - <code>team</code> -> vstup do <code><em>checkPassword</em></code>

<strong>Výstup:</strong> 



*   status typu  **<code><em>boolean</em></code></strong> - <code>status \
</code> -> výstup zhoda z <code><em>[checkPassword, getIdByEmail]</em></code>
*   (v prípade <code><em>status == true</em></code>) objekt typu  <strong><code>Customer</code></strong> - <code>customer</code> \
-> výstup z <code><em>getIdByEmail</em></code>


### Zhrnutie rezervácie

Nie je používaná webová služba. Klientská časť v logike ovládača obrazovky pripraví objekt rezervácie, napojí jeho celkovú sumu za rezerváciu na ovládač, ktorý znásobí počet nocí, počet osôb so sumou v EUR.

**Názov akcie:** pushLoginForm()

**Vstup:** 



*   dátum od - `date_from`
*   dátum do - `date_to`
*   offer - `offer`
*   user - `user`

**Výstup:** 



*   Objekt typu **<code>Reservation</code></strong> s predvyplnenými údajmi.


### Uloženie rezervácie

Táto systémová úloha uloží rezerváciu pomocou WS  <code><em>Booking</em></code>. Vyvolá odoslanie informácií pomocou <code><em>Email</em></code>. WS <code><em>Email</em></code> a WS <code><em>Customer</em></code> sú implementované zo stránky PIS. WS <code><em>Booking</em></code> je implementovaná ako vlastná WS. Do klientskej časti je systémová služba implementovaná ako RESTful služba sprostredkovaná serverovou častou. 

**Názov akcie:** `api/reservation/ -> POST`

**Webová služba 1_ metódy[]_:** <code><em>Booking [checkin]</em></code>

**Webová služba 2_ metódy[]_:** <code><em>Customer [getCustomerById]</em></code>

**Webová služba 3_ metódy[]_:** <code><em>Email [notify]</em></code>

**Vstup:** 



*   Objekt typu  **<code>Reservation</code></strong> s vyplnenými potrebnými atribútmi 

<strong>Intermediate:</strong>



*   Atribút objektu **<code>Reservation</code></strong> <code>user_id</code> je použitý na nájdenie emailu používateľa, ktorý je vstupom do <code><em>notify</em></code>

<strong>Výstup:</strong> 



*   status typu  **<code><em>boolean</em></code></strong> - <code>status \
</code> -> výstup zhoda z <code><em>[checkin, getCustomerByid]</em></code>
*   (v prípade <code><em>status == true</em></code>) id rezervácie - <code>reservation_id</code>.


### Zhrnutie platby

Nie je používaná webová služba. Klientská časť v logike ovládača obrazovky pripraví objekt platby, napojí ho na ovládač obrazovky, ktorým sa vypĺňa údaj držiteľa karty.

**Názov akcie:** pushReservationForm()

**Vstup:** 



*   id rezervácie - `reservation_id`
*   id používateľa - `user_id`
*   meno držiteľa karty - `reservation_id`

**Výstup:** 



*   Objekt typu **<code>Payment</code></strong> s predvyplnenými údajmi.


### Uloženie platby

Táto systémová úloha uloží platbu pomocou WS  <code><em>Payment</em></code>. Vyvolá odoslanie informácií pomocou <code><em>Email</em></code>. WS <code><em>Email</em></code> je implementovaná zo stránky PIS. WS <code><em>Payment</em></code> je implementovaná zo správcu modelov WS zo stránky PIS. Do klientskej časti je systémová služba implementovaná ako RESTful služba sprostredkovaná serverovou častou. 

**Názov akcie:** `api/reservation/pay -> POST`

**Webová služba 1_ metódy[]_:** <code><em>Payment [insert]</em></code>

**Webová služba 2_ metódy[]_:** <code><em>Customer [getCustomerById]</em></code>

**Webová služba 3_ metódy[]_:** <code><em>Email [notify]</em></code>

**Vstup:** 



*   Objekt typu  **<code>Payment</code></strong> s vyplnenými potrebnými atribútmi 

<strong>Intermediate:</strong>



*   Atribút objektu **<code>Payment</code></strong> <code>user_id</code> je použitý na nájdenie emailu používateľa, ktorý je vstupom do <code><em>notify</em></code>

<strong>Výstup:</strong> 



*   status typu  **<code><em>boolean</em></code></strong> - <code>status \
</code> -> výstup zhoda z <code><em>[insert, getCustomerByid]</em></code>
*   (v prípade <code><em>status == true</em></code>) id platby - <code>payment_id</code>.
