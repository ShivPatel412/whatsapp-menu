const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const load = file => JSON.parse(fs.readFileSync(path.join(root,'workflows',file),'utf8'));
const files = ['menu-only.json','menu-gemini.json'];
const node = (wf,name) => wf.nodes.find(n=>n.name===name);
let serial=0;
function runner(wf) {
  const fn=new Function('$','$json','$getWorkflowStaticData',node(wf,'Route and Build').parameters.jsCode);
  return (state={},choice='',text='',type) => fn(
    ()=>({item:{json:{sender:'15550000001',messageId:'fixture-'+(++serial),choice,text,messageType:type||(choice?'interactive':'text')}}}),
    {processed_ids:'[]',welcomed:true,...state},()=>({})
  );
}
const state = out => ({flow_state:out.json.flow_state,processed_ids:out.json.processed_ids,welcomed:out.json.welcomed});
function payloads(out) {return Array.isArray(out.json.payload)?out.json.payload:[out.json.payload];}
function checkPayload(p) {
  assert.equal(p.to,'15550000001');
  assert.equal(p.messaging_product,'whatsapp');
  if(p.type==='text') {assert.ok(p.text.body.length<=4096);return;}
  assert.equal(p.type,'interactive');
  if(p.interactive.type==='button') {
    assert.ok(p.interactive.action.buttons.length<=3);
    p.interactive.action.buttons.forEach(b=>assert.ok(b.reply.title.length<=20));
  } else {
    assert.equal(p.interactive.type,'list');
    const rows=p.interactive.action.sections.flatMap(s=>s.rows);
    assert.ok(rows.length<=10);
    rows.forEach(r=>assert.ok(r.title.length<=24));
  }
}
for(const file of files) {
  const wf=load(file);
  test(file+': inactive export, no credentials or dangling edges',()=>{
    assert.equal(wf.active,false);
    const names=new Set(wf.nodes.map(n=>n.name));
    for(const n of wf.nodes) {
      assert.equal(n.credentials,undefined);
      if(n.type.endsWith('.code'))new Function('$input','$','$json','$getWorkflowStaticData',n.parameters.jsCode);
    }
    for(const [source,types]of Object.entries(wf.connections)) {
      assert.ok(names.has(source));
      for(const outputs of Object.values(types))for(const output of outputs)for(const edge of output)assert.ok(names.has(edge.node),edge.node);
    }
    assert.equal(node(wf,'Load Conversation State').parameters.dataTableId.value,'REPLACE_CONVERSATION_TABLE_ID');
    assert.ok(node(wf,'Normalize Incoming').parameters.jsCode.includes('REPLACE_PHONE_NUMBER_ID'));
    assert.ok(!JSON.stringify(wf).match(/AIza[0-9A-Za-z_-]{20,}|EAA[0-9A-Za-z]{25,}/));
  });
  test(file+': guided service and quote, state survives between steps',()=>{
    const run=runner(wf);
    let s=run({},'menu_services');
    s=run(state(s),'','Custom service');
    assert.ok(s.json.payload.text.body.startsWith('*What'));
    s=run(state(s),'','Build a booking form');
    s=run(state(s),'','In six weeks');
    const saved=JSON.parse(s.json.flow_state).last_request;
    assert.equal(saved.service,'Custom service');
    assert.equal(saved.details,'Build a booking form');
    assert.equal(saved.timeline,'In six weeks');
    assert.equal(payloads(s).length,3);
    let q=run({},'menu_quote');
    q=run(state(q),'service_web');
    q=run(state(q),'','USD 500');
    q=run(state(q),'','Next month');
    assert.equal(JSON.parse(q.json.flow_state).last_request.budget,'USD 500');
    assert.equal(JSON.parse(q.json.flow_state).last_request.timeline,'Next month');
    assert.ok(JSON.stringify(q).includes('not a confirmed quote'));
  });
  test(file+': menu, links, FAQs, calls, input boundaries and button limits',()=>{
    const run=runner(wf);
    const branches=['menu_main','menu_about','menu_services','menu_quote','menu_portfolio','menu_social','social_instagram','social_linkedin','menu_call','menu_existing','existing_update','existing_change','existing_help','menu_faq','faq_services','faq_price','faq_timeline','faq_start','faq_support','faq_call','menu_human'];
    for(const choice of branches)for(const p of payloads(run({},choice)))checkPayload(p);
    const menu=run({},'','HI');
    assert.equal(menu.json.payload.interactive.action.buttons.length,3);
    assert.ok(JSON.stringify(run({},'menu_portfolio')).includes('https://example.com'));
    assert.ok(JSON.stringify(run({},'social_instagram')).includes('instagram.com/YOUR_HANDLE/'));
    assert.ok(JSON.stringify(run({},'social_linkedin')).includes('linkedin.com/in/YOUR_HANDLE/'));
    assert.ok(JSON.stringify(run({},'menu_call')).includes('not a confirmed appointment'));
    const cancel=run(state(run({},'menu_quote')),'','MENU');
    assert.ok(!JSON.parse(cancel.json.flow_state).step);
    const tooLong=run(state(run({},'menu_quote')),'','a'.repeat(601));
    assert.equal(JSON.parse(tooLong.json.flow_state).step,'service');
    assert.equal(run({},'','A normal question').json.needsAI,file==='menu-gemini.json');
  });
  test(file+': group, history, echo, old-message and wrong-phone rejection',()=>{
    const code=node(wf,'Normalize Incoming').parameters.jsCode.replaceAll('REPLACE_PHONE_NUMBER_ID','15550009999');
    const normalize=new Function('$input',code);
    const message={from:'15550000001',id:'fixture',timestamp:String(Math.floor(Date.now()/1000)),type:'text',text:{body:'HI'}};
    const value={field:'messages',metadata:{phone_number_id:'15550009999'},messages:[message]};
    const run=json=>normalize({all:()=>[{json}]});
    assert.equal(run(value).length,1);
    for(const change of [{group_id:'fixture@g.us'},{recipient_type:'group'},{from:'fixture@g.us'},{context:{group_id:'fixture@g.us'}},{timestamp:'1'}])
      assert.equal(run({...value,messages:[{...message,...change}]}).length,0);
    assert.equal(run({...value,field:'history'}).length,0);
    assert.equal(run({...value,field:'smb_message_echoes'}).length,0);
    assert.equal(run({...value,metadata:{phone_number_id:'wrong'}}).length,0);
    assert.equal(run({entry:[{changes:[{field:'history',value}]}]}).length,0);
  });
}

