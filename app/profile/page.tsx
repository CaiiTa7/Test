"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserInfoForm } from '@/components/user-info-form'
import { FiscalOptimizationsForm } from '@/components/fiscal-optimizations-form'
import { UserProfile } from '@/types/calculator'

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => setProfile(data))
  }, [])

  const handleProfileUpdate = async (updatedProfile: UserProfile) => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedProfile),
    })

    if (response.ok) {
      setProfile(updatedProfile)
    } else {
      console.error('Failed to update profile')
    }
  }

  if (!profile) return <div>Loading...</div>

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Profil Utilisateur</CardTitle>
        </CardHeader>
        <CardContent>
          <UserInfoForm 
            userInfo={profile.userInfo} 
            onUserInfoChange={(updatedUserInfo) => handleProfileUpdate({...profile, userInfo: updatedUserInfo})}
          />
          <FiscalOptimizationsForm 
            optimizations={profile.optimizations}
            onOptimizationsChange={(updatedOptimizations) => handleProfileUpdate({...profile, optimizations: updatedOptimizations})}
          />
        </CardContent>
      </Card>
    </div>
  )
}

