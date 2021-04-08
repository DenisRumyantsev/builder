Getting started:

Create `server.env` file in server directory with the next variables in it: `PORT`, `API`, `URL`, `TOKEN`

`PORT` is a port of Node.js application server

`API` is an url like 'https://api.appcenter.ms/v0.1/apps/<USER_NAME>/<APP_TITLE>'

My example: `API = 'https://api.appcenter.ms/v0.1/apps/Denis_Rumyantsev/FirstApp'`

`URL` is an url like 'https://appcenter.ms/users/<USER_NAME>/apps/<APP_TITLE>'

My example: `URL = 'https://appcenter.ms/users/Denis_Rumyantsev/apps/FirstApp'`

`TOKEN` is a string of 20 symbols, an app token, which you can get in App Center

If you want to get my token, just ask me about it

Open terminal and run `npm i` script to install the necessary libraries

Then run the next script: `npm run start`

Optionally you can run `npm run dev` instead of `npm run start` for development purposes

Then go to the client directory and open `index.html` in your browser

Type app address in the input field, for now it should be `http://localhost:<PORT>`

Click `make POST request` button

You can make POST request by any other way, e.g. by using Postman

In the response you can see which branches will be built

Into the terminal you can see info about the build after the one will be finished
