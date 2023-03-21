`Spring Boot` + `Angular` + `PostgreSQL`

- [English version](#english-version)
  - [OpenFoodStash - description](#openfoodstash---open-internet-application-for-the-management-of-food-supplies-for-household)
  * [Capabilities](#capabilities)
  * [Development possibilities](#development-possibilities)
  * [Requirements and commissioning](#requirements-and-commissioning)
  * [Notes](#notes)
- [Polish version](#polska-wersja)
  - [OpenFoodStash - opis](#openfoodstash---otwarta-aplikacja-internetowa-do-zarządzania-zapasami-żywności-dla-gospodarstwa-domowego)
  * [Oferowane możliwości](#oferowane-możliwości)
  * [Możliwości rozwoju](#możliwości-rozwoju)
  * [Wymagania i uruchomienie](#wymagania-i-uruchomienie)
  * [Aktualności](#aktualności)
- [Screenshots](#screenshots)

****

#### English version

# OpenFoodStash - open internet application for the management of food supplies for household

The application was made to solve the problem of efficient management of the food we have and to eliminate food waste. The prototype was developed as an engineering project: FoodStash.

## Capabilities

- Creation of a personal account
- Creation of Stash and Storage: virtual spaces for food storage and management
- Efficient browsing of food in your possession
- End-of-term food warnings
- Simple food expiration date prediction
- Ability to share space between users
- History of food consumed/added/thrown away
- Generation of statistics and analysis of user behavior

## Development possibilities

- Use of barcode scanner
- Advanced food filtering
- Additional parameters in statistics
- Implementation of elements for user diet analysis

## Requirements and commissioning

### Required components
- Node environment including npm
- Adoptium Java 17 with Maven OR Docker
- PostgreSQL database

### Configuration files

The configuration in the following layers must be adjusted in order to work properly

#### Backend

- <strong>/backend/src/main/resources/application.properties</strong>
  - database information
  - set frontend URL
  - mailing service SMTP settings
 
- <strong>/backend/src/main/java/com/bkopysc/foodstash/security/SecurityConfig.java</strong>
  - CORS settings
  - request and authorization settings
 
- <strong>/backend/src/main/java/com/bkopysc/foodstash/security/WebConfig.java</strong>
  - allowed requests settings
  - allowed Origins
  
- <strong>/backend/src/main/java/com/bkopysc/foodstash/security/SecurityUtils.java</strong>
  - Token JWT settings

#### Frontend

- <strong>/frontend/foodstash-app/src/app/core
/config.ts</strong>
  - set API backend URL

### Backend Startup

#### Java Maven
Two options:
1) Making a build manually: 
```
mvnclean install
java -jar <jar file name>
```
2) Manually run
```
mvnspring-boot:run
mvnwspring-boot:run
```


#### Docker
Two options:
1) Using Dockerfile
```
docker build -t foodstash_image:1 -f Dockerfile .
docker run -it --rm --name foodstashApp -p 8080:8080 foodstash_image:1 java -jar /opt/foodstashApi/foodstashApi.jar
```

2) Using .sh scripts (Linux)
Build: 
```
sh ./backend/Docker-build.sh
```
Run: 
```
sh ./backend/Docker-run.sh
```

#### API URL
The backend should be available by default at: 
```
http://localhost:8080/api/
```

### Launching the Frontend
```
ng serve ./frontend/foodstash-app/
```

#### URL
The frontend should be available by default at: 
```
http://localhost:4200/
```

## Notes
`10.03.2023`
> <strong>Closed testing of public version of FoodStash</strong>
> Using:
> - Supabase: database - PostgreSQL
> - Heroku: backend hosting - Spring
> - Firebase: frontend hosting - Angular


***
#### Polska wersja
# OpenFoodStash - otwarta aplikacja internetowa do zarządzania zapasami żywności dla gospodarstwa domowego

Aplikacja stara się rozwiązać problem efektywnego zarządzania posiadaną żywnością oraz zniwelować zjawisko marnowania żywności. Pierwowzór powstał jako projekt inżynierski: FoodStash.

## Oferowane Możliwości

- Tworzenie osobistego konta
- Tworzenie Schowków i Składzików: wirtualnych przestrzeni do przechowywania i zarządzania żywnością
- Efektywne przeglądanie posiadanej żywności
- Ostrzeżenia dotyczące kończącego się terminu żywności
- Prosta predykcja terminu żywności
- Możliwość współdzielenia przestrzeni pomiędzy użytkownikami
- Historia spożytej/dodanej/wyrzuconej żywności
- Generowanie statystyk i analiza zachowań użytkownika

## Możliwości rozwoju

- Wykorzystanie skanera kodów kreskowych
- Zaawansowane filtrowanie żywności
- Dodatkowe parametry w statystykach
- Wdrożenie elementów do analizy diety użytkownika

## Wymagania i uruchomienie

### Wymagane elementy
- Środowisko node wraz z npm
- Adoptium Java 17 z Mavenem LUB Docker
- Baza danych PostgreSQL

### Konfiguracyjne pliki

W celu poprawnego działania należy dostosować konfigurację w poniższych warstwach.

#### Backend

- <strong>/backend/src/main/resources/application.properties</strong>
  - informacje o bazie danych
  - frontend url
  - ustawieniach serwisu mailingowego SMTP
 
- <strong>/backend/src/main/java/com/bkopysc/foodstash/security/SecurityConfig.java</strong>
  - ustawienia CORS
  - ustawienia autoryzacji request
 
- <strong>/backend/src/main/java/com/bkopysc/foodstash/security/WebConfig.java</strong>
  - dozwolone metody zapytań
  - dozwolone Origins
  
- <strong>/backend/src/main/java/com/bkopysc/foodstash/security/SecurityUtils.java</strong>
  - ustawienia tokenu JWT

#### Frontend

- <strong>/frontend/foodstash-app/src/app/core
/config.ts</strong>
  - ustawienie adresu API backend

### Uruchomienie Backend

#### Java Maven
2 możliwości:

1) Ręczne dokonanie buildu: 
```
mvnclean install
java -jar <jar file name>
```
2) Ręczne uruchomienie
```
mvnspring-boot:run
mvnwspring-boot:run
```


#### Docker
2 możliwości:

1) Wykorzystanie Dockerfile
```
docker build -t foodstash_image:1 -f Dockerfile .
docker run -it --rm --name foodstashApp -p 8080:8080 foodstash_image:1 java -jar /opt/foodstashApi/foodstashApi.jar
```

2) Użycie skryptów .sh (Linux)
Build: 
```
sh ./backend/Docker-build.sh
```
Run: 
```
sh ./backend/Docker-run.sh
```

#### API URL
Backend powinien być dostępny domyślnie pod adresem: 
```
http://localhost:8080/api/
```

### Uruchomienie Frontend
```
ng serve ./frontend/foodstash-app/
```

#### URL
Frontend powinien być dostępny domyślnie pod adresem: 
```
http://localhost:4200/
```

## Aktualności
`10.03.2023`
> <strong>Zamknięte testy publicznej wersji FoodStash</strong>
> Wdrożenie na:
> - Supabase: baza danych - PostgreSQL
> - Heroku: hosting backend - Spring
> - Firebase: hosting frontend - Angular

***
# Screenshots

- Home Screen / Ekran Startowy

![ekan_znaczniki](https://user-images.githubusercontent.com/57834846/226747815-b07b15d9-67cc-43b9-9335-0c6e7d19af8d.png)

- Login Panel / Panel Logowania

![logowanie_error](https://user-images.githubusercontent.com/57834846/226749604-0b1b545f-759f-47eb-856f-c1e618bd9ccc.png)

- Signup Panel / Panel Rejestracji

![rejestracja](https://user-images.githubusercontent.com/57834846/226748278-2f78080f-9777-4f93-8898-1488296a16ec.png)

- Password Reset / Resetowanie Hasła

![reset_password_request](https://user-images.githubusercontent.com/57834846/226748505-a6d78200-abaf-4e19-a6c1-ce857b294baf.png)
![reset_link_send](https://user-images.githubusercontent.com/57834846/226748537-e0034fb0-68e9-4701-ad60-bfd401cbf073.png)

 - Dashboard 
 
![dashboard](https://user-images.githubusercontent.com/57834846/226748611-844280f2-eb6e-4eb2-abd2-a02115147db0.png)

- Stashes / Schowki 

![schowek_skrykti_dod](https://user-images.githubusercontent.com/57834846/226748954-ad34d354-e96f-44f0-bec7-b212d7ae5709.png)

- Selected Storage / Wybrany Składzik 

![skladzik_aktualne](https://user-images.githubusercontent.com/57834846/226749118-73d7479e-e0a6-4af0-bfb9-eabf0b5673fb.png)

- Statistics / Statystyki

![Statystyki_1](https://user-images.githubusercontent.com/57834846/226749448-118c3e13-94fd-4310-ae7b-6fa4cc3e7a94.png)

![statystyki_2](https://user-images.githubusercontent.com/57834846/226749453-25386324-9ff1-4477-a7ac-04a79fb9bd6f.png)

- Mobile View / Widok Mobilny

![mobile](https://user-images.githubusercontent.com/57834846/226749550-6256614c-18a1-401d-b8fd-2361ed05b3b6.png)








