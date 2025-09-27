'use client'
import { CircleQuestionMark, Hash, LayoutTemplate, User } from 'lucide-react'
import React from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useAppSelector } from '@/redux/store'
import { SignOutButton } from '../buttons/sign-out'
import { CreateProject } from '../buttons/project'
import { Autosave } from '../canvas/autosave'
import { useQuery } from 'convex/react'
import { api } from '../../../convex/_generated/api'
import { Id } from '../../../convex/_generated/dataModel'

type TabProps = {
  label: string
  href: string
  icon?: React.ReactNode
}

export const Navbar = () => {
  const params = useSearchParams()
  const projectId = params.get('project')
  const me = useAppSelector((state) => state.profile.user)

  // Safety check - don't render if user data isn't loaded yet
  if (!me || !me.name) {
    return (
      <div className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-center h-full">
          <div className="text-sm text-muted-foreground">Loading...</div>
        </div>
      </div>
    )
  }

  const tabs: TabProps[] = [
    {
      label: 'Canvas',
      href: `/dashboard/${me.name}/canvas?project=${projectId}`,
      icon: <Hash className="h-4 w-4" />,
    },
    {
      label: 'Style Guide',
      href: `/dashboard/${me.name}/style-guide?project=${projectId}`,
      icon: <LayoutTemplate className="h-4 w-4" />,
    },
  ]

  const pathname = usePathname()
  const project = useQuery(
    api.projects.getProject,
    projectId && projectId !== 'null' && projectId !== 'undefined'
      ? { projectId: projectId as Id<'projects'> }
      : 'skip'
  )

  const creditBalance = useQuery(api.subscription.getCreditsBalance, {
    userId: me.id as Id<'users'>,
  })

  const hasCanvas = pathname.includes('canvas')
  const hasStyleGuide = pathname.includes('style-guide')

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 p-6 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center gap-4">
        <Link
          href={`/dashboard/${me.name}`}
          className="w-8 h-8 rounded-full border-3 border-white bg-black flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-white"></div>
        </Link>
        {!hasCanvas ||
          (!hasStyleGuide && (
            <div className="lg:inline-block hidden rounded-full text-primary/60 border border-white/[0.12] backdrop-blur-xl bg-white/[0.08] px-4 py-2 text-sm saturate-150">
              Project / {project?.name}
            </div>
          ))}
      </div>
      <div className="lg:flex hidden items-center justify-center gap-2">
        <div className="flex items-center gap-2 backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] rounded-full p-2 saturate-150">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={[
                'group inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition',
                `${pathname}?project=${projectId}` === t.href
                  ? 'bg-white/[0.12] text-white border border-white/[0.16] backdrop-blur-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06] border border-transparent',
              ].join(' ')}
            >
              <span
                className={
                  `${pathname}?project=${projectId}` === t.href
                    ? 'opacity-100'
                    : 'opacity-70 group-hover:opacity-90'
                }
              >
                {t.icon}
              </span>
              <span>{t.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4 justify-end">
        <span className="text-sm text-white/50">{creditBalance} credits</span>
        <SignOutButton />
        <Button
          variant="secondary"
          className="rounded-full h-12 w-12 flex items-center justify-center backdrop-blur-xl bg-white/[0.08] border border-white/[0.12] saturate-150 hover:bg-white/[0.12]"
        >
          <CircleQuestionMark className="size-5 text-white" />
        </Button>
        <Avatar className="size-12 ml-2">
          <AvatarImage src={me.image || undefined} />
          <AvatarFallback>
            <User className="size-5 text-black" />
          </AvatarFallback>
        </Avatar>
        {hasCanvas && <Autosave />}
        {!hasCanvas && !hasStyleGuide && <CreateProject />}
      </div>
    </div>
  )
}
