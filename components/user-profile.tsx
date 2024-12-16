import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { UserInfoForm } from './user-info-form'
import { FiscalOptimizationsForm } from './fiscal-optimizations-form'
import { UserProfile as UserProfileType } from '@/types/calculator'

interface UserProfileProps {
  initialProfile: UserProfileType;
}

export function UserProfile({ initialProfile }: UserProfileProps) {
  const [profile, setProfile] = useState<UserProfileType>(initialProfile);

  const handleUserInfoChange = (updatedUserInfo: UserProfileType['userInfo']) => {
    setProfile(prevProfile => ({ ...prevProfile, userInfo: updatedUserInfo }));
  };

  const handleOptimizationsChange = (updatedOptimizations: UserProfileType['optimizations']) => {
    setProfile(prevProfile => ({ ...prevProfile, optimizations: updatedOptimizations }));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Profil Utilisateur</CardTitle>
      </CardHeader>
      <CardContent>
        <UserInfoForm 
          userInfo={profile.userInfo} 
          onUserInfoChange={handleUserInfoChange}
        />
        <FiscalOptimizationsForm 
          optimizations={profile.optimizations}
          onOptimizationsChange={handleOptimizationsChange}
        />
      </CardContent>
    </Card>
  );
}

