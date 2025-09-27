import type { Reducer } from "@reduxjs/toolkit";
import profile from "./profile";
import viewport from "./viewport";
import shapes from "./shapes";
import projects from "./projects";
import chat from "./chat";

//centralized slice export
export const slices: Record<string, Reducer> = {
  profile,
  viewport,
  shapes,
  projects,
  chat,
};
