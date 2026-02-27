def handler(request):
    return {
        'statusCode': 200,
        'body': 'Hello from Python!',
        'headers': {
            'Content-Type': 'text/plain'
        }
    }
