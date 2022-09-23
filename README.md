<h1 align="center">
  Sing me a song
</h1>

# Description

<p align="justify">
<b>Sing me a song</b> is an application to recommend songs. The more people like a recommendation, the more likely it is to be recommended to others. The features are: create a recommendation, upvote and downvote each song, get a random recommendation and recommendations ordered by score.

</p>

## Environment Variables

<b>Back-end .env file</b>

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName?schema=public`

`PORT = number`

`NODE_ENV=development`

<b>Back-end .env.test file</b>

`DATABASE_URL = postgres://UserName:Password@Hostname:5432/DatabaseName-tests?schema=public`

`PORT = number #recommended:5000`

`NODE_ENV=test`

<b>Front-end .env file</b>

`REACT_APP_API_BASE_URL=http://`

</br>

## Run Locally

Clone the project

```bash
  git clone https://github.com/beatriznnds/projeto21-sing-me-a-song
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

</br>

## Tests Back-end

```bash
  cd back-end
```

Install dependencies

```bash
  npm install
```

Install prisma database

```bash
  npx prisma migrate dev
```

To run only integration tests

```bash
  npm run test:integration
```

To run only unitary tests

```bash
  npm run test:unit
```

To run both tests: unitary and integration

```bash
  npm run test
```

## Tests Front-end

```bash
  cd back-end
```

```bash
  npm run dev
```

```bash
  cd front-end
```

Install dependencies

```bash
  npm install
```

Up the front-end application

```bash
  npm start
```

Open cypress graphic interface

```bash
  npx cypress open
```
