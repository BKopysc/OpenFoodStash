`Spring Boot` + `Angular` + `PostgreSQL`

Content/Zawartość:
- [English version](#english-version)
  - [OpenFoodStash](#openfoodstash---open-internet-application-for-the-management-of-food-supplies-for-household)
    * [Capabilities](#capabilities)
    * [Development possibilities](#development-possibilities)
    * [Requirements and commissioning](#requirements-and-commissioning)
      + [Required components](#required-components)
      + [Configuration files](#configuration-files)
        - [Backend](#backend)
        - [Frontend](#frontend)
      + [Backend Startup](#backend-startup)
        - [Java Maven](#java-maven)
        - [Docker](#docker)
        - [API URL](#api-url)
      + [Launching the Frontend](#launching-the-frontend)
        - [URL](#url)
    * [Notes](#notes)
- [Polish version](#polska-wersja)
  - [OpenFoodStash](#openfoodstash---otwarta-aplikacja-internetowa-do-zarządzania-zapasami-żywności-dla-gospodarstwa-domowego)
  * [Możliwości](#możliwości)
  * [Możliwości rozwoju](#możliwości-rozwoju)
  * [Wymagania i uruchomienie](#wymagania-i-uruchomienie)
    + [Wymagane elementy](#wymagane-elementy)
    + [Konfiguracyjne pliki](#konfiguracyjne-pliki)
      - [Backend](#backend-1)
      - [Frontend](#frontend-1)
    + [Uruchomienie Backend](#uruchomienie-backend)
      - [Java Maven (2 możliwości)](#java-maven-1)
      - [Docker (2 możliwości)](#docker-1)
      - [API URL](#api-url-1)
    + [Uruchomienie Frontend](#uruchomienie-frontend)
      - [URL](#url-1)
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

## Możliwości

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
