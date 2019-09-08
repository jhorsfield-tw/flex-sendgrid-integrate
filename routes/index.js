var express = require('express');
var router = express.Router();
const cors = require('cors');
var multer = require('multer');
var upload = multer();
const mailParse = require('@sendgrid/inbound-mail-parser');
const taskroute = require('../public/javascripts/taskrouter.js');
const sendgrid = require('../public/javascripts/sendgrid');


/* GET home page. */
router.get('/', upload.none(), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/mail', upload.none(), function(req, res, next) {
  try {    
    const config = {keys: ['to', 'from', 'subject', 'text',]};
    const parsing = new mailParse(config, req.body);
    let response = parsing.keyValues();
    let to = response.to;
    let from = response.from;
    if (from.indexOf('>') != -1){
      from = from.match(/\<([^>]+)\>/)[1];
    }
    let subject = response.subject;
    let messageBody = response.text;
    //var regex = '/\r\n/gi';
    //messageBody = messageBody.replace(regex, '<br />');
    let attr = {
      'to': to,
      'from': from,
      'subject': subject,
      'message': messageBody
    };
    taskroute.taskcreate(attr);
    console.log('This is the key value from the mail: ', subject);
    res.status(200).send('success');
  }
  catch(err){
    console.log('This is the error: '+err);
    res.status(500).send(err);
  }  
  
});

router.post('/sgrid', cors(), function(req, res, next){
  console.log('This is the bearer token: ', req.headers.authorization);
  sendgrid.sendmail(req.headers.authorization, req.body);
  res.status(200).send('success');
});

router.options('*', cors())


module.exports = router;
