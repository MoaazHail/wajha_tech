import { cn } from '@/shared/lib/utils/cn.util';
import React from 'react'

type HeaderProps = {
  title: string;
  h2?: boolean;
  className?: string;
}
export default function Header({title ,h2 ,className}: HeaderProps) {
  if(h2){
    return (
      <h2 className={cn("text-lg text-surface/85", className)}>{title}</h2>
    )
  }else{
    return (
      <h1 className={cn("text-3xl text-surface", className)}>{title}</h1>
    )
  }
}
