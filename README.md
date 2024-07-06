# Mass Product Registration in Multivende and Other Features

## Description
This project implements a series of APIs for various functionalities within the context of an online marketplace management system called Multivende. One of the main features is the mass registration of products, using a RabbitMQ queue system to efficiently handle the high load of registrations, even surpassing 50,000 products.
## Context
Multivende is one of the largest marketplace and online store management systems in LATAM, offering an efficient and comprehensive platform for sellers. To achieve this, it is crucial to have functionalities that facilitate product management, customer interaction, and validation of information entered into the system..

## Technical Requirements
- Backend Development: Node.js, Express.js
- Database: Mysql
- Queue System: Rabbit MQ
- Containerization: Docker

## Distributed Architecture
The project is designed following a distributed architecture to ensure system scalability and efficiency. It consists of several interconnected components that communicate with each other to carry out the various functionalities offered by Multivende. The main components include:

- **API Server:** Implements the different APIs that provide access to the system's functionalities.
- **MySQL Database:** Stores product information, user data, and other relevant system data.
- **RabbitMQ Queue System:** Manages asynchronous communication between the various services in the system, allowing efficient mass product registration.
- **Queue Consumer:** Processes the messages sent through RabbitMQ, such as the mass registration of products, ensuring proper load handling and retries in case of failure.
- **Containerization with Docker:** Packages and deploys the different system components consistently and reproducibly, facilitating system administration and scalability in production environments

![alt text](/resources/images/Arquitectura.png)


## Installation
1. Clone this repository `git clone https://github.com/nelsonstos/reg-masivo-productoss-multivende.git`
2. Install the dependencies: `npm install`

## Configuration
1. Create a .env file in the root of the project and configure the necessary environment variables using the .env.example file as a reference.

## Use
1. Start the server: `npm run dev`

## API Example
### Products
- Create a .env file in the root of the project and configure the necessary environment variables using the .env.example file as a reference.
-Request parameters:
 ```json
  {
      "name": "Mass Product Registration Process",
      "authorizationCode": "ac-79aca336-8a38-4602-8f61-5b966d5b0114",
      "totalProducts": 70000,
      "batchSize": 1000
      
  }
 ```
- Successful response:
 ```json
 {
    "statusCode": 200,
    "data": {
        "product": {
            "name": "Mass Product Registration Process",
            "total": 70000,
            "authorizationCode": "ac-79aca336-8a38-4602-8f61-5b966d5b0114",
            "status": "SENT"
        }
    },
    "message": "Mass registration of products has been executed successfully!"
}
 ```
### Persons
- `GET /api/v1/persons?noaddress=true&order=asc`: Retrieves data of people without addresses and/or sorted in ascending order.
- Successful response:
 ```json
{
    "statusCode": 200,
    "data": {
        "persons": [{
            "_id": "6143acfaf12d437d811b3f18",
            "index": 0,
            "guid": "6b766493-72b7-4363-b21d-5edc27e758ca",
            "isActive": false,
            "balance": "$2,561.70",
            "picture": "http://placehold.it/32x32",
            "age": 29,
            "eyeColor": "green",
            "name": "Keisha Anderson"
            
        }
      ]
    },
    "message": "filtered persons withouth address successfully!"
}
 ```

- `GET /api/v1/persons?age=20-30&startsWith=H,L`: Retrieves data of people aged between 20 and 30 years with names starting with H and L.
- Successful response:
 ```json
{
    "statusCode": 200,
    "data": {
        "persons": [{
            "_id": "6143acfac41a2d999ba6b901",
            "index": 11,
            "guid": "cf816cce-2969-4e17-83fd-78c6de234fa9",
            "isActive": false,
            "balance": "$2,335.48",
            "picture": "http://placehold.it/32x32",
            "age": 21,
            "eyeColor": "brown",
            "name": "Heather Dickerson",
            
        }
      ]
    },
    "message": "filtered persons withouth address successfully!"
}
 ```
### Emails
- `GET /api/v1/emails?type=noValidos`: Filters supposed emails based on the type parameter value. The type value can be: validos, noValidos, and sinPersona.
- Successful response:
 ```json
{
    "statusCode": 200,
    "data": {
        "emails": [
            "a",
            "a.com",
            "a.",
            "test@ma"
        ]
    },
    "message": "Emails successfully filtered!"
}
 ```
## Others
Design of an entity-relationship database model for the purchasing process.
![alt text](/resources/images/image.png)

## Contribución
If you wish to contribute to this project, follow these steps:
1. Fork the repository
2. Create a new branch: `git checkout -b feature-nueva`
3. Make your changes and commit them: `git commit -am 'Agrega una nueva característica'`
4. Push to the branch: `git push origin feature-nueva`
5. Submit a pull request


