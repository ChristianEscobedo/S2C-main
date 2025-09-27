import React from "react";
import { ProjectProvider } from "@/components/projects/provider";
import { ProjectQuery } from "@/convex/query.config";
import { InfiniteCanvas } from "@/components/canvas";

export const dynamic = "force-dynamic";

interface CanvasPageProps {
  searchParams: Promise<{ project?: string }>;
}

const CanvasPage = async ({ searchParams }: CanvasPageProps) => {
  const params = await searchParams;
  const projectId = params.project;

  if (!projectId || projectId === 'null' || projectId === 'undefined') {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No project selected</p>
      </div>
    );
  }

  // Fetch project data server-side
  const { project, profile } = await ProjectQuery(projectId);
  if (!profile) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Authentication required</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <p className="text-red-500">Project not found or access denied</p>
      </div>
    );
  }

  return (
    <ProjectProvider initialProject={project}>
      <InfiniteCanvas />
    </ProjectProvider>
  );
};

export default CanvasPage;
