function decorate(target) { }

@decorate
class Foo {}

export async function handler(event, context) {
  return {
    statusCode: 200,
    body: `decorated 🦕`
  };
}
