# Portfolio Admin Portal

This admin portal allows you to manage all aspects of your portfolio website, including projects, certificates, tech stack, experience, profile information, and social links.

## Features

- **Dashboard**: Overview of your portfolio content and section visibility toggles
- **Projects Management**: Add, edit, and delete projects with images, tech stack, and features
- **Certificates Management**: Manage your certificates and credentials
- **Tech Stack Management**: Organize your skills by category with proficiency levels
- **Experience Management**: Track your work history with detailed responsibilities
- **Profile Management**: Update your personal information and profile photo
- **Social Links Management**: Manage your social media and professional links
- **Section Visibility**: Toggle sections on/off to control what appears on your portfolio

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Set up your database using the provided schema in `supabase-schema.sql`
3. Create the following storage buckets:
   - `profile-images`: For profile photos
   - `project-images`: For project screenshots
   - `certificate-images`: For certificate images
   - `tech-icons`: For technology icons
   - `documents`: For resume/CV files

### 2. Environment Configuration

Create a `.env.local` file in the project root with your Supabase credentials:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Authentication (Optional)

For production use, you should implement authentication to protect your admin portal. You can use Supabase Auth for this purpose.

## Usage Guide

### Dashboard

The dashboard provides an overview of your portfolio content and allows you to toggle the visibility of different sections.

### Projects

Manage your portfolio projects with the following information:
- Project title
- Description
- Technologies used (tech stack)
- Key features
- Live demo URL
- GitHub repository URL
- Project image

### Certificates

Manage your certificates and credentials:
- Certificate title
- Issuing organization
- Issue date
- Expiry date (if applicable)
- Credential URL
- Certificate image

### Tech Stack

Organize your technical skills:
- Technology name
- Category (e.g., Frontend, Backend, DevOps)
- Proficiency level (percentage)
- Technology icon

### Experience

Track your work history:
- Job title
- Company name
- Location
- Start and end dates
- Current position indicator
- Job description
- Key responsibilities

### Profile

Manage your personal information:
- Full name
- Professional title
- Short bio
- About me (detailed)
- Contact information (email, phone, location)
- Profile photo
- Resume/CV

### Social Links

Manage your social media and professional links:
- Platform (GitHub, LinkedIn, Twitter, etc.)
- URL
- Display name (optional)

## Implementation Details

### Tech Stack

- **Frontend**: React with Vite
- **UI Framework**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL database)
- **Storage**: Supabase Storage
- **Routing**: React Router

### File Structure

```
src/
├── Pages/
│   ├── Admin/
│   │   ├── AdminLayout.jsx       # Admin layout with sidebar
│   │   ├── Dashboard.jsx         # Main dashboard
│   │   ├── Projects.jsx          # Projects list
│   │   ├── ProjectForm.jsx       # Add/edit project form
│   │   ├── Certificates.jsx      # Certificates list
│   │   ├── CertificateForm.jsx   # Add/edit certificate form
│   │   ├── TechStack.jsx         # Tech stack management
│   │   ├── Experience.jsx        # Experience management
│   │   ├── Profile.jsx           # Profile management
│   │   └── SocialLinks.jsx       # Social links management
│   └── ...                       # Other pages
├── components/
│   └── ...                       # UI components
├── supabase.js                   # Supabase client configuration
└── App.jsx                       # Main application with routes
```

## Security Considerations

- Implement authentication to protect the admin portal
- Use Row Level Security (RLS) in Supabase to restrict data access
- Set up proper CORS policies for your storage buckets
- Consider using environment variables for sensitive information

## Future Enhancements

- User authentication and authorization
- Rich text editor for descriptions
- Image cropping and optimization
- Analytics dashboard
- Backup and restore functionality
- Theme customization
- Multi-language support

## Troubleshooting

### Common Issues

1. **Storage Permissions**: Ensure your storage buckets have the correct permissions set up
2. **CORS Issues**: Configure CORS policies in Supabase to allow requests from your domain
3. **RLS Policies**: Check Row Level Security policies if you're having trouble accessing data
4. **Image Upload Failures**: Verify storage bucket configurations and file size limits

### Getting Help

If you encounter issues, check the following resources:
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com/docs/en/v6)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

This project is licensed under the MIT License - see the LICENSE file for details.