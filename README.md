# Check Ahead

[*Promo video*](https://www.youtube.com/watch?v=LTRy6eUjFFU) <br/>

**Tim: Lucija Babić i Lucia Vareško <br />**

[Fakultet informatike u Puli](https://fipu.unipu.hr/) <br />
Kolegij: [Programsko Inženjerstvo](https://www.notion.so/Kontakt-stranica-875574d1b92248b1a8e90dae52cd29a9) <br />
Mentori: [doc.dr.sc. Nikola Tanković](https://www.notion.so/Kontakt-stranica-875574d1b92248b1a8e90dae52cd29a9) i Toni Starčić, univ.bacc. inf. <br />

## Opis 
Danas se sve češće susrećemo sa različitim alergijama, bolestima i sl. te je često vrlo zamorno čitati deklaracije proizvoda i utvrditi koji sastojci nisu prikladni za nas. Dok je u prehrambenoj industriji taj problem riješen time što su alergeni istaknuti na deklaraciji, u industriji kozmetičkih proizvoda popis sastojaka često je predugačak, sitan i/ili skraćen. Check Ahead aplikacija rješava taj problem na način da korisniku daje informaciju o kompatibilnosti proizvoda s njegovom listom neželjenih sastojaka. 

## Funkcionalnosti
* Prijava/registracija i odjava
* Dodavanje i uklanjanje neželjenih sastojaka
	* Mogućnost pregleda opisa svakog sastojka
* Pretraga proizvoda
	* Unos naziva proizvoda
	* Skeniranje barkoda
* Slanje zahtjeva za nedostupan prozivod 
	* Pregled stanja zahtjeva
* Dodavanje i uklanjanje proizvoda s liste "Favorites"
* Ažuriranje podataka korisničkog računa 
* Pregled nedavno pretraženih proizvoda

[Link na prototip aplikacije](https://www.figma.com/proto/f99rNxIjyfLDljY60b3OAS/Prototip?node-id=12%3A18&scaling=scale-down)<br />
[Link na aplikaciju](https://check-ahead.netlify.app/)

## Test user
Email: test@user.com <br />
Password: 123456

## Dodaci
npm install --save vue-quaggajs <br />
npm install --save vue-search-select <br />
npm install --save underscore <br />
### Firebase functions
npm install -g firebase-tools <br />
firebase login <br />
firebase init functions <br />
#### Deploy:
firebase deploy --only functions <br />

