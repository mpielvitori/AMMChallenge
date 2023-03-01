# Automated market maker challenge

### Start local environment
```
docker-compose up --build --remove-orphans
```

### Configured pair contracts
- ETH-RKFL: __0xbc9d21652cca70f54351e3fb982c6b5dbe992a22__
- USDC-ETH: __0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc__
- FLUT-DAI: __0xe532b04d2f2e921dfec69e132e9214d2f82df304__
- stETH-ETH: __0x4028daac072e492d34a3afdbef0ba7e35d8b55c4__
### Util commands
- Create database: `aws dynamodb create-table --cli-input-json file://AMMChallenge.json --endpoint-url http://localhost:8000`
- Delete database: `aws dynamodb delete-table --table-name AMMChallenge --endpoint-url http://localhost:8000`
- Install local DynamoDB Gui: `npm install -g dynamodb-admin`
- Start local DynamoDB GUI: `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`

### Resources
- [API docs](http://localhost/api/pairs/docs)
- [get Pairs data endpoint](http://localhost/api/pairs)
- [DynamoDB GUI](http://localhost:8001)
- [App](http://localhost/)
