import {listResults,insertResult,deleteResult} from '../../../db/blobs-store';
import {points,Answer} from '../../../lib/game';
export async function GET(){
 try{
  const players=await listResults(100);
  return Response.json({players});
 }catch(error){console.error('Unable to load game results',error);return Response.json({players:[]},{status:500})}
}
export async function POST(request:Request){
 try{
  if((request.headers.get('origin')||new URL(request.url).origin)!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
  const body=await request.text();if(body.length>12000)return Response.json({error:'Result too large'},{status:413});
  const data=JSON.parse(body),name=typeof data.name==='string'?data.name.trim():'',company=typeof data.company==='string'?data.company.trim():'',role=typeof data.role==='string'?data.role.trim():'',contact=typeof data.contact==='string'?data.contact.trim():'';
  const contactOk=!contact||/^[+0-9() .-]{7,25}$/.test(contact)||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
  if(!name||name.length>120||!company||company.length>160||!['Installation','Ops','CPO'].includes(role)||contact.length>120||!contactOk||typeof data.runId!=='string'||!/^[a-f0-9-]{36}$/.test(data.runId)||!Array.isArray(data.answers)||data.answers.length<1||data.answers.length>5)return Response.json({error:'Invalid result'},{status:400});
  const answers:Answer[]=data.answers;
  if(answers.some(a=>!Number.isInteger(a.scenario)||a.scenario<0||a.scenario>4||typeof a.initial!=='string'||a.initial.length>300||typeof a.final!=='string'||a.final.length>300||typeof a.vision!=='boolean')||new Set(answers.map(a=>a.scenario)).size!==answers.length||answers.filter(a=>a.vision).length>3)return Response.json({error:'Invalid decisions'},{status:400});
  const score=answers.reduce((t,a)=>t+points(a),0);
  await insertResult({name,company,role,contact,score,answers,runKey:data.runId});
  return Response.json({ok:true,score},{status:201});
 }catch(error){console.error('Unable to save game result',error);return Response.json({error:'Unable to save. Please retry.'},{status:500})}
}
export async function DELETE(request:Request){
 try{
  if((request.headers.get('origin')||new URL(request.url).origin)!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
  const id=Number(new URL(request.url).searchParams.get('id'));
  if(!Number.isSafeInteger(id)||id<1)return Response.json({error:'Invalid player ID'},{status:400});
  await deleteResult(id);
  return Response.json({ok:true});
 }catch(error){console.error('Unable to delete game result',error);return Response.json({error:'Unable to delete player data'},{status:500})}
}
