import fetch from 'node-fetch';

async function testChatApi() {
  console.log('--- TESTING API /api/chat ---');
  
  const payload = {
    messages: [
      {
        id: '1',
        role: 'user',
        parts: [{ type: 'text', text: 'Hello, are you there?' }]
      }
    ],
    projectId: "00000000-0000-0000-0000-000000000000"
  };

  try {
    const response = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    console.log('Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error Response:', errorText);
      return;
    }

    // Read the stream
    const reader = response.body;
    reader.on('data', chunk => {
      console.log('CHUNK:', chunk.toString());
    });

    reader.on('end', () => {
      console.log('--- STREAM ENDED ---');
    });

  } catch (error) {
    console.error('Fetch Error:', error.message);
  }
}

testChatApi();
