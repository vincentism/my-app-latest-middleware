export async function GET(request) {

  console.log('env', process.env)
  return new Response('Hello, World from api/test/route.js');
}