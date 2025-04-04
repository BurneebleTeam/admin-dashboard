'use client'

import { Settings } from 'lucide-react'
import { ThemeToggle } from './theme-toggle'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export function MobileSettings() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground cursor-pointer">
          <Settings className="h-5 w-5" />
          Settings
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <h4 className="font-medium leading-none">Appearance</h4>
              <p className="text-sm text-muted-foreground">
                Customize the appearance of the app
              </p>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
