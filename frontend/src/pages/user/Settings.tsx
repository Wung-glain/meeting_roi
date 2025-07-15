// // Settings.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft,
//   Moon,
//   Sun,
//   Palette,
//   User,
//   Bell,
//   Lock,
//   Download,
//   Trash2,
//   Info,
//   ExternalLink
// } from 'lucide-react';

// // Re-using the basic Button component for standalone compilation
// const Button = ({ children, onClick, variant = 'default', className = '', type = 'button' }) => {
//   let baseClasses = "px-4 py-2 rounded-lg font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
//   if (variant === 'default') {
//     baseClasses += " bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500";
//   } else if (variant === 'outline') {
//     baseClasses += " border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400";
//   } else if (variant === 'destructive') {
//     baseClasses += " bg-red-600 hover:bg-red-700 text-white focus:ring-red-500";
//   } else if (variant === 'ghost') {
//     baseClasses += " text-gray-700 hover:bg-gray-100";
//   }
//   return <button type={type} onClick={onClick} className={`${baseClasses} ${className}`}>{children}</button>;
// };

// // Mock components for shadcn/ui elements to ensure standalone functionality
// const Card = ({ children, className = '' }) => <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>;
// const CardHeader = ({ children, className = '' }) => <div className={`p-6 border-b border-gray-200 ${className}`}>{children}</div>;
// const CardTitle = ({ children, className = '' }) => <h2 className={`text-xl font-semibold text-gray-800 ${className}`}>{children}</h2>;
// const CardDescription = ({ children, className = '' }) => <p className={`text-gray-600 ${className}`}>{children}</p>;
// const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
// const Switch = ({ id, checked, onCheckedChange, className = '' }) => (
//   <button
//     id={id}
//     role="switch"
//     aria-checked={checked}
//     onClick={() => onCheckedChange(!checked)}
//     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//       checked ? 'bg-blue-600' : 'bg-gray-200'
//     } ${className}`}
//   >
//     <span
//       className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//         checked ? 'translate-x-6' : 'translate-x-1'
//       }`}
//     />
//   </button>
// );
// const Label = ({ htmlFor, children, className = '' }) => (
//   <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
//     {children}
//   </label>
// );


// const Settings: React.FC = () => {
//   const navigate = useNavigate();
//   // State for dark mode, initialized from localStorage
//   const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
//     // Check localStorage for a saved preference, default to false (light mode)
//     const savedTheme = localStorage.getItem('theme');
//     return savedTheme === 'dark';
//   });

//   // Effect to apply the theme class to the document HTML element
//   useEffect(() => {
//     const html = document.documentElement;
//     if (isDarkMode) {
//       html.classList.add('dark');
//       localStorage.setItem('theme', 'dark');
//     } else {
//       html.classList.remove('dark');
//       localStorage.setItem('theme', 'light');
//     }
//   }, [isDarkMode]); // Rerun effect when isDarkMode changes

//   const handleToggleDarkMode = (checked: boolean) => {
//     setIsDarkMode(checked);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-inter text-gray-800 dark:text-gray-200 antialiased py-8 transition-colors duration-300">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
//         <div className="flex items-center mb-6">
//           <Button variant="ghost" onClick={() => navigate(-1)} className="mr-4 dark:text-gray-200 hover:dark:bg-gray-800">
//             <ArrowLeft size={20} />
//           </Button>
//           <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Settings</h1>
//         </div>

//         <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg space-y-10 transition-colors duration-300">

//           {/* Theme Settings */}
//           <div className="space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
//               <Palette size={28} className="mr-3 text-purple-600 dark:text-purple-400" /> Appearance
//             </h3>
//             <Card className="dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
//               <CardContent className="flex items-center justify-between p-4">
//                 <div className="flex items-center space-x-3">
//                   {isDarkMode ? (
//                     <Moon size={20} className="text-blue-500" />
//                   ) : (
//                     <Sun size={20} className="text-orange-500" />
//                   )}
//                   <Label htmlFor="darkModeToggle" className="text-lg font-medium text-gray-700 dark:text-gray-200">
//                     Dark Mode
//                   </Label>
//                 </div>
//                 <Switch
//                   id="darkModeToggle"
//                   checked={isDarkMode}
//                   onCheckedChange={handleToggleDarkMode}
//                   className="data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-gray-300"
//                 />
//               </CardContent>
//             </Card>
//           </div>

//           {/* Other potential settings sections (placeholders) */}
//           <div className="space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
//               <User size={28} className="mr-3 text-teal-600 dark:text-teal-400" /> Account
//             </h3>
//             <Card className="dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
//               <CardContent className="space-y-4 p-4">
//                 <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-600">
//                   Manage Profile
//                 </Button>
//                 <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-600">
//                   Change Password
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
//               <Bell size={28} className="mr-3 text-orange-600 dark:text-orange-400" /> Notifications
//             </h3>
//             <Card className="dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
//               <CardContent className="space-y-4 p-4">
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="emailNotifications" className="text-lg font-medium text-gray-700 dark:text-gray-200">
//                     Email Notifications
//                   </Label>
//                   <Switch id="emailNotifications" />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label htmlFor="appNotifications" className="text-lg font-medium text-gray-700 dark:text-gray-200">
//                     In-App Notifications
//                   </Label>
//                   <Switch id="appNotifications" />
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 flex items-center">
//               <Lock size={28} className="mr-3 text-red-600 dark:text-red-400" /> Security
//             </h3>
//             <Card className="dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
//               <CardContent className="space-y-4 p-4">
//                 <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-200 hover:dark:bg-gray-600">
//                   Two-Factor Authentication
//                 </Button>
//                 <Button variant="destructive" className="w-full">
//                   Delete Account
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default;