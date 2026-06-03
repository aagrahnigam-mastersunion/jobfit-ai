'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GripVertical, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { UserPreferences } from '@/lib/types'

const schema = z.object({
  seniority: z.string(),
  location: z.string(),
  workStyle: z.enum(['Remote', 'Hybrid', 'On-site', 'No preference']),
})

type FormData = z.infer<typeof schema>

const roleTypeOptions = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Operations', 'Other']
const growthOptions = ['Learning', 'Compensation', 'Work-life balance', 'Career progression']
const seniorityOptions = ['Intern', 'Junior', 'Mid', 'Senior', 'Lead', 'Manager', 'Director+']

function SortableItem({ id }: { id: string }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 p-2.5 rounded-md border bg-background text-sm cursor-grab active:cursor-grabbing select-none',
        isDragging && 'opacity-50 shadow-lg'
      )}
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" {...attributes} {...listeners} />
      {id}
    </div>
  )
}

interface Props {
  initialPreferences?: Partial<UserPreferences>
  onSave?: (prefs: UserPreferences) => void
  compact?: boolean
}

export function PreferenceForm({ initialPreferences, onSave, compact }: Props) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    initialPreferences?.roleTypes ?? []
  )
  const [growthPriorities, setGrowthPriorities] = useState<string[]>(
    initialPreferences?.growthPriorities?.length
      ? initialPreferences.growthPriorities
      : [...growthOptions]
  )
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      seniority: initialPreferences?.seniority ?? '',
      location: initialPreferences?.location ?? '',
      workStyle: initialPreferences?.workStyle ?? 'No preference',
    },
  })

  const workStyle = watch('workStyle')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setGrowthPriorities((items) => {
        const oldIndex = items.indexOf(String(active.id))
        const newIndex = items.indexOf(String(over.id))
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  const onSubmit = async (data: FormData) => {
    const prefs: UserPreferences = {
      roleTypes: selectedRoles,
      seniority: data.seniority,
      location: data.location,
      workStyle: data.workStyle,
      growthPriorities,
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Preferences saved!')
      onSave?.(prefs)
    } catch {
      toast.error('Failed to save preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Role type */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Role Type</Label>
        <div className="flex flex-wrap gap-2">
          {roleTypeOptions.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                selectedRoles.includes(role)
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-muted hover:border-primary/50'
              )}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      <div className={cn('grid gap-4', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2')}>
        {/* Seniority */}
        <div className="space-y-2">
          <Label>Seniority</Label>
          <Select
            value={watch('seniority')}
            onValueChange={(v) => setValue('seniority', v ?? '')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select level..." />
            </SelectTrigger>
            <SelectContent>
              {seniorityOptions.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Work style */}
        <div className="space-y-2">
          <Label>Work Style</Label>
          <div className="grid grid-cols-2 gap-1.5">
            {(['Remote', 'Hybrid', 'On-site', 'No preference'] as const).map((ws) => (
              <button
                key={ws}
                type="button"
                onClick={() => setValue('workStyle', ws)}
                className={cn(
                  'px-2 py-1.5 rounded-md text-xs border transition-colors',
                  workStyle === ws
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-muted hover:border-primary/50'
                )}
              >
                {ws}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location Preference</Label>
        <Input
          {...register('location')}
          placeholder="e.g. London, UK or anywhere in EU"
        />
      </div>

      {/* Growth priorities */}
      {!compact && (
        <div className="space-y-2">
          <Label>Growth Priorities (drag to rank)</Label>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={growthPriorities} strategy={verticalListSortingStrategy}>
              <div className="space-y-1.5">
                {growthPriorities.map((item) => (
                  <SortableItem key={item} id={item} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      <Button type="submit" disabled={isSaving} className="w-full">
        {isSaving ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving...</> : 'Save Preferences'}
      </Button>
    </form>
  )
}
