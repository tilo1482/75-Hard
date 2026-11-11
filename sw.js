self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data.json(); } catch (_) { d = { title: 'Bulk', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Bulk', {
    body: d.body || '', icon: 'apple-touch-icon.png', badge: 'apple-touch-icon.png',
    tag: d.tag || 'bulk', data: { go: d.go || 'today' }
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const go = (e.notification.data && e.notification.data.go) || 'today';
  e.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const c of list) { if ('focus' in c) { c.postMessage({ go }); return c.focus(); } }
    return clients.openWindow('./#' + go);
  }));
});
