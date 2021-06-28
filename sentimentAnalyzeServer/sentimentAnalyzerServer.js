const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

function getNLUInstance() {
    let api_key = process.env.api_key;
    let api_url = process.env.api_url;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            api_key: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {
    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
    let NLUInstance = getNLUInstance();
    
    const analyzeParams = {
        'text': req.query.text,
        'features': 'emotion'
    };

    NLUInstance.analyze(analyzeParams)
    .then(analysisResults => {
        res.send(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        res.send(err.toString());
    });
});

app.get("/text/sentiment", (req,res) => {
    let NLUInstance = getNLUInstance();
    
    const analyzeParams = {
        text: req.query.text
    };

    NLUInstance.analyze(analyzeParams)
    .then(analysisResults => {
        res.send(JSON.stringify(analysisResults, null, 2));
    })
    .catch(err => {
        res.send(err.toString());
    });
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})