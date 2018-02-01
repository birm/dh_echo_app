var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var sa = require('superagent');
const crypto = require('crypto');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

var MEMORY="new"

if (process.argv.length < 3) {
    console.log("Usage: " + __filename + " HUB_URL");
    process.exit(-1);
} else {
    var HUB_URL = process.argv[3];
}

// take in request, validate body using headers
function validate_origin(req, service) {
    var node_id = req.header("keyId");
    var signature = req.header("Signature");
    // if we're signing user_id (get)
    if (req.header("userid")){
      body = req.header("userid")
    } else {
      body = req.body
    }
    test_body = {body: body, path: "/api/" + service + req.originalUrl}
    body.url = req.originalUrl.splice(3).split("/").join("/")
    var ver_promise = new Promise(function(resolve, reject) {
        function val_sign(pub) {
            var ver = crypto.createVerify('RSA-SHA256');
            ver.update(JSON.stringify(test_body))
            if (ver.verify(pub, signature, 'base64')) {
                resolve(body)
            } else {
                reject()
            }
        }
        var key_promise = new Promise(function(key_res, key_rej) {
            sa.get(HUB_URL + "/get/key/" + node_id).end(function(sa_err, sa_res) {
                if (sa_err) {
                    key_rej();
                }
                if (sa_res) {
                    key_res(sa_res);
                } else {
                    key_rej();
                }
            })
        });
        key_promise.then(val_sign).catch(reject);
    });

    return ver_promise;
}


function handle_get(req, res){
  validate_origin(req, "echo").then(res.send(MEMORY)).catch(res.sendStatus(401));
}

function handle_post(req, res){
  validate_origin(req, "echo").then(res.send(MEMORY)).catch(res.sendStatus(401));
}

app.get("/get", handle_get);
app.post("/post", handle_post);

app.listen(8082);
