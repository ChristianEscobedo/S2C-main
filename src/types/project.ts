/* eslint-disable @typescript-eslint/no-explicit-any */
import type { EntityState } from "@reduxjs/toolkit";
import type { Shape } from "@/redux/slice/shapes";
import type { Id } from "../../convex/_generated/dataModel";

// Redux shapes slice state structure that gets stored as sketchesData
export interface ProjectSketchesData {
  shapes: EntityState<Shape, string>; // Entity adapter state from Redux
  tool: string; // Current tool selection
  selected: Record<string, true>; // Selection map
  frameCounter: number; // Frame numbering counter
}

// Generated design data structure
export interface GeneratedDesignComponent {
  id: string;
  sourceFrameId: string; // References frame that generated this design
  htmlContent: string; // Generated HTML/React code
  componentName?: string; // Optional component name
  description?: string; // AI-generated description
  generatedAt: number; // Timestamp of generation
  modelUsed?: string; // AI model used for generation
}

export interface ProjectGeneratedDesignData {
  components: GeneratedDesignComponent[];
  metadata?: {
    totalComponents: number;
    lastGenerated: number;
    generationSettings?: any;
  };
}

// Complete project data structure (matches Convex schema)
export interface Project {
  _id: Id<"projects">;
  userId: Id<"users">;
  name: string;
  description?: string;
  sketchesData: ProjectSketchesData; // Complete Redux shapes state
  generatedDesignData?: ProjectGeneratedDesignData; // AI-generated components
  thumbnail?: string; // Base64 image or URL
  lastModified: number;
  createdAt: number;
  isPublic?: boolean;
  tags?: string[];
}

// Lightweight project info for listings (without heavy data)
export interface ProjectSummary {
  _id: Id<"projects">;
  name: string;
  description?: string;
  thumbnail?: string;
  lastModified: number;
  createdAt: number;
  isPublic?: boolean;
  tags?: string[];
  userId?: Id<"users">; // Included for public projects
}
