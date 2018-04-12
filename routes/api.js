const express = require('express');
const router = express.Router();
const { WatsonMLScoringEndpoint } = require("watson-ml-model-utils");
const watsonMLScoringEndpoint = new WatsonMLScoringEndpoint(['Heartbeats', 'Seconds']);

router.post('/predictPulseRate', function(req, res, next) {
  watsonMLScoringEndpoint.score([req.body.heartBeats, req.body.timeInSeconds])
    .then((response) => {
      res.json({
        ok: true,
        bpm: response.prediction
      });
    })
    .catch((err) => {
      res.json({ok: false});
    });
});

router.post('/autoPredictPulseRate', function(req, res, next) {
  watsonMLScoringEndpoint.score([req.body.heartBeats, req.body.timeInSeconds])
    .then((response) => {
      res.json({
        ok: true,
        bpm: response.prediction
      });
    })
    .catch((err) => {
      res.json({ok: false});
    });
});

module.exports = router;
