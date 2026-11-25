import { NextRequest, NextResponse } from 'next/server';
export const dynamic='force-dynamic';
const urls={nvidia:'https://integrate.api.nvidia.com/v1/models',openrouter:'https://openrouter.ai/api/v1/models'} as const;
export async function POST(req:NextRequest){
 try{
  const {provider,apiKey,freeOnly}=await req.json();
  if(provider!=='nvidia'&&provider!=='openrouter')return NextResponse.json({error:'Unsupported catalogue'},{status:400});
  if(provider==='nvidia'&&(typeof apiKey!=='string'||!apiKey.trim()||apiKey.length>1024))return NextResponse.json({error:'Enter your NVIDIA API key first.'},{status:400});
  const res=await fetch(urls[provider as keyof typeof urls],{headers:provider==='nvidia'?{Authorization:'Bearer '+apiKey}:{},redirect:'error',cache:'no-store',signal:AbortSignal.timeout(12000)});
  if(!res.ok)return NextResponse.json({error:'Catalogue unavailable ('+res.status+')'},{status:502});
  const body=await res.json();
  const models=(Array.isArray(body.data)?body.data:[]).filter((m:any)=>typeof m.id==='string'&&(provider!=='openrouter'||!freeOnly||(m.pricing?.prompt==='0'&&m.pricing?.completion==='0'&&m.supported_parameters?.includes('tools')))).slice(0,300).map((m:any)=>({id:m.id,name:m.name||m.id,contextWindow:m.context_length||undefined,capabilities:{streaming:true,tools:provider==='openrouter'?Boolean(m.supported_parameters?.includes('tools')):undefined,vision:provider==='openrouter'?Boolean(m.architecture?.input_modalities?.includes('image')):undefined}}));
  return NextResponse.json({models});
 }catch{return NextResponse.json({error:'Could not retrieve live model catalogue.'},{status:502});}
}
