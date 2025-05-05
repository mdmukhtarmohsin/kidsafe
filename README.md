# KidSafe: Smart Parental Controls

<div align="center">
  <img src="public/logo.png" alt="KidSafe Logo" width="200"/>
  <p><em>Empower parents, protect children, ensure peace of mind</em></p>
</div>

## Overview

KidSafe is a comprehensive parental control application designed to help parents monitor and manage their children's screen time across multiple devices. With KidSafe, parents can set time limits, monitor app usage, track blocked content attempts, set bedtime schedules, and much more—all from a user-friendly dashboard.

## 🌟 Features

### For Parents

- **Dashboard Overview**: Get a quick snapshot of all child activities and device statuses
- **Child Management**: Add and manage multiple child profiles with customizable settings
- **Device Control**: Add and monitor multiple devices per child
- **Screen Time Management**: Set daily screen time limits for each child
- **App Usage Reports**: View detailed app usage statistics and trends
- **Bedtime Scheduling**: Set bedtime hours when devices should be restricted
- **Content Filtering**: Block inappropriate websites and applications
- **Alerts & Notifications**: Receive alerts for violation attempts and important events
- **Settings Management**: Customize app behavior, notifications, and profile settings

### For Children

- **Child Dashboard**: Kid-friendly interface showing screen time remaining and schedule
- **App Usage Tracking**: See which apps are being used the most
- **Blocked Content Alerts**: Notification when attempting to access restricted content
- **Simple Login**: Child-friendly login process using device ID and PIN

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with App Router
- **UI Components**: Tailwind CSS + shadcn/ui
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Context API
- **Form Handling**: React Hook Form with Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account

## 🚀 Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/kidsafe-app.git
   cd kidsafe-app
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### Database Setup

The application requires the following tables in your Supabase database:

- `profiles`: User profiles for parents
- `children`: Child profiles
- `devices`: Device information linked to children
- `app_usage`: App usage tracking
- `blocked_attempts`: Records of attempts to access blocked content
- `alerts`: System alerts and notifications
- `settings`: User settings and preferences

You can find the complete SQL schema in the `/schema` directory.

## 📱 Using KidSafe

### Parent Account

1. **Sign Up/Login**: Create a parent account or login with your credentials
2. **Dashboard**: View the overview of all your children's activities
3. **Add a Child**:
   - Go to the Children tab
   - Click "Add Child"
   - Fill in the child's details and set initial settings
4. **Add Devices**:
   - Click on a child's profile
   - In the Devices section, click "Add Device"
   - Enter device details and save
5. **Set Time Limits**:
   - In the child's profile, adjust the daily screen time limit
   - Configure bedtime hours if needed
6. **Monitor Usage**:
   - Check the Reports section for detailed usage statistics
   - Review the Alerts tab for any policy violations

### Child Login

1. **Access Child Login**: Go to the child login page (`/child-login`)
2. **Enter Credentials**:
   - Enter the Device ID (provided when you set up the device)
   - Enter the child's PIN (if configured)
3. **Use Dashboard**: The child can view their remaining screen time, schedule, and app usage

## 📊 Dashboard Sections

### Parent Dashboard

- **Overview**: Quick statistics and alerts
- **Children**: List of all child profiles with status indicators
- **Reports**: Detailed usage reports and analytics
- **Alerts**: Notification center for all alert events
- **Settings**: Application and account settings

### Child Dashboard

- **Time Remaining**: Visual display of remaining screen time
- **Device Information**: Details about the current device
- **Today's Schedule**: Daily limits and bedtime hours
- **App Usage**: Breakdown of application usage
- **Blocked Attempts**: List of websites/apps blocked by content filters

## 🛡️ Privacy & Security

KidSafe takes privacy seriously. All data is stored securely in your Supabase instance, and no data is shared with third parties. The application requires minimal permissions to function effectively.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📸 Screenshots

![Parent Dashboard](screenshots/parent-dashboard.png)
![Child Profile](screenshots/child-profile.png)
![Child Dashboard](screenshots/child-dashboard.png)
![Reports Page](screenshots/reports.png)

_Note: Replace the screenshot paths with actual screenshots of your application._

---

<div align="center">
  <p>Built with ❤️ for families everywhere</p>
</div>
