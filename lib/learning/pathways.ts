import type {LabSlug} from '@/lib/virtual-labs';
export const pathways:{id:string;lesson:string;labs:LabSlug[]}[]=[
{id:'electricity',lesson:'ohms-law',labs:['ohms-law','series-parallel-circuits']},
{id:'motion',lesson:'newtons-laws',labs:['projectile-motion','simple-pendulum']},
{id:'algebra',lesson:'quadratic-equations',labs:['quadratic-equations','trigonometry']},
];
export const goals=['General','CBSE','JEE','NEET','UPSC'] as const;
export type Goal=typeof goals[number];
export function suggestedLabs(goal:Goal,subject:string){return (goal==='UPSC'?[]:goal==='JEE'?['Physics','Mathematics','Chemistry']:goal==='NEET'?['Physics','Chemistry','Biology']:['Physics','Mathematics','Chemistry','Biology','Computer Science']).filter(s=>!subject||s===subject);}
export function pathComplete(path:typeof pathways[number],done:string[]){return done.includes('lesson:'+path.lesson)&&path.labs.every(l=>done.includes('lab:'+l));}
