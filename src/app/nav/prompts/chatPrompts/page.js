'use client';

import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../../../../lib/firebase';
import { collection, addDoc, query, where, orderBy, getDocs, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function ChatPromptsPage() {
  const [user, setUser] = useState(null);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        loadChatThreads(currentUser.uid);
      } else {
        // Guest mode - start with welcome message
        if (messages.length === 0) {
          setMessages([
            {
              role: 'assistant',
              content: "Hi! I'm your creative drawing assistant. Tell me what you'd like to draw, and I'll help you come up with inspiring prompts and ideas! 🎨\n\n⚠️ Guest Mode: Your conversation won't be saved. Sign in to save chat history!",
            },
          ]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Load chat threads from Firestore
  const loadChatThreads = async (userId) => {
    try {
      const chatsRef = collection(db, 'chatThreads');
      const q = query(
        chatsRef,
        where('userId', '==', userId),
        orderBy('updatedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const threads = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setChatThreads(threads);
    } catch (error) {
      console.error('Error loading chat threads:', error);
    }
  };

  // Create new chat
  const createNewChat = async () => {
    if (!user) {
      // Guest mode - just reset messages
      setMessages([
        {
          role: 'assistant',
          content: "Hi! I'm your creative drawing assistant. Tell me what you'd like to draw, and I'll help you come up with inspiring prompts and ideas! 🎨\n\n⚠️ Guest Mode: Your conversation won't be saved. Sign in to save chat history!",
        },
      ]);
      setCurrentChatId(null);
      return;
    }

    try {
      const newChat = {
        userId: user.uid,
        title: 'New Chat',
        messages: [
          {
            role: 'assistant',
            content: "Hi! I'm your creative drawing assistant. Tell me what you'd like to draw, and I'll help you come up with inspiring prompts and ideas! 🎨",
          },
        ],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'chatThreads'), newChat);
      setCurrentChatId(docRef.id);
      setMessages(newChat.messages);
      await loadChatThreads(user.uid);
    } catch (error) {
      console.error('Error creating new chat:', error);
      alert('Failed to create new chat');
    }
  };

  // Load existing chat
  const loadChat = (thread) => {
    setCurrentChatId(thread.id);
    setMessages(thread.messages || []);
  };

  // Delete chat
  const deleteChat = async (chatId, e) => {
    e.stopPropagation();
    if (!confirm('Delete this chat?')) return;

    try {
      await deleteDoc(doc(db, 'chatThreads', chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
      await loadChatThreads(user.uid);
    } catch (error) {
      console.error('Error deleting chat:', error);
      alert('Failed to delete chat');
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/prompts/chatPrompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          chatId: currentChatId,
          userId: user?.uid || 'guest',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedMessages = [
          ...newMessages,
          { role: 'assistant', content: data.message },
        ];
        setMessages(updatedMessages);

        // Only update Firestore if user is signed in
        if (user && currentChatId) {
          const chatRef = doc(db, 'chatThreads', currentChatId);
          const updates = {
            messages: updatedMessages,
            updatedAt: serverTimestamp(),
          };

          const userMessagesCount = updatedMessages.filter(msg => msg.role === 'user').length;
          
          if (userMessagesCount === 1 && data.title) {
            updates.title = data.title;
          }

          await updateDoc(chatRef, updates);
          await loadChatThreads(user.uid);
        } else if (user && !currentChatId) {
          // Signed in but no chat ID - create one retroactively
          const newChat = {
            userId: user.uid,
            title: data.title || 'New Chat',
            messages: updatedMessages,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          const docRef = await addDoc(collection(db, 'chatThreads'), newChat);
          setCurrentChatId(docRef.id);
          await loadChatThreads(user.uid);
        }
        // Guest mode: messages stay in memory only
      } else {
        alert(data.error || 'Failed to get response');
        setMessages(messages);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={createNewChat}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Chat History
          </h3>
          {!user ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 mb-3">
                💬 Currently in Guest Mode
              </p>
              <p className="text-xs text-gray-400 mb-4">
                Sign in to save your conversations
              </p>
              <a
                href="/"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Go to Home →
              </a>
            </div>
          ) : chatThreads.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No chats yet. Start a new one!
            </p>
          ) : (
            <div className="space-y-2">
              {chatThreads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => loadChat(thread)}
                  className={`p-3 rounded-lg cursor-pointer transition group relative ${
                    currentChatId === thread.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <p className="text-sm font-medium text-gray-900 truncate pr-6">
                    {thread.title || 'Untitled Chat'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {thread.messages?.length || 0} messages
                  </p>
                  <button
                    onClick={(e) => deleteChat(thread.id, e)}
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-md p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Chat Prompts</h1>
                <p className="text-sm text-gray-600">
                  AI-powered drawing inspiration
                  {!user && <span className="text-amber-600 ml-2">• Guest Mode</span>}
                </p>
              </div>
            </div>
            <a
              href="/nav/prompts"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
            >
              ← Back
            </a>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-900 shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-900 shadow-md rounded-2xl px-6 py-4">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-200 p-4">
          <form onSubmit={sendMessage} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask for drawing ideas..."
                disabled={isLoading}
                className="flex-1 px-6 py-4 border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500 disabled:bg-gray-100 text-lg text-gray-800"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
            {!user && (
              <p className="text-xs text-amber-600 mt-2 text-center">
                💡 Sign in to save your chat history permanently
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}