#!/usr/bin/env python3
"""Read-only Nave browser evidence. Invoke under flock /tmp/chrome.lock."""
import json, time, traceback
from datetime import datetime, timezone
from pathlib import Path
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout

ROOT = Path(__file__).resolve().parent
SHOTS = ROOT / 'shots'
SHOTS.mkdir(exist_ok=True)
BASE = 'http://127.0.0.1:5817'
BUILDINGS = ['chartres', 'notre-dame-paris', 'cologne', 'amiens']
PINS = ['Nave', 'Pointed arch', 'Triforium', 'Clerestory', 'Rib vault', 'Rose window', 'Flying buttress']
report = {'started_at': datetime.now(timezone.utc).isoformat(), 'base_url': BASE, 'captures': [], 'checks': [], 'events': [], 'failures': []}

def check(name, passed, detail=None):
    report['checks'].append({'name': name, 'passed': bool(passed), 'detail': detail})
    print(('PASS ' if passed else 'FAIL ') + name, flush=True)

def save():
    (ROOT / 'browser-evidence.json').write_text(json.dumps(report, indent=2) + '\n')

def attach(page, mode):
    page.on('console', lambda m: report['events'].append({'type': 'console', 'level': m.type, 'text': m.text, 'url': page.url, 'mode': mode}) if m.type in ['error','warning'] else None)
    page.on('pageerror', lambda e: report['events'].append({'type': 'pageerror', 'text': str(e), 'url': page.url, 'mode': mode}))
    page.on('requestfailed', lambda r: report['events'].append({'type':'requestfailed','url':r.url,'failure':r.failure,'mode':mode}))
    page.on('response', lambda r: report['events'].append({'type':'http-error','status':r.status,'url':r.url,'mode':mode}) if r.status >= 400 else None)

def goto(page, path, wait=1800):
    page.goto(BASE + '/#' + path, wait_until='networkidle')
    page.wait_for_timeout(wait)
    page.locator('.screen').last.wait_for(state='visible')

def snapshot(page, name, mode, note='', scroll='top'):
    filename = name + '.png'
    page.screenshot(path=str(SHOTS / filename))
    dom = page.evaluate('''() => {
      const screen = [...document.querySelectorAll('.screen')].at(-1);
      const rect = e => { const r=e.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}; };
      const controls = [...screen.querySelectorAll('button,input,summary')].map(e => ({tag:e.tagName,text:e.innerText || e.getAttribute('aria-label') || e.placeholder,aria_label:e.getAttribute('aria-label'),disabled:e.disabled || false,hidden:e.classList.contains('hide'),opacity:getComputedStyle(e).opacity,rect:rect(e)}));
      const regions = [...screen.querySelectorAll('h1,h2,h3,.stage,.plate,.scene,.ctrl,.dots,.back,.closex,.term,.badge-model,.hint,.info,.photo,.sources')].map(e => ({selector:e.className || e.tagName,text:e.innerText.slice(0,140),rect:rect(e)}));
      return {screen:screen.className,viewport:{width:innerWidth,height:innerHeight},scroll:{top:screen.scrollTop,height:screen.scrollHeight,client_height:screen.clientHeight,width:screen.scrollWidth,client_width:screen.clientWidth},controls,regions,body_background:getComputedStyle(document.body).backgroundColor,heading_font:getComputedStyle(screen.querySelector('h1,h2,h3')||screen).fontFamily,heading:screen.querySelector('h1,h2,h3')?.innerText,term:screen.querySelector('#term')?.innerText,pins:[...screen.querySelectorAll('.pin')].map(e=>({text:e.innerText,hidden:e.classList.contains('hide'),rect:rect(e)})),canvas:!!screen.querySelector('canvas')};
    }''')
    report['captures'].append({'filename':'shots/' + filename,'url':page.url,'mode':mode,'note':note,'scroll_position':scroll,'dom':dom})
    save()
    print('CAPTURE ' + filename, flush=True)
    return dom

def bottom(page, name, mode):
    page.locator('.screen').last.evaluate('(e)=>e.scrollTop=e.scrollHeight')
    page.wait_for_timeout(80)
    return snapshot(page,name,mode,scroll='bottom')

def story_pair(page, building, prefix, mode, extra=False):
    goto(page, '/b/' + building)
    page.get_by_role('button',name='Its story',exact=True).click()
    page.wait_for_timeout(650)
    page.locator('#pp').click()
    page.wait_for_timeout(2600)
    check(prefix + ' story pauses', page.locator('#pp').inner_text() == 'Play')
    d=snapshot(page,prefix+'-story-01',mode)
    if extra and d['scroll']['height'] > d['scroll']['client_height']:
        bottom(page,prefix+'-story-01-bottom',mode)
    page.get_by_role('button',name='Scene 4',exact=True).click()
    page.wait_for_timeout(2600)
    snapshot(page,prefix+'-story-04',mode)
    if extra:
        bottom(page,prefix+'-story-04-bottom',mode)
    page.get_by_role('button',name='Previous scene',exact=True).click()
    page.wait_for_timeout(100)
    expected=json.loads((Path('/home/ubuntu/AI-round/analysis/p7-idea/app/public/data/buildings.json')).read_text())
    b=next(b for b in expected['buildings'] if b['id']==building)
    check(prefix+' previous scene',page.locator('.scene h2').inner_text()==b['scenes'][2]['title'])
    page.get_by_role('button',name='Next scene',exact=True).click()
    check(prefix+' next scene',page.locator('.scene h2').inner_text()==b['scenes'][3]['title'])
    page.get_by_role('button',name='Close story',exact=True).click()
    page.wait_for_timeout(350)
    check(prefix+' close returns result', page.url.endswith('/b/'+building))

def capture_inside(page, prefix, mode, reduced=False):
    goto(page,'/b/chartres')
    page.get_by_role('button',name='Step inside',exact=True).click()
    try:
        page.locator('.inside[data-ready="1"]').wait_for(timeout=15000)
    except PlaywrightTimeout:
        snapshot(page,prefix+'-inside-unavailable',mode)
        check(prefix+' inside WebGL ready',False,page.locator('#gl').inner_text())
        return
    page.wait_for_timeout(750)
    check(prefix+' inside WebGL ready',True)
    initial=snapshot(page,prefix+'-inside-start',mode)
    check(prefix+' seven pin buttons',len(initial['pins'])==7)
    for idx, term in enumerate(PINS):
        pin=page.get_by_role('button',name=term,exact=True)
        note='Real pointer click.'
        try:
            pin.click(timeout=1400)
            reachable=True
        except PlaywrightTimeout as error:
            reachable=False
            note='Diagnostic DOM click only: real pointer click failed/hidden/occluded; this is NOT evidence of user reachability.'
            report['events'].append({'type':'pin-pointer-failure','mode':mode,'pin':term,'url':page.url,'text':str(error)[-1400:]})
            pin.evaluate('(e)=>e.click()')
        check(prefix+' pointer reaches '+term,reachable)
        page.wait_for_timeout(100 if reduced else 1900)
        check(prefix+' shows definition '+term,page.locator('#term h3').inner_text()==term)
        snapshot(page,prefix+'-inside-'+str(idx+1).zfill(2)+'-'+term.lower().replace(' ','-'),mode,note)
    page.locator('.back').click()
    page.wait_for_timeout(400)
    check(prefix+' inside back returns result',page.url.endswith('/b/chartres'))

try:
    with sync_playwright() as pw:
        browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for width,height in [(1440,1000),(390,844),(820,1180)]:
            mode=f'{width}-light-motion'
            context=browser.new_context(viewport={'width':width,'height':height},color_scheme='light',reduced_motion='no-preference',device_scale_factor=1)
            page=context.new_page(); attach(page,mode)
            goto(page,'/')
            snapshot(page,mode+'-home',mode)
            page.get_by_role('button',name='Show me one',exact=True).click()
            page.wait_for_timeout(400)
            check(mode+' random enters verified result','/b/' in page.url)
            for building in BUILDINGS:
                goto(page,'/b/'+building)
                dom=snapshot(page,mode+'-result-'+building,mode)
                check(mode+' '+building+' photo loaded',page.locator('.photo img').evaluate('(e)=>e.complete && e.naturalWidth>0'))
                if width!=1440:
                    bottom(page,mode+'-result-'+building+'-bottom',mode)
            for building in (BUILDINGS if width==1440 else ['chartres']):
                story_pair(page,building,mode+'-'+building,mode,extra=width!=1440)
            capture_inside(page,mode,mode)
            goto(page,'/')
            page.locator('#q').fill('ab'); page.locator('#q').press('Enter')
            check(mode+' short-name guard','at least three' in page.locator('#msg').inner_text())
            page.locator('#q').fill('Hogwarts Castle'); page.locator('#q').press('Enter')
            check(mode+' unknown-name guard',"can't confirm" in page.locator('#msg').inner_text())
            if width==390: snapshot(page,mode+'-unknown-name',mode)
            page.locator('#q').fill('Chartres'); page.locator('#q').press('Enter'); page.wait_for_timeout(350)
            check(mode+' typed name resolves',page.url.endswith('/b/chartres'))
            page.locator('#again').click(); page.wait_for_timeout(350)
            check(mode+' Another does not repeat',not page.url.endswith('/b/chartres'))
            context.close()
        for width,height in [(390,844),(1440,1000)]:
            mode=f'{width}-dark-reduced'
            context=browser.new_context(viewport={'width':width,'height':height},color_scheme='dark',reduced_motion='reduce',device_scale_factor=1)
            page=context.new_page(); attach(page,mode)
            goto(page,'/',100)
            snapshot(page,mode+'-home',mode)
            goto(page,'/b/chartres',100)
            snapshot(page,mode+'-result-chartres',mode)
            story_pair(page,'chartres',mode+'-chartres',mode,extra=width==390)
            capture_inside(page,mode,mode,reduced=True)
            context.close()
        browser.close()
except Exception as error:
    report['failures'].append({'type':type(error).__name__,'text':str(error),'traceback':traceback.format_exc()})
    print(traceback.format_exc(),flush=True)
finally:
    report['finished_at']=datetime.now(timezone.utc).isoformat()
    report['elapsed_seconds']=round(time.time()-datetime.fromisoformat(report['started_at']).timestamp(),2)
    save()
