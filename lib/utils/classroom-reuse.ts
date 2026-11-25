import {db} from './database';
import type { UserRequirements, SceneOutline } from '@/lib/types/generation';
const PREFIX='bharatai:reuse:v1:';
const TTL=7*24*60*60*1000;
export function classroomReuseKey(session:{requirements:UserRequirements;pdfStorageKey?:string;pdfText?:string;pdfImages?:unknown[];imageStorageIds?:string[];imageMapping?:unknown;researchContext?:string;sceneOutlines?:SceneOutline[]|null},settings:{agentMode:string;selectedAgentIds:string[];imageGenerationEnabled?:boolean;videoGenerationEnabled?:boolean},model:{modelString:string;baseUrl?:string}):string|null {
 const r=session.requirements;
 if(!r.requirement.trim()||r.userBio||r.userNickname||r.webSearch||session.pdfStorageKey||session.pdfText||session.pdfImages?.length||session.imageStorageIds?.length||session.imageMapping||session.researchContext||session.sceneOutlines?.length||settings.agentMode!=='preset'||settings.imageGenerationEnabled||settings.videoGenerationEnabled) return null;
 // Exact text (case-sensitive); never store API keys or uploaded content.
 return JSON.stringify([r.requirement.trim(),r.language,model.modelString,model.baseUrl||'',settings.selectedAgentIds]);
}
export async function findReusableClassroom(key:string):Promise<string|null>{
 try{
  const raw=localStorage.getItem(PREFIX+key);if(!raw)return null;
  const record=JSON.parse(raw) as {id:string;at:number};
  if(Date.now()-record.at>TTL){localStorage.removeItem(PREFIX+key);return null;}
  const stage=await db.stages.get(record.id),outlines=await db.stageOutlines.get(record.id);
  if(!stage||!outlines?.outlines?.length)return null;
  const scenes=await db.scenes.where('stageId').equals(record.id).toArray();
  const orders=new Set(scenes.map(s=>s.order));
  return outlines.outlines.every(o=>orders.has(o.order))?record.id:null;
 }catch{return null;}
}
export function rememberClassroom(key:string,id:string):void{
 try{
  localStorage.setItem(PREFIX+key,JSON.stringify({id,at:Date.now()}));
  const entries=Object.keys(localStorage).filter(k=>k.startsWith(PREFIX)).map(k=>({k,at:Number(JSON.parse(localStorage.getItem(k)||'{}').at)||0})).sort((a,b)=>b.at-a.at);
  for(const e of entries.slice(30))localStorage.removeItem(e.k);
 }catch{/* storage is optional */}
}
