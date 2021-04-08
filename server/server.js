require('dotenv').config({ path: './server.env' });
const express = require('express');
const cors = require('cors');
const { XMLHttpRequest } = require('xmlhttprequest');

const app = express();
app.use(cors());
const { PORT, API, URL, TOKEN } = process.env;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const http = (method, path) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, API + path);
    xhr.setRequestHeader('X-API-Token', TOKEN);
    xhr.setRequestHeader('Content-Type', 'application/json');
    return xhr;
};

const result = (name, id) => {
    const xhr = http('GET', `/builds/${id}`);
    xhr.onload = async () => {
        const build = JSON.parse(xhr.responseText);
        if (build.finishTime) {
            const start = new Date(build.startTime).getTime();
            const finish = new Date(build.finishTime).getTime();
            const interval = Math.round((finish - start) / 1000);
            console.log(
                `\n${name} build ${build.status} in ${interval} seconds.`,
                `\nLink to build logs: ${URL}/build/branches/${name}/builds/${build.id}`
            );
        } else {
            await sleep(10000);
            result(name, id);
        }
    };
    xhr.send();
};

const createBuild = branches => {
    branches.forEach(branch => {
        const xhr = http('POST', `/branches/${branch.name}/builds`);
        xhr.onload = () => {
            const build = JSON.parse(xhr.responseText);
            result(branch.name, build.id);
        };
        xhr.send(JSON.stringify({
            sourceVersion: branch.commit.sha,
            debug: true
        }));
    });
};

app.post('/', (req, res) => {
    const xhr = http('GET', '/branches');
    xhr.onload = () => {
        const branches = JSON.parse(xhr.responseText).map(b => b.branch);
        createBuild(branches);
        res.json(`Branches to build: ${branches.map(b => b.name).join(', ')}`);
    };
    xhr.send();
});

app.listen(PORT, () => console.log(`Server is up and listening on port ${PORT}`));
