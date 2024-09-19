require('dotenv').config();

const express = require("express");
const cors = require('cors');
const { Permit } = require("permitio");

const app = express();
app.use(express.json())
app.use(cors({ origin: '*'}));
const permit = new Permit({
    pdp: "https://cloudpdp.api.permit.io",
    token: process.env.PERMIT_API_KEY
});

app.get("/", async (req, res) => {

    const permitted = await permit.check(req.query.user, req.query.action, req.query.resource);

    if (permitted) {
        res.status(200).send({ permitted: true });
    } else {
        res.status(403).send({ permitted: false });
    }
});

app.post("/", async (req, res) => {
    const { resourcesAndActions } = req.body;
    const { user: userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: "No userId provided." });
    }

    const checkPermissions = async (checkParams) => {
        const { resource, action } = checkParams;
        return permit.check(userId, action, resource);
    };

    const permittedList = await Promise.all(
        resourcesAndActions.map(checkPermissions)
    );

    return res.status(200).json({ permittedList });
});

app.listen(4000, () => {
    console.log(`Example app listening at http://localhost:4000`);
});
