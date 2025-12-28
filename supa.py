import asyncio
from supabase import acreate_client

URL = 'https://ppecvcuzlisqhbpwvsqh.supabase.co'
KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZWN2Y3V6bGlzcWhicHd2c3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTM1OTEsImV4cCI6MjA3NzU2OTU5MX0.hi_MR7IdOhmV-JvUqXNIU3c7Fz-IFutjJcVvD7pIQfk'

async def create_supabase():
    supabase = await acreate_client(URL, KEY)
    return supabase

my_channel = create_supabase().channel('test-channel')

def on_subscribe(status, err):
    if status != RealtimeSubscribeStates.SUBSCRIBED:
        return

    asyncio.create_task(my_channel.send_broadcast(
        'shout',
        { "message": 'hello world' },
    ))

my_channel.subscribe(on_subscribe)


curl -v \
-H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZWN2Y3V6bGlzcWhicHd2c3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTM1OTEsImV4cCI6MjA3NzU2OTU5MX0.hi_MR7IdOhmV-JvUqXNIU3c7Fz-IFutjJcVvD7pIQfk' \
-H 'Content-Type: application/json' \
--data-raw '{
  "messages": [
    {
      "topic": "test-channel",
      "event": "event",
      "payload": { "test-channel": "test-channel" }
    }
  ]
}' \
'https://ppecvcuzlisqhbpwvsqh.supabase.co/realtime/v1/api/broadcast'


curl -X POST \
  'https://ppecvcuzlisqhbpwvsqh.supabase.co/realtime/v1/channel/test-channel/send' \
  -H 'apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwZWN2Y3V6bGlzcWhicHd2c3FoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5OTM1OTEsImV4cCI6MjA3NzU2OTU5MX0.hi_MR7IdOhmV-JvUqXNIU3c7Fz-IFutjJcVvD7pIQfk' \
  -H 'Content-Type: application/json' \
  -d '{"type": "broadcast", "payload": {"message": "Hello, World!"}}'
