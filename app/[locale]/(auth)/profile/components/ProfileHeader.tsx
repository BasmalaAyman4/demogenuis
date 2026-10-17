import React from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Mail, LogOut } from 'lucide-react';

interface ProfileHeaderProps {
  user?: {
    name?: string | null;
    email?: string | null;
    mobile?: string | null;
    image?: string | null;
  };
  locale?: string;
}

export function ProfileHeader({ user, locale = 'ar' }: ProfileHeaderProps) {
  const userName = user?.name || (locale === 'en' ? 'User' : 'مستخدم');
  const userEmail = user?.email;
  const userMobile = user?.mobile;
  const userImage = user?.image;

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-700 rounded-2xl shadow-2xl p-4 md:p-8 mb-8 text-white overflow-hidden relative"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {userImage ? (
              <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 shadow-xl overflow-hidden">
                <img
                  src={userImage}
                  alt={userName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white/30 shadow-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {getInitials(userName)}
                </span>
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h1 className="text-xl md:text-3xl font-bold mb-2">{userName}</h1>
            <div className="space-y-1.5">
              {userEmail && (
                <div className="flex items-center gap-2 text-blue-100">
                  <Mail className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm break-all">{userEmail}</span>
                </div>
              )}
              {userMobile && (
                <div className="flex items-center gap-2 text-blue-100">
                  <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  <span className="text-xs md:text-sm">{userMobile}</span>
                </div>
              )}
            </div>
          </div>

          {/* Logout Button - Placeholder */}
          <div className="w-full md:w-auto">
            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium shadow-lg w-full md:w-auto">
              <LogOut className="w-5 h-5" />
              <span>{locale === 'en' ? 'Logout' : 'تسجيل الخروج'}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}