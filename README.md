# Automated market maker challenge

### Start local environment
```
docker-compose up --build --remove-orphans
```

### Util commands
- Create database: `aws dynamodb create-table --cli-input-json file://AMMChallenge.json --endpoint-url http://localhost:8000`
- Delete database: `aws dynamodb delete-table --table-name AMMChallenge --endpoint-url http://localhost:8000`
- Install local DynamoDB Gui: `npm install -g dynamodb-admin`
- Start local DynamoDB GUI: `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`

### Resources
- [API docs](http://localhost:8080/api/pairs/docs)
- [get Pairs data endpoint](http://localhost:8080/api/pairs)
- [DynamoDB GUI](http://localhost:8001)
- [App](http://localhost:3000/)
