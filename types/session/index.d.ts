import { useSession } from "next-auth/react"

declare module 'next-auth' {
  interface Session extends DefaultSession {
    activeSubscription: any    
  }
}