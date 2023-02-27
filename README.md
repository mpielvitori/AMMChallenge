# Automated market maker challenge

### Start local environment
```
docker-compose up --build --remove-orphans
```

### Util commands
- Create database: `aws dynamodb create-table --cli-input-json file://IntoTheBlock.json --endpoint-url http://localhost:8000`
- Delete database: `aws dynamodb delete-table --table-name IntoTheBlock --endpoint-url http://localhost:8000`
- Install local DynamoDB Gui: `npm install -g dynamodb-admin`
- Start local DynamoDB GUI: `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin`

### Resources
- http://localhost:3000/api/pairs/docs/
- http://localhost:3000/api/pairs



