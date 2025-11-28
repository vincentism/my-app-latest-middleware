// File path ./edge-functions/api/hello.js
// Access path example.com/api/hello
export default function onRequest(context) {
  return new Response('Hello from Edge Functions!');
}