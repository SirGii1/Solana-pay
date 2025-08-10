
import React, { useState, useEffect, useRef } from ‘react’;
import { Send, Phone, Search, Settings, Menu, Camera, Paperclip, Smile, MoreVertical, ArrowLeft, UserPlus, Check, CheckCheck, Clock, X, Plus } from ‘lucide-react’;

const SagygramApp = () => {
const [currentView, setCurrentView] = useState(‘auth’); // ‘auth’, ‘verification’, ‘contacts’, ‘chat’, ‘profile’
const [phoneNumber, setPhoneNumber] = useState(’’);
const [otp, setOtp] = useState(’’);
const [currentUser, setCurrentUser] = useState(null);
const [contacts, setContacts] = useState([]);
const [conversations, setConversations] = useState([]);
const [activeChat, setActiveChat] = useState(null);
const [messages, setMessages] = useState({});
const [newMessage, setNewMessage] = useState(’’);
const [isTyping, setIsTyping] = useState({});
const [searchQuery, setSearchQuery] = useState(’’);
const [showNewChatModal, setShowNewChatModal] = useState(false);
const messagesEndRef = useRef(null);
const fileInputRef = useRef(null);
const typingTimeoutRef = useRef(null);

// Mock data initialization
useEffect(() => {
// Mock contacts
const mockContacts = [
{ id: 1, name: ‘Alice Johnson’, phone: ‘+1234567890’, avatar: ‘👩‍💼’, lastSeen: ‘online’, isOnline: true },
{ id: 2, name: ‘Bob Smith’, phone: ‘+1234567891’, avatar: ‘👨‍💻’, lastSeen: ‘5 min ago’, isOnline: false },
{ id: 3, name: ‘Carol Davis’, phone: ‘+1234567892’, avatar: ‘👩‍🎨’, lastSeen: ‘1 hour ago’, isOnline: false },
{ id: 4, name: ‘David Wilson’, phone: ‘+1234567893’, avatar: ‘👨‍🔬’, lastSeen: ‘yesterday’, isOnline: false },
{ id: 5, name: ‘Emma Brown’, phone: ‘+1234567894’, avatar: ‘👩‍🏫’, lastSeen: ‘online’, isOnline: true },
{ id: 6, name: ‘Frank Miller’, phone: ‘+1234567895’, avatar: ‘👨‍🎨’, lastSeen: ‘2 hours ago’, isOnline: false },
{ id: 7, name: ‘Grace Chen’, phone: ‘+1234567896’, avatar: ‘👩‍💻’, lastSeen: ‘30 min ago’, isOnline: false }
];

```
// Mock conversations with messages
const mockConversations = [
  {
    id: 1,
    contactId: 1,
    name: 'Alice Johnson',
    avatar: '👩‍💼',
    lastMessage: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 300000), // 5 min ago
    unread: 2,
    isOnline: true
  },
  {
    id: 2,
    contactId: 2,
    name: 'Bob Smith',
    avatar: '👨‍💻',
    lastMessage: 'The project looks great!',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    unread: 0,
    isOnline: false
  },
  {
    id: 3,
    contactId: 3,
    name: 'Carol Davis',
    avatar: '👩‍🎨',
    lastMessage: 'Thanks for your help',
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    unread: 1,
    isOnline: false
  }
];

// Mock message history
const mockMessages = {
  1: [
    { id: 1, text: 'Hi Alice! How\'s the new job going?', sender: 'me', timestamp: new Date(Date.now() - 3600000), status: 'read' },
    { id: 2, text: 'Hey! It\'s going really well, thanks for asking! 😊', sender: 'contact', timestamp: new Date(Date.now() - 3540000), status: 'delivered' },
    { id: 3, text: 'The team is super friendly and the projects are interesting', sender: 'contact', timestamp: new Date(Date.now() - 3520000), status: 'delivered' },
    { id: 4, text: 'That\'s awesome! I\'m so happy for you', sender: 'me', timestamp: new Date(Date.now() - 3480000), status: 'read' },
    { id: 5, text: 'What kind of projects are you working on?', sender: 'me', timestamp: new Date(Date.now() - 3460000), status: 'read' },
    { id: 6, text: 'Mostly mobile app development and some web stuff', sender: 'contact', timestamp: new Date(Date.now() - 3420000), status: 'delivered' },
    { id: 7, text: 'Hey! How are you doing?', sender: 'contact', timestamp: new Date(Date.now() - 300000), status: 'delivered' },
    { id: 8, text: 'Pretty good, working on a new messaging app project', sender: 'me', timestamp: new Date(Date.now() - 240000), status: 'read' },
    { id: 9, text: 'That sounds exciting! What kind of features?', sender: 'contact', timestamp: new Date(Date.now() - 180000), status: 'delivered' }
  ],
  2: [
    { id: 10, text: 'Hey Bob, can you check the latest designs?', sender: 'me', timestamp: new Date(Date.now() - 7200000), status: 'read' },
    { id: 11, text: 'Sure! Just reviewed them', sender: 'contact', timestamp: new Date(Date.now() - 6600000), status: 'delivered' },
    { id: 12, text: 'The project looks great!', sender: 'contact', timestamp: new Date(Date.now() - 3600000), status: 'delivered' },
    { id: 13, text: 'Thanks Bob! Appreciate the feedback', sender: 'me', timestamp: new Date(Date.now() - 3300000), status: 'read' }
  ],
  3: [
    { id: 14, text: 'Hi Carol, could you help me with the color scheme?', sender: 'me', timestamp: new Date(Date.now() - 172800000), status: 'read' },
    { id: 15, text: 'Of course! I\'ll send you some options', sender: 'contact', timestamp: new Date(Date.now() - 172500000), status: 'delivered' },
    { id: 16, text: 'Thanks for your help', sender: 'contact', timestamp: new Date(Date.now() - 86400000), status: 'delivered' }
  ]
};

setContacts(mockContacts);
setConversations(mockConversations);
setMessages(mockMessages);
```

}, []);

const scrollToBottom = () => {
messagesEndRef.current?.scrollIntoView({ behavior: ‘smooth’ });
};

useEffect(() => {
scrollToBottom();
}, [messages, activeChat]);

const formatTime = (timestamp) => {
const now = new Date();
const time = new Date(timestamp);
const diffInHours = (now - time) / (1000 * 60 * 60);

```
if (diffInHours < 1) {
  return 'now';
} else if (diffInHours < 24) {
  return time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
} else if (diffInHours < 48) {
  return 'Yesterday';
} else {
  return time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
```

};

const handleAuth = () => {
if (phoneNumber.length >= 10) {
setCurrentView(‘verification’);
}
};

const handleVerification = () => {
if (otp === ‘123456’) {
setCurrentUser({ phone: phoneNumber, name: ‘You’, avatar: ‘👤’ });
setCurrentView(‘contacts’);
}
};

const handleSendMessage = () => {
if (!newMessage.trim() || !activeChat) return;

```
const messageId = Date.now();
const message = {
  id: messageId,
  text: newMessage,
  sender: 'me',
  timestamp: new Date(),
  status: 'sent'
};

setMessages(prev => ({
  ...prev,
  [activeChat.id]: [...(prev[activeChat.id] || []), message]
}));

// Update conversation last message
setConversations(prev => prev.map(conv => 
  conv.id === activeChat.id 
    ? { ...conv, lastMessage: newMessage, timestamp: new Date(), unread: 0 }
    : conv
));

setNewMessage('');

// Clear typing indicator for current user
setIsTyping(prev => ({ ...prev, [activeChat.id]: false }));

// Simulate message status updates
setTimeout(() => {
  setMessages(prev => ({
    ...prev,
    [activeChat.id]: prev[activeChat.id].map(msg => 
      msg.id === messageId ? { ...msg, status: 'delivered' } : msg
    )
  }));
}, 1000);

setTimeout(() => {
  setMessages(prev => ({
    ...prev,
    [activeChat.id]: prev[activeChat.id].map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' } : msg
    )
  }));
}, 3000);

// Simulate contact response (for demo purposes)
if (Math.random() > 0.7) {
  setTimeout(() => {
    const responses = [
      'That sounds interesting!',
      'Got it, thanks!',
      'I agree 👍',
      'Let me think about it',
      'Sounds good to me',
      'Perfect!'
    ];
    const responseText = responses[Math.floor(Math.random() * responses.length)];
    const responseMessage = {
      id: Date.now() + 1,
      text: responseText,
      sender: 'contact',
      timestamp: new Date(),
      status: 'delivered'
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), responseMessage]
    }));

    setConversations(prev => prev.map(conv => 
      conv.id === activeChat.id 
        ? { ...conv, lastMessage: responseText, timestamp: new Date(), unread: 1 }
        : conv
    ));
  }, 2000 + Math.random() * 3000);
}
```

};

const handleFileUpload = (event) => {
const file = event.target.files[0];
if (!file || !activeChat) return;

```
const messageId = Date.now();
let messageText = '';
let fileIcon = '📎';

if (file.type.startsWith('image/')) {
  fileIcon = '🖼️';
  messageText = `${fileIcon} Photo: ${file.name}`;
} else if (file.type.startsWith('video/')) {
  fileIcon = '🎥';
  messageText = `${fileIcon} Video: ${file.name}`;
} else {
  messageText = `${fileIcon} ${file.name}`;
}

const message = {
  id: messageId,
  text: messageText,
  sender: 'me',
  timestamp: new Date(),
  status: 'sent',
  file: {
    name: file.name,
    size: file.size,
    type: file.type
  }
};

setMessages(prev => ({
  ...prev,
  [activeChat.id]: [...(prev[activeChat.id] || []), message]
}));

setConversations(prev => prev.map(conv => 
  conv.id === activeChat.id 
    ? { ...conv, lastMessage: messageText, timestamp: new Date() }
    : conv
));

// Reset file input
if (fileInputRef.current) {
  fileInputRef.current.value = '';
}
```

};

const handleMessageInput = (e) => {
setNewMessage(e.target.value);

```
if (activeChat && e.target.value.trim()) {
  // Show typing indicator
  setIsTyping(prev => ({ ...prev, [activeChat.id]: true }));
  
  // Clear existing timeout
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  
  // Set new timeout to hide typing indicator
  typingTimeoutRef.current = setTimeout(() => {
    setIsTyping(prev => ({ ...prev, [activeChat.id]: false }));
  }, 2000);
} else {
  setIsTyping(prev => ({ ...prev, [activeChat.id]: false }));
}
```

};

const openChat = (conversation) => {
setActiveChat(conversation);
setCurrentView(‘chat’);
// Mark messages as read
setConversations(prev => prev.map(conv =>
conv.id === conversation.id ? { …conv, unread: 0 } : conv
));
};

const startNewChat = (contact) => {
// Check if conversation already exists
let existingConv = conversations.find(conv => conv.contactId === contact.id);

```
if (!existingConv) {
  // Create new conversation
  existingConv = {
    id: Date.now(),
    contactId: contact.id,
    name: contact.name,
    avatar: contact.avatar,
    lastMessage: '',
    timestamp: new Date(),
    unread: 0,
    isOnline: contact.isOnline
  };
  
  setConversations(prev => [existingConv, ...prev]);
  setMessages(prev => ({ ...prev, [existingConv.id]: [] }));
}

setShowNewChatModal(false);
openChat(existingConv);
```

};

const filteredContacts = contacts.filter(contact =>
contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
contact.phone.includes(searchQuery)
);

const filteredConversations = conversations.filter(conv =>
conv.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const renderMessageStatus = (status) => {
switch (status) {
case ‘sent’:
return <Clock className="w-4 h-4 text-gray-400" />;
case ‘delivered’:
return <Check className="w-4 h-4 text-gray-400" />;
case ‘read’:
return <CheckCheck className="w-4 h-4 text-blue-500" />;
default:
return null;
}
};

// Authentication View
if (currentView === ‘auth’) {
return (
<div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
<div className="flex-1 flex flex-col justify-center px-6">
<div className="text-center mb-8">
<div className="text-6xl mb-4">💬</div>
<h1 className="text-3xl font-bold text-blue-600 mb-2">Sagygram</h1>
<p className="text-gray-600">Fast, secure, reliable messaging</p>
</div>

```
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+1 234 567 8900"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleAuth}
          disabled={phoneNumber.length < 10}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
      
      <p className="text-sm text-gray-500 text-center mt-6">
        By continuing, you agree to receive SMS verification codes.
      </p>
    </div>
  </div>
);
```

}

// Verification View
if (currentView === ‘verification’) {
return (
<div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
<div className="flex-1 flex flex-col justify-center px-6">
<div className="text-center mb-8">
<div className="text-6xl mb-4">📱</div>
<h2 className="text-2xl font-bold text-gray-900 mb-2">Verify your number</h2>
<p className="text-gray-600">
We sent a code to <strong>{phoneNumber}</strong>
</p>
</div>

```
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-xl tracking-widest"
          />
        </div>
        <button
          onClick={handleVerification}
          disabled={otp.length !== 6}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Verify & Continue
        </button>
      </div>
      
      <p className="text-sm text-gray-500 text-center mt-6">
        Demo code: <strong>123456</strong>
      </p>
      
      <button
        onClick={() => setCurrentView('auth')}
        className="text-blue-600 text-sm mt-4 hover:underline"
      >
        ← Change number
      </button>
    </div>
  </div>
);
```

}

// Contacts/Conversations List View
if (currentView === ‘contacts’) {
return (
<div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
{/* Header */}
<div className="bg-blue-600 text-white p-4">
<div className="flex items-center justify-between mb-4">
<h1 className="text-xl font-semibold">Sagygram</h1>
<div className="flex items-center gap-2">
<button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
<Search className="w-5 h-5" />
</button>
<button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
<Settings className="w-5 h-5" />
</button>
</div>
</div>

```
      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages or contacts"
          className="w-full pl-10 pr-4 py-2 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>
    </div>

    {/* New Chat Button */}
    <div className="p-4 border-b">
      <button
        onClick={() => setShowNewChatModal(true)}
        className="flex items-center gap-3 text-blue-600 font-medium hover:bg-blue-50 p-2 rounded-lg transition-colors w-full"
      >
        <Plus className="w-5 h-5" />
        New Chat
      </button>
    </div>

    {/* Conversations List */}
    <div className="flex-1 overflow-y-auto">
      {filteredConversations.length > 0 ? (
        <div className="divide-y">
          {filteredConversations.map(conversation => (
            <div
              key={conversation.id}
              onClick={() => openChat(conversation)}
              className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                  {conversation.avatar}
                </div>
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-gray-900 truncate">{conversation.name}</h3>
                  <span className="text-xs text-gray-500 ml-2">{formatTime(conversation.timestamp)}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conversation.lastMessage}</p>
              </div>
              {conversation.unread > 0 && (
                <div className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {conversation.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <div className="text-4xl mb-2">💬</div>
          <p>No conversations yet</p>
          <p className="text-sm">Start a new chat to begin messaging</p>
        </div>
      )}
    </div>

    {/* New Chat Modal */}
    {showNewChatModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-sm w-full max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">New Chat</h3>
            <button
              onClick={() => setShowNewChatModal(false)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredContacts.map(contact => (
              <div
                key={contact.id}
                onClick={() => startNewChat(contact)}
                className="flex items-center p-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                    {contact.avatar}
                  </div>
                  {contact.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
                  )}
                </div>
                <div className="ml-3 flex-1">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-500">{contact.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);
```

}

// Chat View
if (currentView === ‘chat’ && activeChat) {
const chatMessages = messages[activeChat.id] || [];

```
return (
  <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
    {/* Chat Header */}
    <div className="bg-blue-600 text-white p-4 flex items-center gap-3">
      <button
        onClick={() => setCurrentView('contacts')}
        className="p-1 hover:bg-blue-700 rounded transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <div className="relative">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-lg">
          {activeChat.avatar}
        </div>
        {activeChat.isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border border-white rounded-full"></div>
        )}
      </div>
      <div className="flex-1">
        <h2 className="font-semibold">{activeChat.name}</h2>
        <p className="text-xs opacity-80">
          {activeChat.isOnline ? 'online' : 'last seen recently'}
        </p>
      </div>
      <button className="p-2 hover:bg-blue-700 rounded-full transition-colors">
        <MoreVertical className="w-5 h-5" />
      </button>
    </div>

    {/* Messages */}
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {chatMessages.map(message => (
        <div
          key={message.id}
          className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'me'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            <p className="text-sm">{message.text}</p>
            <div className="flex items-center justify-end gap-1 mt-1">
              <span className="text-xs opacity-70">
                {formatTime(message.timestamp)}
              </span>
              {message.sender === 'me' && (
                <div className="opacity-70">
                  {renderMessageStatus(message.status)}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Typing Indicator */}
      {isTyping[activeChat.id] && (
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>

    {/* Message Input */}
    <div className="p-4 border-t bg-white">
      <div className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Paperclip className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={newMessage}
            onChange={handleMessageInput}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);
```

}

return null;
};

export default SagygramApp;
