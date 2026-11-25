import { lessons } from '@/lib/public-lessons';
import type { Scene, Stage } from '@/lib/types/stage';
import type { Slide, PPTTextElement } from '@/lib/types/slides';
const hindi=[
['न्यूटन के गति के नियम','भौतिकी · कक्षा 11','वस्तु का वेग तब तक स्थिर रहता है जब तक उस पर कुल बाहरी बल न लगे। दूसरा नियम F = ma है। तीसरे नियम में क्रिया और प्रतिक्रिया अलग वस्तुओं पर लगती हैं।','5 kg की वस्तु पर आगे 20 N और पीछे 5 N बल है। कुल बल 15 N तथा त्वरण 3 m/s² है।','2 kg की वस्तु पर कुल 8 N बल है। त्वरण कितना है?','4 m/s²','कुल बल को द्रव्यमान से भाग दें।'],
['विद्युत धारा और ओम का नियम','भौतिकी · कक्षा 10','धारा प्रति इकाई समय प्रवाहित आवेश है। स्थिर तापमान पर ओमीय चालक के लिए V = IR है।','12 V तथा 6 Ω के लिए धारा 2 A और शक्ति 24 W है।','दो 4 Ω प्रतिरोध समानांतर में 8 V से जुड़े हैं। कुल धारा कितनी है?','4 A','समानांतर प्रतिरोध 2 Ω है।'],
['द्विघात समीकरण','गणित · कक्षा 10','ax² + bx + c = 0 में a शून्य नहीं है। विविक्तकर b² − 4ac मूलों की प्रकृति बताता है।','x² − 5x + 6 = 0 के गुणनखंड (x − 2)(x − 3) हैं। मूल 2 और 3 हैं।','x² + 2x − 8 = 0 के मूल क्या हैं?','−4 और 2','गुणनखंड (x + 4)(x − 2) हैं।'],
['मानव हृदय और रक्त परिसंचरण','जीव विज्ञान · कक्षा 11','हृदय का दायाँ भाग रक्त फेफड़ों तक और बायाँ भाग ऑक्सीजन युक्त रक्त शरीर तक भेजता है। वाल्व रक्त का उलटा प्रवाह रोकते हैं।','शरीर से रक्त दायाँ आलिंद, दायाँ निलय, फेफड़े, बायाँ आलिंद, बायाँ निलय और महाधमनी से होकर जाता है।','महाधमनी में रक्त कौन सा कक्ष भेजता है?','बायाँ निलय','यह शरीर में रक्त भेजने का दबाव बनाता है।'],
['प्रकाश संश्लेषण','जीव विज्ञान · कक्षा 10','पौधे प्रकाश ऊर्जा से जल और कार्बन डाइऑक्साइड का उपयोग करके कार्बोहाइड्रेट बनाते हैं। क्लोरोफिल प्रकाश सोखता है।','स्टार्च रहित पत्ती के ढके और खुले हिस्से की आयोडीन से जाँच करके प्रकाश की भूमिका समझ सकते हैं।','प्रयोग से पहले पत्ती को स्टार्च रहित क्यों करते हैं?','पहले से मौजूद स्टार्च हटाने के लिए','इससे नया बना स्टार्च पहचाना जा सकता है।'],
['भारत में मौलिक अधिकार','नागरिक शास्त्र · UPSC','संविधान के भाग III में मौलिक अधिकार हैं। कुछ सभी व्यक्तियों को और कुछ नागरिकों को मिलते हैं। इन पर संवैधानिक प्रतिबंध हो सकते हैं।','अनुच्छेद 14 समानता, 19 नागरिक स्वतंत्रताएँ और 32 मौलिक अधिकारों के प्रवर्तन के लिए सर्वोच्च न्यायालय जाने का अधिकार देता है।','मौलिक अधिकारों के प्रवर्तन के लिए सर्वोच्च न्यायालय जाने का अधिकार किस अनुच्छेद में है?','अनुच्छेद 32','उच्च न्यायालयों को अनुच्छेद 226 के तहत रिट अधिकारिता भी है।']
];
const choices=[['4 m/s²','16 m/s²','2 m/s²'],['4 A','1 A','2 A'],['−4 and 2','4 and 2','−2 and −4'],['Left ventricle','Right atrium','Right ventricle'],['Remove existing starch','Stop respiration','Remove chlorophyll'],['Article 32','Article 19','Article 14']];
const hiChoices=[['4 m/s²','16 m/s²','2 m/s²'],['4 A','1 A','2 A'],['−4 और 2','4 और 2','−2 और −4'],['बायाँ निलय','दायाँ आलिंद','दायाँ निलय'],['पहले से मौजूद स्टार्च हटाने के लिए','श्वसन रोकने के लिए','क्लोरोफिल हटाने के लिए'],['अनुच्छेद 32','अनुच्छेद 19','अनुच्छेद 14']];
export const demoLessons=lessons.map((l,i)=>({slug:l.slug,title:l.title,hindiTitle:hindi[i][0],subject:l.subject,hindiSubject:hindi[i][1]}));
export function getDemoClassroom(id:string):{stage:Stage;scenes:Scene[]}|null{
 const m=/^demo-v1-(en|hi)-([a-z-]+)$/.exec(id);if(!m)return null;
 const i=lessons.findIndex(l=>l.slug===m[2]);if(i<0)return null;
 const l=lessons[i],hi=m[1]==='hi',h=hindi[i];
 const title=hi?h[0]:l.title,concept=hi?h[2]:l.concept,example=hi?h[3]:l.example,question=hi?h[4]:l.question,analysis=hi?h[6]:l.answer;
 const stage:Stage={id,name:title,description:concept,language:hi?'hi-IN':'en-US',createdAt:0,updatedAt:0};
 const esc=(s:string)=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
 const text=(key:string,value:string,left:number,top:number,width:number,height:number,size:number):PPTTextElement=>({type:'text',id:id+'-'+key,left,top,width,height,rotate:0,content:'<p style="font-size:'+size+'px;line-height:1.5">'+esc(value)+'</p>',defaultFontName:'Noto Sans',defaultColor:'#182334'});
 const slide=(order:number,heading:string,body:string,diagram:boolean):Scene=>{
  const sid=id+'-'+order;
  const canvas:Slide={id:sid+'-canvas',viewportSize:1000,viewportRatio:0.5625,theme:{backgroundColor:'#ffffff',themeColors:['#e8650a','#2563eb','#15803d'],fontColor:'#182334',fontName:'Noto Sans',outline:{color:'#cccccc',width:1,style:'solid'},shadow:{h:0,v:0,blur:0,color:'#000000'}},elements:[text(order+'-title',heading,35,20,930,90,32),text(order+'-body',body,35,120,diagram?440:930,390,23),...(diagram?[{id:sid+'-image',type:'image' as const,left:510,top:135,width:460,height:238,rotate:0,fixedRatio:true,src:'/learning/'+l.slug+'.svg'}]:[])]};
  return {id:sid,stageId:id,type:'slide',title:heading,order,content:{type:'slide',canvas},actions:[{id:sid+'-speech',type:'speech',text:body}]};
 };
 const opts=(hi?hiChoices:choices)[i];const shift=i%3;
 const questions=[{id:id+'-q1',type:'single' as const,question,options:opts.map((_,n)=>({label:opts[(n+shift)%3],value:String(n)})),answer:[String((3-shift)%3)],analysis,hasAnswer:true,points:1}];
 return {stage,scenes:[slide(1,title,concept,true),{...slide(2,hi?'हल किया गया उदाहरण':'Worked example',example,false),actions:[{id:id+'-ex-speech',type:'speech',text:example},{id:id+'-wb-open',type:'wb_open'},{id:id+'-wb-text',type:'wb_draw_text',content:esc(example),x:45,y:60,width:890,height:250,fontSize:25},{id:id+'-wb-close',type:'wb_close'}]},{id:id+'-quiz',stageId:id,type:'quiz',title:hi?'अपनी समझ जाँचें':'Check your understanding',order:3,content:{type:'quiz',questions},actions:[]}]};
}
