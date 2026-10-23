'use client'

import { useActionState, useState } from 'react'
import { Eye, EyeOff, Info, Loader2, Lock, LogIn, User } from 'lucide-react'
import { loginDriver, type LoginState } from '@/app/tai-xe/actions'

export function DriverLoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginDriver, {})
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-semibold">
          Tên đăng nhập
        </label>
        <div className="flex items-center gap-2 rounded-xl border bg-white px-3 focus-within:border-driver focus-within:ring-2 focus-within:ring-driver/20">
          <User className="size-5 text-muted-foreground" aria-hidden="true" />
          <input
            id="username"
            name="username"
            defaultValue={state.username}
            autoComplete="username"
            required
            placeholder="Nhập tên đăng nhập"
            className="h-12 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-semibold">
          Mật khẩu
        </label>
        <div className="flex items-center gap-2 rounded-xl border bg-white pl-3 focus-within:border-driver focus-within:ring-2 focus-within:ring-driver/20">
          <Lock className="size-5 text-muted-foreground" aria-hidden="true" />
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            placeholder="Nhập mật khẩu"
            className="h-12 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            className="flex size-12 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="size-5" aria-hidden="true" /> : <Eye className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 flex h-12 items-center justify-center gap-2 rounded-xl bg-driver font-semibold text-driver-foreground hover:bg-driver/90 disabled:opacity-70"
      >
        {pending ? <Loader2 className="size-5 animate-spin" aria-hidden="true" /> : <LogIn className="size-5" aria-hidden="true" />}
        {pending ? 'Đang xác thực…' : 'Đăng nhập'}
      </button>

      <p className="flex gap-3 rounded-xl bg-driver-soft p-4 text-sm text-driver">
        <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <span>
          Tài khoản thử nghiệm: <strong>busapp</strong> / <strong>oisp2026</strong>
        </span>
      </p>
    </form>
  )
}
