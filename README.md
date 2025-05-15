# the simple architecture

based on: https://dev.to/hugaomarques/a-arquitetura-simples-lb

## principles

YAGNI - you aren't gonna neet it

KISS - keep it super simple xD

`There's no silver bullet`

## layers

![diagram image](./misc/diagram.png)

### controllers

- input validation
- i/o logging
- transform api input in use case input
- call use case

### use cases

- implement business rules with entities
- one by api route or correlated
- handle persistence and external depencies
- must only depend on interfaces

### entities

- typically sets of values
- can store behaviors that are common for the rest of the application

### external dependencies

- facade or anti corruption layer
- acts as an intermediary to isolate the domain from external systems
- ensuring that any changes to the external require modifications only in this class
- must have a interface and a implementation
- sometimes will have more than one impletation

### persistence / repositories

- classes where will concentrate your database operations
- ideally one per entity
- must have a interface and a implementation
- can be ORM

### config

- dependency injection framework
- will conect everything
- expose a type with all the classes
- satisfies the interfaces on use cases with the implementations

# POC

create users
  - save user in database

create payment
  - save payment in database
  - approve or reprove
  - put on confirmation or cancellation queue

create a cancellation
  - put on cancellation queue

confirmation -> poller queue
  - async
  - create transactions
  - edit payment
  - calculate balance
  - update cache with the balance

get user by id
  - fetch cached user balance -> last updated must be present

cache and pub sub by Redis

create a external call with xml
