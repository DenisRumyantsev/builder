require('dotenv').config({ path: './server.env' });
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
const { PORT, API, URL, TOKEN } = process.env;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const result = async (name, id) => {
    const response = await fetch(`${API}/builds/${id}`, {
        method: 'GET', headers: { 'X-API-Token': TOKEN }
    });
    const build = JSON.parse(await response.text());
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
        await result(name, id);
    }
};

const createBuild = async branches => {
    await branches.forEach(async branch => {
        const response = await fetch(`${API}/branches/${branch.name}/builds`, {
            method: 'POST',
            headers: {
                'X-API-Token': TOKEN,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sourceVersion: branch.commit.sha,
                debug: true
            })
        });
        const build = JSON.parse(await response.text());
        await result(branch.name, build.id);
    });
};

app.post('/', async (req, res) => {
    const response = await fetch(`${API}/branches`, {
        method: 'GET', headers: { 'X-API-Token': TOKEN }
    });
    const branches = JSON.parse(await response.text()).map(b => b.branch);
    await createBuild(branches);
    res.json(`Branches to build: ${branches.map(b => b.name).join(', ')}`);
});

app.listen(PORT, () => console.log(`Server is up and listening on port ${PORT}`));
