"use client";
import { Button } from "@/components/ui/button";
import { PlusIcon, Loader2 } from "lucide-react";
import { useProjectCreation } from "@/hooks/use-project";

export const CreateProject = () => {
  const { createProject, isCreating, canCreate } = useProjectCreation();

  return (
    <Button
      variant="default"
      onClick={() => createProject()}
      disabled={!canCreate || isCreating}
      className="flex items-center gap-2 cursor-pointer rounded-full">
      {isCreating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <PlusIcon className="h-4 w-4" />
      )}
      {isCreating ? "Creating..." : "New Project"}
    </Button>
  );
};
