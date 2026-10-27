"use client";

import { useLocalCollection } from "@/shared/hooks/use-local-collection";

import { PROJECTS, type Project } from "../constants/dashboard-data.constant";

export function useProjects() {
  const { items, ...actions } = useLocalCollection<Project>("wajha:dashboard:projects", PROJECTS, "p");
  return { projects: items, ...actions };
}
