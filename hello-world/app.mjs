/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
import axios from "axios";
import { ManageData,InsertData } from './util/db-service.mjs';

export const lambdaHandler = async (event, context) => {



  console.log('Event:', JSON.stringify(event, null, 2))


  // Extract the body from the event
  const bodyString = event.body;

  // Parse the body string into a JavaScript object
  const bodyObject = JSON.parse(bodyString);
  const project_code = bodyObject.project_code;
  const time_stamp = bodyObject.timestamp;
  const event_name = bodyObject.event_name;
  const payload_id = bodyObject.payload.id;
  let automationStatus,timestamp = null;

  if (event_name == 'case.updated') {
    console.log("event: " + event_name);
    console.log("id: " + payload_id);
    const options = {
      method: 'GET',
      url: `https://api.qase.io/v1/case/EDUC/${payload_id}`,
      headers: {
        accept: 'application/json',
        Token: '2e7af9ef8adcf337e2eb2be8470b69c898403b3433b8a2b5a2316beca55cf0d9'
      }
    };

    await axios
    .request(options)
    .then((response) => {
      console.log("automation: "+ JSON.stringify(response.data.result.automation, null, 2));
      automationStatus = response.data.result.automation 
      timestamp = response.data.result.updated
    })
    .catch((err) => console.log(err));

    //prepare parameters to be inserted to db
    await InsertData(project_code.toUpperCase()
                      ,payload_id,event_name.slice(event_name.indexOf('.')+1).toLowerCase()
                      ,timestamp
                      ,automationStatus);

  }

  const response2 = {
    statusCode: 200,
      body: JSON.stringify({
          eventName: event_name,
          projectCode: project_code,
          payloadId: payload_id,
          automation: automationStatus,
          timestamp: time_stamp,
      })
  };

  return response2;
};
  