/*
node index
nodemon index --ignore db.json
*/

// EXPRESS INIT
const express = require('express'),
    cors = require('cors'),
    app = express()

// ASSETS & HELPFUL
const shortid = require('shortid')

// LOWDB - JSON DB CREATE
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db/db.json')
const db = low(adapter)
db.defaults({ db_task: [], count: 0 }).write()

const db_task = db.get('db_task'),
    db_count = db.get('count')

// BODYPARSER
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// API
app.all('*', cors())

app.route('/api')
    .get(cors(), function (req, res) {
        res.send('api solo')
    })
    //----------------------------------- POST
    .post(cors(), function (req, res) {
        var title = req.body.title,
            id = shortid.generate(),
            status = req.body.status,
            description = req.body.description,
            date = new Date().toLocaleString('es-AR', { hour12: false })

        if (title && status && description) {
            db_task
                .push({
                    id,
                    title,
                    status,
                    description,
                    date
                })
                .write()

            db.update('count', n => n + 1).write()
            res.status(200).json(db_task.find({ id }).value())
        } else {
            res.status(400).json('Oops! Something wrong happened.')
        }
    })

    //----------------------------------- PUT
    .put(cors(), function (req, res) {
        var id = req.body.id,
            title = req.body.title,
            status = req.body.status,
            description = req.body.description,
            date = new Date().toLocaleString('es-AR', { hour12: false }),
            value = db_task.find({ id }).value()

        if (value) {
            db_task
                .find({ id })
                .assign({
                    status,
                    title,
                    description,
                    date
                })
                .write()
            res.status(200).json(value)
        } else {
            res.status(400).json('Oops! ID: "' + id + '" not exist.')
        }
    })

    //----------------------------------- DELETE
    .delete(cors(), function (req, res) {
        var id = req.body.id,
            value = db_task.find({ id }).value()

        if (value) {
            db_task
                .remove({ id })
                .write()
            res.status(200).json(value)
        } else {
            res.status(400).json('Oops! ID: "' + id + '" not exist.')
        }
    })

app.route('/api/:status')
    //----------------------------------- GET
    .get(cors(), function (req, res) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');

        //res.json(db.getState())
        switch (req.params.status) {
            case "todo":
                res.json(db_task.filter({ status: 'TODO' }).value())
                break;
            case "done":
                res.json(db_task.filter({ status: 'DONE' }).value())
                break;
            case "inprogress":
                res.json(db_task.filter({ status: 'IN PROGRESS' }).value())
                break;
            case "deleted":
                res.json(db_task.filter({ status: 'DELETED' }).value())
                //.take(5)
                break;
            case "total":
                res.json({ count_live: db_task.size().value(), count_total: db_count.value() })
                break;
            default:
                res.json(db_task.find({ id: req.params.status }).value())
                break;
        }
    })

app.listen(8080, function () {
    console.log(`Server escuchando en puerto 8080!`)
});