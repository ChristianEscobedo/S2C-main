/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { fetchProjectsSuccess } from "@/redux/slice/projects";

interface ProjectsProviderProps {
  children: React.ReactNode;
  initialProjects: any; // preloadQuery result with _valueJSON property
}

export const ProjectsProvider = ({
  children,
  initialProjects,
}: ProjectsProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize Redux state with SSR data
    if (initialProjects?._valueJSON) {
      const projectsData = initialProjects._valueJSON;
      dispatch(
        fetchProjectsSuccess({
          projects: projectsData,
          total: projectsData.length,
        })
      );
    }
  }, [dispatch, initialProjects]);

  return <>{children}</>;
};
