'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { CVUploader } from '@/components/cv/CVUploader'
import { PreferenceForm } from '@/components/preferences/PreferenceForm'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, User, Settings2 } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { SkillVector, UserPreferences } from '@/lib/types'

interface VectorRow {
  id: string
  source_filename: string | null
  created_at: string
  vector_data: SkillVector
}

interface Props {
  user: { email: string; name: string | null; image: string | null }
  vectorRow: VectorRow | null
  initialPreferences: Partial<UserPreferences>
}

export function SettingsClient({ user, vectorRow, initialPreferences }: Props) {
  const [currentVector, setCurrentVector] = useState<VectorRow | null>(vectorRow)

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase()

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your profile, CV, and preferences.</p>
      </div>

      <Tabs defaultValue="cv">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Account
          </TabsTrigger>
          <TabsTrigger value="cv" className="gap-1.5">
            <FileText className="h-3.5 w-3.5" />
            CV &amp; Vector
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-1.5">
            <Settings2 className="h-3.5 w-3.5" />
            Preferences
          </TabsTrigger>
        </TabsList>

        {/* Account tab */}
        <TabsContent value="account">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    {user.name && <p className="font-semibold">{user.name}</p>}
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Your account is managed via OAuth. To change your profile picture or name, update your Google account.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* CV & Vector tab */}
        <TabsContent value="cv">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Skill Vector</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Your CV is parsed into a structured skill vector. Raw files are never stored.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <CVUploader
                  status={{
                    hasVector: !!currentVector,
                    vectorId: currentVector?.id,
                    filename: currentVector?.source_filename ?? undefined,
                    uploadedAt: currentVector?.created_at,
                    summary: currentVector?.vector_data?.summary ?? undefined,
                  }}
                  onUploadComplete={(vectorId, summary) => {
                    setCurrentVector({
                      id: vectorId,
                      source_filename: null,
                      created_at: new Date().toISOString(),
                      vector_data: { summary } as SkillVector,
                    })
                  }}
                  onDelete={() => setCurrentVector(null)}
                />

                {currentVector && (
                  <div className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Stored vector details</p>
                      <Badge variant="outline" className="text-xs">Active</Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                      {currentVector.source_filename && (
                        <div>
                          <span className="font-medium text-foreground">Source: </span>
                          {currentVector.source_filename}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-foreground">Stored: </span>
                        {formatDistanceToNow(new Date(currentVector.created_at), { addSuffix: true })}
                      </div>
                      {currentVector.vector_data?.skills?.length && (
                        <div>
                          <span className="font-medium text-foreground">Skills: </span>
                          {currentVector.vector_data.skills.length} extracted
                        </div>
                      )}
                      {currentVector.vector_data?.experience?.length && (
                        <div>
                          <span className="font-medium text-foreground">Roles: </span>
                          {currentVector.vector_data.experience.length} extracted
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Preferences tab */}
        <TabsContent value="preferences">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Job Preferences</CardTitle>
                <p className="text-xs text-muted-foreground">
                  These preferences influence how your analyses are weighted.
                </p>
              </CardHeader>
              <CardContent>
                <PreferenceForm initialPreferences={initialPreferences} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
