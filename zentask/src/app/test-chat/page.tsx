'use client'

import { useChat } from '@ai-sdk/react'

export default function TestChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    api: '/api/chat',
    maxSteps: 5,
    body: {
      projectId: "00000000-0000-0000-0000-000000000000"
    }
  })

  return (
    <div className="p-10 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">AI SDK v6 Test Page</h1>
      <div className="border rounded-lg p-4 h-96 overflow-auto bg-gray-50 space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-white border'}`}>
            <div className="font-bold text-xs uppercase opacity-50 mb-1">{m.role}</div>
            <div className="whitespace-pre-wrap">{m.content}</div>
            
            {/* Show RAW parts for debugging */}
            <div className="mt-2 text-[10px] font-mono text-gray-400 border-t pt-1">
              PARTS: {JSON.stringify(m.parts, null, 2)}
            </div>
          </div>
        ))}
        {status === 'streaming' && <div className="text-xs italic text-gray-400">AI is typing...</div>}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          value={input}
          onChange={handleInputChange}
          placeholder="Type something..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
      </form>
    </div>
  )
}
