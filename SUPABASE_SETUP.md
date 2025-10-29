# Supabase Setup Instructions

## ✅ What's Been Fixed

1. **Authentication** - Fixed signup/login to use Supabase Auth directly
2. **Profile Management** - Stores user data in Supabase user_metadata
3. **Database Schema** - Created tables for prompts and collections
4. **CRUD Operations** - Implemented create/read/update/delete for prompts and collections

## 🗄️ Database Setup

### Step 1: Create Tables in Supabase

1. Go to your Supabase SQL Editor: https://supabase.com/dashboard/project/yylqckhrqyoxcbseitzq/sql/new
2. Copy the contents of `supabase-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute

This creates:
- `prompts` table - stores user prompts with RLS policies
- `collections` table - stores collections of prompts
- Row Level Security (RLS) - ensures users can only access their own data

### Step 2: Verify Tables

Go to: https://supabase.com/dashboard/project/yylqckhrqyoxcbseitzq/editor

You should see:
- ✅ `prompts` table
- ✅ `collections` table
- Both with proper indexes and RLS enabled

## 🔧 What Changed in the Code

### Files Added:
- `supabase-schema.sql` - Database schema
- `app/routes/api.prompts.ts` - API endpoints for prompt operations
- `app/routes/api.collections.ts` - API endpoints for collection operations

### Files Modified:
- `app/lib/mock.server.ts` - Added CRUD functions for prompts and collections
- `app/routes/api.auth.signup.ts` - Now uses Supabase Auth Admin API
- `app/routes/api.auth.profile.ts` - Uses Supabase Auth API for profiles
- `app/lib/auth.server.ts` - Reads user data from sessions
- `app/root.tsx` - Fixed ENV loading for client-side

## 🚀 Next Steps

### 1. Complete Database Setup
Run the SQL schema in your Supabase dashboard (see Step 1 above)

### 2. Update Frontend to Use API Routes
The Dashboard component needs to be updated to call the API routes instead of just updating local state. Currently it's using client-side state management.

You'll need to modify the Dashboard component to:
- Call `/api/prompts` when creating/updating/deleting prompts
- Call `/api/collections` when creating/updating/deleting collections
- Reload data from server after mutations

### Example Integration:

```typescript
// In Dashboard component
const handleSavePrompt = async (newPrompt: PromptDraft) => {
  try {
    const response = await fetch('/api/prompts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        intent: 'create',
        title: newPrompt.title,
        description: newPrompt.description,
        model: newPrompt.model,
        type: newPrompt.type,
        tags: JSON.stringify(newPrompt.tags),
        content: newPrompt.content,
      }),
    });
    
    if (response.ok) {
      const { prompt } = await response.json();
      setPrompts([prompt, ...prompts]);
      toast.success("Prompt saved successfully!");
    }
  } catch (error) {
    toast.error("Failed to save prompt");
  }
};
```

## 📊 Data Flow

### Current Flow (with mock data):
```
Dashboard → Mock Data (client-side only)
```

### New Flow (with Supabase):
```
Dashboard → API Routes → CRUD Functions → Supabase Database
```

## 🔒 Security

- Row Level Security (RLS) is enabled on both tables
- Users can only see and modify their own prompts/collections
- Public prompts can be viewed by authenticated users
- User ID is automatically set from the authenticated session

## 🧪 Testing

1. Run the SQL schema in Supabase
2. Restart your dev server
3. Create a new account
4. Try creating a prompt
5. Check your Supabase dashboard to see the data appear in the `prompts` table

