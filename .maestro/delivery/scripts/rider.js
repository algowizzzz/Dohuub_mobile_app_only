// Plays the rider side of a delivery against the staging API.
// Inputs (env): ACTION = respond | advance | expire-check, STATUS (for advance), AMOUNT (for respond counter).
var BASE = 'https://dohuub-progressive-web-app-backend-staging.up.railway.app/api/v1';

function login(email) {
  var r = http.post(BASE + '/auth/login', {
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: 'Password123!' }),
  });
  return json(r.body).data.session.accessToken;
}

function api(token, method, path, body) {
  var opts = { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token } };
  if (body) opts.body = JSON.stringify(body);
  var r = method === 'GET' ? http.get(BASE + path, opts) : http.post(BASE + path, opts);
  return json(r.body);
}

var customer = login('customer@dohuub.com');
var rider = login('rider@dohuub.com');
// First call: the newest still-open request is the one the flow just created
// (the staging account is shared, so never just take "the newest").
// Later calls reuse the id remembered in `output`.
var d;
if (output.deliveryId) {
  d = api(customer, 'GET', '/deliveries/' + output.deliveryId).data.delivery;
} else {
  var open = api(customer, 'GET', '/deliveries/mine?tab=action&limit=5').data.filter(function (x) {
    return x.status === 'open';
  });
  d = open[0];
  output.deliveryId = d.id;
  output.reference = d.reference;
}

if (ACTION === 'respond') {
  var kind = typeof KIND !== 'undefined' && KIND ? KIND : 'counter';
  var res = api(rider, 'POST', '/deliveries/' + d.id + '/respond', kind === 'counter' ? { kind: 'counter', amount: Number(AMOUNT || 10), etaMinutes: 6 } : { kind: kind, etaMinutes: 6 });
  output.result = res.success ? 'responded' : res.message;
} else if (ACTION === 'advance') {
  // Move the rider dot part of the way, then change status.
  var lat = d.pickup.lat + (d.dropoff.lat - d.pickup.lat) * (STATUS === 'picked_up' ? 0.05 : 0.5);
  var lng = d.pickup.lng + (d.dropoff.lng - d.pickup.lng) * (STATUS === 'picked_up' ? 0.05 : 0.5);
  api(rider, 'POST', '/riders/me/location', { lat: lat, lng: lng });
  var body = { status: STATUS };
  if (STATUS === 'delivered') body.recipientName = 'Jordan Ellis';
  var adv = api(rider, 'POST', '/deliveries/' + d.id + '/status', body);
  output.result = adv.success ? STATUS : adv.message;
}
console.log('rider script: ' + ACTION + ' ' + d.reference + ' -> ' + output.result);
