# Home Components Structure

This directory contains all the home page components organized by feature. Each feature has its own folder with a clear separation of concerns.

## Structure Overview

```
src/components/home/
├── index.tsx                           # Main export file for all features
├── chat-bubble/                        # Chat bubble feature
│   ├── index.tsx                      # Main chat bubble component
│   ├── components/                     # Sub-components
│   │   ├── chat-bubble.tsx            # Main chat bubble component
│   │   ├── video-message.tsx          # Video message component with proxy support
│   │   ├── image-message.tsx          # Image message component
│   │   ├── text-message.tsx           # Text message component
│   │   ├── image-dialog.tsx           # Image dialog component
│   │   ├── message-time.tsx           # Message timestamp component
│   │   ├── chat-bubble-avatar.tsx     # User avatar component
│   │   ├── chat-avatar-action.tsx     # Message actions component
│   │   └── date-indicator.tsx         # Date separator component
│   └── api/                           # API functions and utilities
│       └── message-utils.ts           # Message formatting and styling utilities
├── conversation/                       # Conversation list feature
│   ├── index.tsx                      # Exports conversation components
│   └── components/                     # Sub-components
│       └── conversation.tsx
├── left-panel/                        # Left panel feature
│   ├── index.tsx                      # Exports left panel component
│   └── components/                     # Sub-components
│       └── left-panel.tsx
├── right-panel/                       # Right panel feature
│   ├── index.tsx                      # Exports right panel component
│   └── components/                     # Sub-components
│       └── right-panel.tsx
├── message-container/                  # Message container feature
│   ├── index.tsx                      # Exports message container component
│   └── components/                     # Sub-components
│       └── message-container.tsx
├── user-list-dialog/                  # User list dialog feature
│   ├── index.tsx                      # Exports user list dialog component
│   └── components/                     # Sub-components
│       └── user-list-dialog.tsx
└── group-members-dialog/              # Group members dialog feature
    ├── index.tsx                      # Exports group members dialog component
    └── components/                     # Sub-components
        └── group-members-dialog.tsx
```

## Recent Improvements

### 🎨 **Chat Bubble Visual Redesign**

- **Modern Layout**: Full-width design with proper max-width constraints
- **Enhanced Typography**: Clear message headers with user names and AI indicators
- **Improved Spacing**: Better visual hierarchy and consistent spacing
- **Hover Effects**: Smooth transitions and interactive elements
- **Professional Styling**: Rounded corners, shadows, and modern borders

### 🎥 **Video Message Enhancement**

- **CORS Resolution**: Fixed video loading issues from Convex storage
- **Proxy Support**: Next.js API route for bypassing browser security restrictions
- **Automatic Fallback**: Seamless fallback from direct loading to proxy method
- **Better Error Handling**: Clear error messages and automatic retry logic
- **Improved UX**: Videos load on first attempt with proper error recovery

### 🏗️ **Component Architecture**

- **Feature-Based Organization**: Clear separation of concerns
- **API Separation**: Utility functions separated from UI components
- **Modular Design**: Easy to maintain and extend
- **Consistent Structure**: Uniform folder organization across features

## Feature Organization Principles

### 1. **Feature-Based Structure**

Each feature has its own folder containing all related components, API functions, and utilities.

### 2. **Component Separation**

- **`components/`**: Contains all UI components specific to the feature
- **`api/`**: Contains data fetching, mutations, and utility functions
- **`index.tsx`**: Main export file for the feature

### 3. **Clear Dependencies**

- Components import from their own feature's API folder
- Cross-feature dependencies are handled through the main index files
- Each feature is self-contained with minimal external dependencies

### 4. **Consistent Naming**

- All feature folders use kebab-case
- Component files use PascalCase
- API files use descriptive names (e.g., `message-utils.ts`)

## Usage Examples

### Importing a Feature

```tsx
import { ChatBubble } from "@/components/home";
import { Conversation } from "@/components/home";
import { MessageInput } from "@/components/home";
```

### Importing from a Specific Feature

```tsx
import ChatBubble from "@/components/home/chat-bubble";
import { VideoMessage } from "@/components/home/chat-bubble/components";
import { formatMessageTime } from "@/components/home/chat-bubble/api";
```

## Video Loading Architecture

### **Direct Loading First**

- Attempts to load video directly from Convex storage URL
- Provides best performance when CORS allows

### **Proxy Fallback**

- Next.js API route (`/api/video-proxy`) handles CORS restrictions
- Fetches video server-side and serves with proper headers
- Automatic fallback when direct loading fails

### **Error Recovery**

- Automatic retry mechanism
- Clear error messages for different failure types
- Seamless user experience without manual intervention

## Benefits of This Structure

1. **Maintainability**: Related code is grouped together
2. **Scalability**: Easy to add new features without affecting existing ones
3. **Reusability**: Components can be easily imported and reused
4. **Testing**: Each feature can be tested independently
5. **Code Splitting**: Features can be lazy-loaded if needed
6. **Team Collaboration**: Different developers can work on different features
7. **Performance**: Optimized video loading with fallback mechanisms
8. **User Experience**: Modern, responsive design with smooth interactions

## Migration Notes

- All existing imports have been updated to use the new structure
- The main `index.tsx` file provides backward compatibility
- Components are now more modular and easier to maintain
- API functions are separated from UI components for better testing
- Video loading issues have been resolved with proxy support
- Visual design has been significantly improved for better UX
