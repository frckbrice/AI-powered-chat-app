# AI-Integrated WhatsApp Clone

A modern, feature-rich WhatsApp-like chat application built with Next.js, featuring AI chat integration, real-time messaging, and a beautiful, responsive UI.

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 15** (App Router) + React 19
- **TypeScript** for type safety
- **Tailwind CSS 3** for styling
- **Radix UI** for accessible components
- **Lucide React** for beautiful icons

### **Backend & Database**

- **Convex** for real-time backend and database
- **Real-time Queries** for live updates
- **File Storage** for media uploads
- **User Authentication** with Clerk integration

### **Development Tools**

- **Yarn** package manager
- **Vitest + Testing Library** for testing
- **ESLint** for code quality
- **Docker** for containerization

## 🏗️ Architecture

### **System Overview**

This project follows a modern, scalable architecture with clear separation of concerns, real-time capabilities, and AI integration.

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Convex)      │◄──►│   Services      │
│                 │    │                 │    │                 │
│ • React 19      │    │ • Real-time DB  │    │ • Clerk Auth    │
│ • TypeScript    │    │ • File Storage  │    │ • OpenAI API    │
│ • Tailwind CSS  │    │ • Webhooks      │    │ • WebRTC       │
│ • PWA Support   │    │ • HTTP Routes   │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Frontend Architecture**

#### **Next.js App Router Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   └── video-proxy/         # Video CORS proxy
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── sign-in/                 # Authentication pages
├── components/                   # Reusable UI components
│   ├── home/                    # Main chat components
│   ├── providers/               # Context providers
│   │   ├── convex/              # Convex client provider
│   │   └── theme/               # Theme provider
│   ├── ui/                      # Base UI components
│   └── types.ts                 # TypeScript definitions
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions
├── store/                       # State management
└── test/                        # Test configuration
```

#### **Component Architecture**

```
src/components/home/
├── chat-bubble/                 # Chat message system
│   ├── components/              # Message components
│   │   ├── chat-bubble.tsx     # Main message component
│   │   ├── video-message.tsx   # Video handling with proxy
│   │   ├── image-message.tsx   # Image display
│   │   ├── text-message.tsx    # Text messages
│   │   ├── message-time.tsx    # Timestamps
│   │   ├── chat-avatar-action.tsx # Message actions
│   │   └── date-indicator.tsx  # Date separators
│   ├── api/                    # Message utilities
│   │   └── message-utils.ts    # Formatting & styling
│   └── index.tsx               # Feature exports
├── conversation/                # Conversation management
├── message-input/               # Message composition
├── media-dropdown/              # File upload system
├── left-panel/                  # Navigation sidebar
├── right-panel/                 # Chat interface
├── message-container/            # Message display area
├── user-list-dialog/            # User management
├── group-members-dialog/        # Group administration
└── index.tsx                    # Main exports
```

### **Backend Architecture (Convex)**

#### **Database Schema**

```typescript
// Core entities
users: {
  _id: Id<"users">
  tokenIdentifier: string
  name: string
  email: string
  image: string
  isOnline: boolean
  lastSeen: number
}

conversations: {
  _id: Id<"conversations">
  name: string
  participants: Id<"users">[]
  isGroup: boolean
  admin?: Id<"users">
  lastMessage?: Id<"messages">
  createdAt: number
}

messages: {
  _id: Id<"messages">
  conversationId: Id<"conversations">
  sender: Id<"users">
  content: string
  messageType: "text" | "image" | "video"
  _creationTime: number
}
```

#### **Real-time Features**

- **Live Queries**: Automatic UI updates when data changes
- **Mutations**: Server-side data modifications with validation
- **Actions**: Complex operations with external API calls
- **Webhooks**: Integration with Clerk authentication
- **File Storage**: Secure media file handling

#### **HTTP Routes**

```
convex/http.ts
├── /clerk                      # Clerk webhook handler
│   ├── user.created           # User registration
│   ├── user.updated           # Profile updates
│   ├── session.created        # User login
│   └── session.ended          # User logout
└── /video-proxy               # Video CORS proxy (removed)
```

### **State Management**

#### **Client-Side State**

```typescript
// Chat Store (Zustand)
useConversationStore: {
  selectedConversation: Conversation | null
  setSelectedConversation: (conv: Conversation) => void
  // ... other state and actions
}

// Theme Store
useThemeStore: {
  theme: "light" | "dark" | "system"
  setTheme: (theme: Theme) => void
}
```

#### **Server-Side State**

- **Convex Queries**: Real-time data subscriptions
- **Optimistic Updates**: Immediate UI feedback
- **Conflict Resolution**: Automatic merge strategies
- **Offline Support**: Local-first architecture

### **Data Flow Architecture**

#### **Message Flow**

```
User Input → Message Input → Convex Mutation → Database Update →
Real-time Query → UI Update → Other Users Receive
```

#### **Media Flow**

```
File Upload → Convex Storage → Generate URL → Store Reference →
Message Creation → Real-time Delivery → Proxy Loading (if needed)
```

#### **AI Integration Flow**

```
User Message → AI Processing → OpenAI API → Response Generation →
Message Creation → Real-time Delivery → Context Preservation
```

### **Security Architecture**

#### **Authentication & Authorization**

- **Clerk Integration**: Secure user authentication
- **JWT Tokens**: Stateless authentication
- **Role-based Access**: User permissions and admin controls
- **Session Management**: Secure session handling

#### **Data Security**

- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Parameterized queries
- **XSS Prevention**: Content sanitization
- **CORS Management**: Controlled cross-origin access

### **Performance Architecture**

#### **Frontend Optimization**

- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Webpack bundle optimization
- **PWA Support**: Offline capabilities

#### **Backend Optimization**

- **Real-time Queries**: Efficient data subscriptions
- **Indexing**: Optimized database queries
- **Caching**: Strategic data caching
- **CDN Integration**: Global content delivery

### **Scalability Considerations**

#### **Horizontal Scaling**

- **Stateless Design**: Easy horizontal scaling
- **Database Sharding**: Partitioned data storage
- **Load Balancing**: Distributed request handling
- **Microservices Ready**: Modular architecture

#### **Vertical Scaling**

- **Resource Optimization**: Efficient resource usage
- **Memory Management**: Optimized memory allocation
- **CPU Optimization**: Efficient processing algorithms
- **Storage Optimization**: Compressed data storage

### **Development Architecture**

#### **Code Organization**

- **Feature-based Structure**: Logical component grouping
- **API Separation**: Clear separation of concerns
- **Type Safety**: Full TypeScript coverage
- **Testing Strategy**: Comprehensive test coverage

#### **Build & Deployment**

- **Multi-stage Docker**: Optimized container builds
- **CI/CD Pipeline**: Automated testing and deployment
- **Environment Management**: Configurable deployments
- **Monitoring & Logging**: Production observability

### **Integration Points**

#### **External Services**

- **Clerk**: Authentication and user management
- **OpenAI**: AI chat capabilities
- **Convex**: Backend-as-a-Service
- **Vercel**: Hosting and deployment (optional)

#### **API Design**

- **RESTful Endpoints**: Standard HTTP methods
- **GraphQL Ready**: Query-based data fetching
- **WebSocket Support**: Real-time communication
- **Webhook Integration**: Event-driven architecture

## 🚀 Getting Started

### **Prerequisites**

- Node.js 18+
- Yarn package manager
- Convex account (for backend)
- Clerk account (for authentication)

### **Installation**

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd whatsapp-clone
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Fill in your Convex and Clerk credentials
   ```

4. **Start development server**

   ```bash
   yarn dev
   ```

5. **Visit** `http://localhost:3000`

## 📱 Usage

### **Starting a Chat**

1. Click on a user or group from the left panel
2. Type your message in the input field
3. Send text, images, or videos
4. Use AI chat by selecting ChatGPT from the conversation list

### **AI Features**

- **Chat with AI**: Start conversations with ChatGPT
- **Smart Responses**: Get intelligent, context-aware replies
- **Media Understanding**: AI can process and respond to images/videos
- **Conversation Memory**: AI remembers conversation context

### **Group Management**

- **Create Groups**: Start group conversations
- **Add Members**: Invite users to groups
- **Admin Controls**: Manage group settings and members
- **Group Chat**: Collaborate with multiple users

## 🧪 Testing

Run the test suite:

```bash
# Run tests once
yarn test

# Run tests in watch mode
yarn test:watch

# Run tests with coverage
yarn test:coverage
```

## 🚀 Deployment

### **Production Build**

```bash
yarn build
yarn start
```

### **Docker Deployment**

```bash
docker build -t whatsapp-clone .
docker run -p 3000:3000 whatsapp-clone
```

### **Environment Variables**

```bash
# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_url

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# AI Integration
OPENAI_API_KEY=your_openai_key
```

## 🔧 Development

### **Available Scripts**

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn test` - Run unit tests
- `yarn ci` - Full CI pipeline (lint, test, build)

### **Code Quality**

- **ESLint**: Code linting and formatting
- **TypeScript**: Static type checking
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **CodeRabbit**: AI-powered code review and suggestions
  - **Automatic PR Reviews**: AI analyzes code for performance, errors, and maintainability
  - **Code Quality Insights**: Identifies potential issues and suggests improvements
  - **Test Coverage Analysis**: Ensures comprehensive testing coverage
  - **Performance Optimization**: Suggests performance improvements
  - **Security Scanning**: Detects potential security vulnerabilities

## 🌟 Key Features

### **Real-time Communication**

- Instant message delivery
- Live typing indicators
- Real-time user presence
- Live conversation updates

### **AI-Powered Chat**

- ChatGPT integration
- Intelligent responses
- Context awareness
- Multi-modal understanding

### **Modern UI/UX**

- Responsive design
- Dark/light themes
- Smooth animations
- Professional styling

### **Performance & Reliability**

- Optimized video loading
- CORS proxy support
- Offline capabilities
- Progressive Web App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the component README files

---

**Built with ❤️ using Next.js, React, and modern web technologies**
