import json, time, traceback
from pathlib import Path
from playwright.sync_api import sync_playwright

OUT = Path('/home/ubuntu/AI-round/analysis/p7-qa/v2238')
BASE = 'http://127.0.0.1:5817/'
log = {'console': [], 'page_errors': [], 'failed_requests': [], 'request_failures': []}
obs = {'controls': [], 'shots': [], 'layouts': {}, 'errors': []}

def snap(page, name):
    page.screenshot(path=str(OUT/'shots'/name))
    obs['shots'].append(name)
    print('SHOT', name, flush=True)

def control(name, result, **extra):
    obs['controls'].append({'control': name, 'result': result, **extra})
    print('CONTROL', name, result, extra, flush=True)

def rects(page, selector):
    return page.locator(selector).evaluate_all('''nodes => nodes.map(n => {
      const r=n.getBoundingClientRect(), s=getComputedStyle(n);
      const range=document.createRange();range.selectNodeContents(n);const t=range.getBoundingClientRect();
      const x=r.x+r.width/2,y=r.y+r.height/2, hit=document.elementFromPoint(x,y);
      return {text:n.textContent.trim(),x:r.x,y:r.y,width:r.width,height:r.height,opacity:s.opacity,
        hidden:n.classList.contains('hide'),textRect:{x:t.x,y:t.y,width:t.width,height:t.height},
        centerHit:hit?.tagName,centerHitText:hit?.textContent?.trim().slice(0,120),
        centerUncovered:hit===n||n.contains(hit),
        inViewport:r.x>=0&&r.y>=0&&r.right<=innerWidth&&r.bottom<=innerHeight};
    })''')

def state(page):
    return page.evaluate('''() => {const buttons=[...document.querySelectorAll('#dots button')];
      const k=buttons.filter(b=>b.classList.contains('done')).length;
      const bar=buttons[k]?.querySelector('b');
      return {index:k,title:document.querySelector('#scene h2')?.textContent,
        progress:bar?new DOMMatrixReadOnly(getComputedStyle(bar).transform).a:null,
        pp:document.querySelector('#pp')?.textContent};}''')

def route(page, path, selector):
    page.goto(BASE+'#'+path, wait_until='networkidle')
    page.wait_for_selector(selector, timeout=20000)
    page.wait_for_timeout(1100)

with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium', args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':1440,'height':900}, color_scheme='light', device_scale_factor=1)
    page=context.new_page()
    page.on('console', lambda m: log['console'].append({'type':m.type,'text':m.text,'location':m.location,'page_url':page.url,'time':time.time()}) if m.type in ('warning','error') else None)
    page.on('pageerror', lambda e: log['page_errors'].append({'text':str(e),'page_url':page.url,'time':time.time()}))
    page.on('response', lambda r: log['failed_requests'].append({'status':r.status,'url':r.url,'method':r.request.method,'resource_type':r.request.resource_type,'page_url':page.url,'time':time.time()}) if r.status>=400 else None)
    page.on('requestfailed', lambda r: log['request_failures'].append({'url':r.url,'method':r.method,'failure':r.failure,'resource_type':r.resource_type,'page_url':page.url,'time':time.time()}))
    try:
        route(page,'/','.home')
        snap(page,'01-home-1440.png')
        obs['layouts']['home1440']={'viewport':[1440,900], 'document_width':page.evaluate('document.documentElement.scrollWidth')}
        page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(700)
        snap(page,'02-home-390.png')
        obs['layouts']['home390']={'screen':rects(page,'.home'),'h1':rects(page,'.home h1')}
        page.set_viewport_size({'width':1440,'height':900})
        page.locator('#q').fill('Great Wall of China');page.locator('#q').press('Enter')
        page.wait_for_selector('.result h2',timeout=20000);page.wait_for_timeout(1500)
        control('Open Great Wall from home', 'PASS' if page.url.endswith('#/b/great-wall-of-china') else 'FAIL', url=page.url)
        snap(page,'03-great-wall-result-1440.png')
        page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(600)
        snap(page,'04-great-wall-result-390.png')
        obs['layouts']['result390']={'actions':rects(page,'.actions'),'info':rects(page,'.info'),'screen_scroll':page.locator('.result').evaluate('(e)=>({client:e.clientHeight,scroll:e.scrollHeight})')}
        # Confirm mobile result's actions are reachable by scrolling, then return desktop.
        page.locator('[data-go="/b/great-wall-of-china/story"]').scroll_into_view_if_needed()
        obs['layouts']['result390']['story_action_reachable']=rects(page,'[data-go="/b/great-wall-of-china/story"]')
        page.set_viewport_size({'width':1440,'height':900});page.locator('.result').evaluate('(e)=>e.scrollTop=0')
        page.locator('[data-go="/b/great-wall-of-china/story"]').click()
        page.wait_for_selector('.story #scene h2');page.wait_for_timeout(500)
        control('Open story','PASS' if page.locator('.story').count()==1 else 'FAIL', initial_state=state(page))
        if page.locator('#pp').inner_text()=='Pause':page.locator('#pp').click()
        page.wait_for_timeout(1100)
        page.locator('[data-k="0"]').click();page.wait_for_timeout(800)
        snap(page,'05-great-wall-story-scene1-1440.png')
        obs['layouts']['story1440']={'dots':rects(page,'#dots button'),'controls':rects(page,'.ctrl button')}
        before=state(page);page.locator('#pp').click();page.wait_for_timeout(2000);after=state(page)
        snap(page,'06-great-wall-story-playing-1440.png')
        control('Play','PASS' if after['pp']=='Pause' and (after['index']!=before['index'] or after['progress']>before['progress']+.05) else 'FAIL',before=before,after=after)
        page.locator('#pp').click();a=state(page);page.wait_for_timeout(2000);b=state(page)
        control('Pause (2 seconds)','PASS' if a['index']==b['index'] and abs(a['progress']-b['progress'])<.001 and b['pp']=='Play' else 'FAIL',before=a,after=b)
        page.locator('#next').click();page.wait_for_timeout(1000);n=state(page)
        control('Next','PASS' if n['index']==a['index']+1 and n['title']!=a['title'] else 'FAIL',after=n)
        snap(page,'07-great-wall-story-scene2-1440.png')
        page.locator('#prev').click();page.wait_for_timeout(1000);back=state(page)
        control('Back (previous scene)','PASS' if back['index']==a['index'] and back['title']==a['title'] else 'FAIL',after=back)
        page.locator('#closex').click();page.wait_for_selector('.result');page.wait_for_timeout(700)
        control('Close','PASS' if page.locator('.story').count()==0 and page.url.endswith('#/b/great-wall-of-china') else 'FAIL',url=page.url)
        # Mobile story capture, paused on the first scene.
        page.set_viewport_size({'width':390,'height':844})
        page.locator('[data-go="/b/great-wall-of-china/story"]').click();page.wait_for_selector('.story #pp');page.wait_for_timeout(500)
        if page.locator('#pp').inner_text()=='Pause':page.locator('#pp').click()
        page.wait_for_timeout(1100)
        snap(page,'08-great-wall-story-scene1-390.png')
        obs['layouts']['story390']={'stage':rects(page,'.stage'),'scene':rects(page,'#scene'),'caption':rects(page,'#scene p'),'pair':rects(page,'.pair'),'tag':rects(page,'.plate .tag'),'controls':rects(page,'.ctrl button'),'dots':rects(page,'#dots button'),'scroll':page.locator('.story').evaluate('(e)=>({client:e.clientHeight,scroll:e.scrollHeight,scrollWidth:e.scrollWidth})')}
        # Visit every Great Wall scene to exercise its SVG plates, not only scene one.
        for k in range(page.locator('#dots button').count()):
            page.locator(f'[data-k="{k}"]').click();page.wait_for_timeout(200)
        # Also exercise all curated Chartres story plates for the old duplicated-M error.
        page.set_viewport_size({'width':1440,'height':900})
        route(page,'/b/chartres/story','.story #pp')
        if page.locator('#pp').inner_text()=='Pause':page.locator('#pp').click()
        for k in range(page.locator('#dots button').count()):
            page.locator(f'[data-k="{k}"]').click();page.wait_for_timeout(200)
        obs['svg_recheck']={'great_wall_scenes':6,'chartres_scenes':page.locator('#dots button').count()}
        route(page,'/b/chartres/inside','.inside[data-ready="1"]')
        page.wait_for_timeout(2200)
        snap(page,'09-chartres-inside-start-1440.png')
        obs['layouts']['inside1440']={'back':rects(page,'.inside .back'),'badge':rects(page,'.badge-model'),'pins':rects(page,'.pin'),'term':rects(page,'#term'),'hint':rects(page,'#hint')}
        # Pick a visible pin with an uncovered center, preferring Pointed arch.
        pins=obs['layouts']['inside1440']['pins']
        eligible=[x for x in pins if not x['hidden'] and x['centerUncovered'] and x['inViewport']]
        chosen=next((x for x in eligible if x['text']=='Pointed arch'),eligible[0] if eligible else None)
        if chosen:
            page.get_by_role('button',name=chosen['text'],exact=True).click();page.wait_for_timeout(2200)
            snap(page,'10-chartres-inside-pin-1440.png')
            obs['layouts']['inside_pin1440']={'chosen':chosen['text'],'pins':rects(page,'.pin'),'term':rects(page,'#term')}
            control('Inside pin open','PASS' if page.locator('#term h3').inner_text()==chosen['text'] else 'FAIL',chosen=chosen['text'],term=page.locator('#term h3').inner_text())
        else:control('Inside pin open','FAIL',reason='No visible, uncovered pin')
        page.set_viewport_size({'width':390,'height':844})
        route(page,'/b/chartres/inside','.inside[data-ready="1"]');page.wait_for_timeout(2200)
        snap(page,'11-chartres-inside-start-390.png')
        obs['layouts']['inside390']={'back':rects(page,'.inside .back'),'badge':rects(page,'.badge-model'),'pins':rects(page,'.pin'),'term':rects(page,'#term'),'hint':rects(page,'#hint')}
        print('Completed required capture run',flush=True)
    except Exception:
        obs['errors'].append(traceback.format_exc());print(traceback.format_exc(),flush=True)
    finally:
        (OUT/'console.json').write_text(json.dumps(log,indent=2)+'\n')
        (OUT/'observations.json').write_text(json.dumps(obs,indent=2)+'\n')
        context.close();browser.close()
