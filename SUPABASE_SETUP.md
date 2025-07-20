# Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `portfolio-comments` (or any name you prefer)
   - Database Password: Create a strong password
   - Region: Choose closest to your users
6. Click "Create new project"

## Step 2: Get Project Credentials

1. Go to your project dashboard
2. Click on "Settings" in the sidebar
3. Click on "API" 
4. Copy the following:
   - Project URL
   - Project API Key (anon/public key)

## Step 3: Update Configuration

1. Open `src/supabase.js`
2. Replace `YOUR_SUPABASE_URL` with your Project URL
3. Replace `YOUR_SUPABASE_ANON_KEY` with your API Key

```javascript
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key-here'
```

## Step 4: Create Database Table

1. Go to your Supabase dashboard
2. Click on "Table Editor" in the sidebar
3. Click "Create a new table"
4. Table name: `portfolio_comments`
5. Add the following columns:

| Column Name    | Type      | Default Value | Extra Settings |
|---------------|-----------|---------------|----------------|
| id            | int8      | -             | Primary Key, Auto-increment |
| content       | text      | -             | Required |
| user_name     | text      | -             | Required |
| profile_image | text      | -             | Optional |
| created_at    | timestamptz | now()       | Required |

6. Click "Save"

## Step 5: Set Up Storage (for profile images)

1. Go to "Storage" in the sidebar
2. Click "Create a new bucket"
3. Bucket name: `portfolio-images`
4. Make it public: Toggle "Public bucket" to ON
5. Click "Save"

## Step 6: Set Up Row Level Security (RLS)

1. Go to "Authentication" > "Policies"
2. Find your `portfolio_comments` table
3. Click "Enable RLS"
4. Add policies:

### Policy 1: Allow SELECT for everyone
- Policy name: `Allow public read access`
- Allowed operation: SELECT
- Target roles: public
- USING expression: `true`

### Policy 2: Allow INSERT for everyone
- Policy name: `Allow public insert access`
- Allowed operation: INSERT
- Target roles: public
- WITH CHECK expression: `true`

## Step 7: Update Your App

Replace the import in your component files:

```javascript
// Instead of:
import Komentar from './components/Commentar';

// Use:
import KomentarSupabase from './components/CommentarSupabase';
```

## Step 8: Test the Setup

1. Run your development server: `npm run dev`
2. Navigate to your portfolio
3. Try posting a comment
4. Check your Supabase dashboard to see if the data appears

## Benefits of Supabase over Firebase

✅ **Better Developer Experience**: More intuitive dashboard and SQL-based queries
✅ **Real-time subscriptions**: Built-in real-time functionality
✅ **PostgreSQL**: Full-featured SQL database
✅ **Better pricing**: More generous free tier
✅ **Open source**: Self-hostable if needed
✅ **Better TypeScript support**: Auto-generated types
✅ **Row Level Security**: Fine-grained access control

## Troubleshooting

### Common Issues:

1. **CORS errors**: Make sure your domain is added to the allowed origins in Supabase settings
2. **RLS blocking requests**: Ensure your policies are set up correctly
3. **Storage upload fails**: Check if the bucket is public and policies allow uploads
4. **Real-time not working**: Verify that real-time is enabled for your table

### Environment Variables (Optional)

For better security, you can use environment variables:

1. Create `.env.local` file:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

2. Update `src/supabase.js`:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

## Next Steps

Once everything is working:
1. Remove Firebase dependencies: `npm uninstall firebase`
2. Delete Firebase configuration files
3. Update any other components using Firebase
4. Test thoroughly before deploying to production