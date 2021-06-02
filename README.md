# Projet_Stonks
Projet Stonks pour le cours de PRO pour la HEIG-VD.

Auteurs: 
- Besseau Léonard
- Cerottini Alexandra
- Do Vale Lopes Miguel
- Gamboni Fiona
- Tevaearai Rebecca

## Requirement
- Node v14.x
- Monogdb v4.4


## Installation
1. Create a user in the database
```
use admin
db.createUser({
user: "NAME",
 pwd: "PASSWORD",
roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
})
```
or use `mongo.js` in `Server` and tweak the parameter inside it to create a user in the db.
Add your credentials in the `Server/config.env` file
**IMPORTANT** Modify the secret inside if use in production

2. Launch the different service you need with node (`yarn start-server` etc)

## Documentation
See https://pro-stonks.github.io/Projet_Stonks/ for API endpoints description
See wiki (Not yet here) for details about the project
 
