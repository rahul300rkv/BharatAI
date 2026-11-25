import {describe,it,expect} from 'vitest';
import {demoLessons,getDemoClassroom} from './demo-classrooms';
describe('account-free classrooms',()=>{
 it('provides six topics in English and Hindi',()=>{
  expect(demoLessons).toHaveLength(6);
  for(const l of demoLessons)for(const locale of ['en','hi']){
    const id='demo-v1-'+locale+'-'+l.slug;
    const demo=getDemoClassroom(id);
    expect(demo?.stage.id).toBe(id);
    expect(demo?.stage.language).toBe(locale==='hi'?'hi-IN':'en-US');
    expect(demo?.scenes.map(s=>s.type)).toEqual(['slide','slide','quiz']);
    for(const scene of demo!.scenes){expect(scene.stageId).toBe(id);expect(scene.actions?.some(a=>a.type==='discussion')).toBe(false);if(scene.content.type==='quiz')for(const q of scene.content.questions){expect(q.type).toBe('single');expect(q.options?.some(o=>o.value===q.answer?.[0])).toBe(true);}}
  }
 });
 it('rejects unknown demo IDs',()=>expect(getDemoClassroom('demo-v1-en-missing')).toBeNull());
});
