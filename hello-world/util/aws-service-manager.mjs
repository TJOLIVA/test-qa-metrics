import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

export async function GetSecret(id) {
  try {  
    const secretsManagerClient = new SecretsManagerClient();

    const params = {
      SecretId: 'auto-fe-aws_account'
    }

    const command = new GetSecretValueCommand(params);
    
    const response = await secretsManagerClient.send(command);
    const data = JSON.parse(response.SecretString);
    const secret = data[String(id)]

    //console.log('secret:'+ secret);
    return secret;
    
  } catch (error) {
    console.log('Error received in GetSecret(): ', error);
  } 


}