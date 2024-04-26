import pg from 'pg';
import { GetSecret } from './aws-service-manager.mjs'

// PostgreSQL connection config
const pgClient = new pg.Client({
  user: 'postgres',
  host: 'host.docker.internal', 
  database: 'postgres',
  password: await GetSecret('metrics_db_pw'), 
  port: 5432,  
});
 

export async function InsertData(projcode,tc_id,event_name,timestamp,automation_status=null,smoke_flag=null, regression_flag=null){
  return ManageData("INSERT INTO public.educqa_test_cases(projcode, tc_id, event_name, timestamp, automation_status,smoke_flag,regression_flag) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *"
                      ,[projcode,tc_id,event_name,timestamp,automation_status,smoke_flag,regression_flag]);
}

export async function ManageData(query,values = []) {
  try{
      await pgClient.connect()

      console.log('Connected to PostgreSQL database'); 
      const res = await pgClient.query(query,values);
      console.log('Query result rows:', res.rowCount);

      await pgClient.end();
      return res;

  }catch(err){
    console.error('Error executing query to PostgreSQL:', err);
  }
}

 
