const CACHE='cc2-v9';
const ASSETS=[
  '/checklist-casa-china/',
  '/checklist-casa-china/index.html',
  '/checklist-casa-china/manifest.json',
  '/checklist-casa-china/icon-192.png',
  '/checklist-casa-china/icon-512.png'
];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  const isHTML=e.request.mode==='navigate'||url.pathname==='/checklist-casa-china/'||url.pathname.endsWith('/index.html');
  if(isHTML){
    e.respondWith(
      fetch(e.request).then(r=>{
        const cp=r.clone();
        caches.open(CACHE).then(c=>c.put(e.request,cp));
        return r;
      }).catch(()=>caches.match(e.request).then(m=>m||caches.match('/checklist-casa-china/')))
    );
  }else{
    e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).catch(()=>caches.match('/checklist-casa-china/'))));
  }
});
