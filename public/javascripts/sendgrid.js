require ('dotenv').config();
const axios = require('axios');
const sendGrid = require('@sendgrid/mail');
sendGrid.setApiKey(process.env.SG_API_KEY);
const accntSID = process.env.ACCOUNT_SID;
const authTOK = process.env.AUTH_TOKEN;

exports.sendmail = async function(token, attributes, res){
    console.log('This is the input to task create: '+JSON.stringify(attributes));
    //validate token
    //set axios headers
    const url = `https://preview.twilio.com/iam/Accounts/${process.env.ACCOUNT_SID}/Tokens/validate`;
    if (token.startsWith('Bearer ')){
        var newToken = token.substring(7, token.length);
    }
    else{
        console.log('Bearer token is not valid....')
        return;
    }
    let axiosConfig = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json'
        },
        auth: {
            'username': accntSID,
            'password': authTOK
        }
      };
      let postData = {
        token: newToken
      };
      let tokenPost = await axiosPost(url, postData, axiosConfig);
      console.log('This is tokenpost value: ', tokenPost);
      if (tokenPost === 'valid'){
          console.log('now about to send to sendgrid mailer');
          let sendGridMail = await sgMailer(attributes);
          if (sendGridMail === 'success'){
              return;
          }
          else {
              return;
          }
      }
      else {
          console.log('In the error trap for sendgrid');
          return;
      }
};

function axiosPost(url, data, conf){
    return new Promise(function(resolve, reject){
        axios.post(url, data, conf)
        .then(result => {
            console.log('This is the reponse from the Twilio token check: ', result.data.valid);
            if(result.data.valid = true){
                console.log('In the valid loop');
                resolve('valid');
            }
            else{
                console.log('In the invalid loop');
                resolve('invalid');
            }
        })
        .catch(err => {
            console.log('This is the error from the twilio token lookup: ', err);
            reject('error');
        })
    })
}

function sgMailer(data){
    return new Promise(function (resolve, reject){
        try {
        const {to, from, subject, html} = data;
        const msg = {to, from, subject, html};
        console.log('This the message: ', msg);
        sendGrid.send(msg)
        .then((message) => {
            resolve('success');
        })
        .catch(err => {
            console.log('Thats failed: ', err);
            resolve('error');
        })
        }
        catch(err){
            console.log('This is the core error from the sgMailer: ', err);
        }
        
    })
}