# Single-Container Local Setup

This project includes an all-in-one Docker image that runs MySQL, the Spring Boot backend, and the React frontend behind Nginx in a single container. It exposes:

- Frontend at http://localhost
- API at http://localhost/api
- Health at http://localhost/health
- MySQL on localhost:3306 (for tools like DBeaver)

## Quick start

1. Build and start

```
# Build the image and start the container (ports 80 and 3306 exposed)
docker-compose -f docker-compose.local.yml up -d --build

# Check status
docker-compose -f docker-compose.local.yml ps

# Tail logs
docker-compose -f docker-compose.local.yml logs -f
```

2. Open the app

- Frontend: http://localhost
- API (proxied): http://localhost/api
- Health: http://localhost/health

Default login
- Email: admin@nxtclass.com
- Password: Admin@123

3. Database access (DBeaver, etc.)

- Host: localhost
- Port: 3306
- Database: nxtClass108
- Username: nxtclass_user
- Password: nxtclass_pass_2024

Notes:
- MySQL data is persisted to a local Docker volume `mysql-local-data`.
- If you need a fresh database, run: `docker-compose -f docker-compose.local.yml down -v`.

## What’s inside the container

- Nginx serves the built frontend from `/var/www/html` and proxies `/api` to the backend
- Spring Boot backend runs on port 8080
- MySQL runs on port 3306 and is initialized on first start
- Supervisor keeps all services running and initializes the DB

## Troubleshooting

- If you see Nginx or MySQL failing to start, run:
```
docker-compose -f docker-compose.local.yml logs --tail=300
```
- Health check returns `200 OK`: `curl -i http://localhost/health`
- API returns 401 (expected for protected endpoints): `curl -i http://localhost/api/actuator/health`

## Verify name field compatibility

The backend now accepts multiple input keys for first and last name and normalizes responses to `fName`/`lName`:

- Accepted on input: `fName`/`lName` (canonical), `firstName`/`lastName`, `fname`/`lname`, `f_name`/`l_name`
- Returned in responses: `fName` and `lName`

Quick smoke tests (copy-paste each block):

```
# 1) Get a JWT token (admin)
TOKEN=$(curl -sS -X POST http://localhost/api/auth/login \
	-H 'Content-Type: application/json' \
	-d '{"email":"admin@nxtclass.com","password":"Admin@123"}' \
	| sed -E 's/.*"token":"([^"]+)".*/\1/')
echo "$TOKEN"

# 2) Create a student with firstName/lastName
ID=$(curl -sS -X POST http://localhost/api/student-details/save \
	-H "Authorization: Bearer $TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{"firstName":"Alias First","lastName":"Alias Last","email":"alias@example.com"}')
echo "Created ID: $ID"

# 3) Fetch and confirm fName/lName in response
curl -sS http://localhost/api/student-details/$ID -H "Authorization: Bearer $TOKEN"
```

Try other variants as needed (snake_case and lowercase):

```
# snake_case
curl -sS -X POST http://localhost/api/student-details/save \
	-H "Authorization: Bearer $TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{"f_name":"Snake First","l_name":"Snake Last"}'

# lowercase
curl -sS -X POST http://localhost/api/student-details/save \
	-H "Authorization: Bearer $TOKEN" \
	-H 'Content-Type: application/json' \
	-d '{"fname":"Lower First","lname":"Lower Last"}'
```

## Cleaning up legacy NULL names (optional)

If your existing DB has rows with NULL `f_name`/`l_name`, you can use the helper script `backend/database-cleanup.sql` from your SQL client (e.g., DBeaver). It provides safe checks and either delete or update options.
