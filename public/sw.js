// Service worker: shows push notifications and opens the agenda on tap.
self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { body: event.data ? event.data.text() : "" };
  }
  const title = data.title || "Novo agendamento";
  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || "",
      icon: "/apple-touch-icon.png",
      data: { url: data.url || "/agendamentos" },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/agendamentos";
  event.waitUntil(clients.openWindow(url));
});