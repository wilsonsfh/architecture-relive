import json,time,traceback
from pathlib import Path
from playwright.sync_api import sync_playwright
OUT=Path('/home/ubuntu/AI-round/analysis/p7-qa/v2238');BASE='http://127.0.0.1:5817/'
log=json.loads((OUT/'console.json').read_text());obs=json.loads((OUT/'observations.json').read_text())

def geometry(page,selector):
 return page.locator(selector).evaluate_all('''nodes => nodes.map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);const range=document.createRange();range.selectNodeContents(n);const t=range.getBoundingClientRect();
 const hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);
 const textSamples=[.1,.5,.9].map(f=>{const h=document.elementFromPoint(t.x+t.width*f,t.y+t.height/2);return {fraction:f,uncovered:h===n||n.contains(h),hit:h?.className};});
 return {text:n.textContent.trim(),x:r.x,y:r.y,width:r.width,height:r.height,opacity:s.opacity,hidden:n.classList.contains('hide'),
 textRect:{x:t.x,y:t.y,width:t.width,height:t.height},centerUncovered:hit===n||n.contains(hit),inViewport:r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight,textSamples};})''')

def attach(page):
 page.on('console',lambda m:log['console'].append({'type':m.type,'text':m.text,'location':m.location,'page_url':page.url,'time':time.time(),'run':'supplement'}) if m.type in ('warning','error') else None)
 page.on('pageerror',lambda e:log['page_errors'].append({'text':str(e),'page_url':page.url,'time':time.time()}))
 page.on('response',lambda r:log['failed_requests'].append({'status':r.status,'url':r.url,'method':r.request.method,'resource_type':r.request.resource_type,'page_url':page.url,'time':time.time()}) if r.status>=400 else None)
 page.on('requestfailed',lambda r:log['request_failures'].append({'url':r.url,'failure':r.failure,'page_url':page.url,'time':time.time()}))

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},color_scheme='light',device_scale_factor=1)
 page=context.new_page();attach(page)
 try:
  # No same-document hash reuse: a new page guarantees the initial Nave camera and term.
  page.goto(BASE+'#/b/chartres/inside',wait_until='networkidle');page.wait_for_selector('.inside[data-ready="1"]',timeout=20000);page.wait_for_timeout(2200)
  page.screenshot(path=str(OUT/'shots/11-chartres-inside-start-390.png'))
  print('Fresh mobile start term:',page.locator('#term h3').inner_text(),flush=True)
  obs['layouts']['inside390']={'back':geometry(page,'.back'),'badge':geometry(page,'.badge-model'),'pins':geometry(page,'.pin'),'term':geometry(page,'#term'),'hint':geometry(page,'#hint'),'fresh_navigation':True}
  # Record status for the browser-native favicon request that Playwright response events omit.
  favicon=context.request.get(BASE+'favicon.ico')
  log['failed_requests'].append({'status':favicon.status,'url':favicon.url,'method':'GET','resource_type':'image','page_url':page.url,'time':time.time(),'source':'Read-only HTTP verification of favicon 404 already emitted by native browser console'})
  page.set_viewport_size({'width':1440,'height':900})
  page.goto(BASE+'?qa=svg#/b/great-wall-of-china/story',wait_until='networkidle');page.wait_for_selector('#pp');page.wait_for_timeout(400)
  if page.locator('#pp').inner_text()=='Pause':page.locator('#pp').click()
  page.locator('[data-k="3"]').click();page.wait_for_timeout(1600)
  page.screenshot(path=str(OUT/'shots/12-great-wall-story-svg-error-1440.png'));print('SVG evidence screenshot done',flush=True)
  obs['shots'].append('12-great-wall-story-svg-error-1440.png')
  obs['svg_error_paths']=page.locator('#plate path').evaluate_all('(ps)=>ps.map(p=>p.getAttribute("d")).filter(d=>d.startsWith("MM"))')
 except Exception:
  obs['errors'].append(traceback.format_exc());print(traceback.format_exc(),flush=True)
 finally:
  (OUT/'console.json').write_text(json.dumps(log,indent=2)+'\n');(OUT/'observations.json').write_text(json.dumps(obs,indent=2)+'\n')
  context.close();browser.close()
