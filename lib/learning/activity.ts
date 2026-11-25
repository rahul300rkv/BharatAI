// All activity is local. No prompt text, API keys, profile or document data is recorded.
export const eventNames=['classroom_generation_started','classroom_generation_completed','classroom_generation_failed','demo_classroom_opened','lab_interacted','quiz_completed','classroom_resumed','language_changed','learning_path_completed','lesson_completed'] as const;
export type ActivityEvent=typeof eventNames[number];
export type Visit={id:string;sceneId:string;visited:string[];total:number;at:number};
export type Activity={counts:Partial<Record<ActivityEvent,number>>;completed:string[];visits:Visit[]};
const KEY='bharatai:activity:v1';
export const emptyActivity:Activity={counts:{},completed:[],visits:[]};
export function readActivity():Activity{try{const a=JSON.parse(localStorage.getItem(KEY)||'null');if(a&&Array.isArray(a.visits)&&Array.isArray(a.completed)&&a.counts)return a;}catch{}return {counts:{},completed:[],visits:[]}}
function write(a:Activity){try{localStorage.setItem(KEY,JSON.stringify(a));window.dispatchEvent(new Event('bharatai-activity'));}catch{}}
export function track(event:ActivityEvent){if(!eventNames.includes(event))return;const a=readActivity();a.counts[event]=(a.counts[event]||0)+1;write(a);}
export function completeActivity(id:string,event:ActivityEvent){if(!/^(lab|lesson|path|daily):[a-z0-9-]+$/.test(id))return;const a=readActivity();if(a.completed.includes(id))return;a.completed=[...a.completed,id].slice(-400);a.counts[event]=(a.counts[event]||0)+1;write(a);}
export function recordVisit(id:string,sceneId:string,total:number){if(!/^[a-zA-Z0-9_-]{1,100}$/.test(id)||!sceneId||!total)return;const a=readActivity(),old=a.visits.find(v=>v.id===id);a.visits=[{id,sceneId,visited:[...new Set([...(old?.visited||[]),sceneId])].slice(-200),total,at:Date.now()},...a.visits.filter(v=>v.id!==id)].slice(0,30);write(a);}
export function lastVisit(id:string){return readActivity().visits.find(v=>v.id===id)}
export function clearActivity(){try{localStorage.removeItem(KEY);window.dispatchEvent(new Event('bharatai-activity'));}catch{}}
