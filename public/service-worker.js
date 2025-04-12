self.addEventListener("push", function (event) {
  const data = event.data.json();
  const { title, body } = data.notification;

  event.waitUntil(
    self.registration.showNotification(title, {
      body: body,
    }),
  );
});
