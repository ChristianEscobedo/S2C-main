/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store";
import { loadProject } from "@/redux/slice/shapes";
import { restoreViewport } from "@/redux/slice/viewport";

interface ProjectProviderProps {
  children: React.ReactNode;
  initialProject: any;
}
export const ProjectProvider = ({
  children,
  initialProject,
}: ProjectProviderProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (initialProject?._valueJSON?.sketchesData) {
      const projectData = initialProject._valueJSON;

      // Load the sketches data into the shapes Redux state
      dispatch(loadProject(projectData.sketchesData));

      // Restore viewport position if available
      if (projectData.viewportData) {
        dispatch(restoreViewport(projectData.viewportData));
      }
    }
  }, [dispatch, initialProject]);

  return <>{children}</>;
};
