require ('dotenv').config();
const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);

exports.taskcreate = async function(attibutes){
    //create the taskrouter taks for this email
    console.log('This is the input to task create: '+JSON.stringify(attibutes));
    let messageAttr = JSON.stringify(attibutes);
    let route = await router(messageAttr);
    if (route === 'success'){
        console.log('Task creation handed back successfully');
        return;
    } 
    else {
        console.log('Task handback failed');
        return;
    }

};

function router(message){
    return new Promise(function(resolve, reject){
        client.taskrouter.workspaces(process.env.WORKSPACE_SID)
        .tasks
        .create({
            attributes: message,
            workflowSid: process.env.WORKFLOW_SID,
            taskChannel: 'email',
            timeout: 60 * 60 * 24 * 10
        })
        .then(task => {
            console.log('This is the task SID: ', task.sid);
            resolve('success');
        })
        .catch(err => {
            console.log('This is the task error: ', err);
            reject('failed');
        })
    })
}