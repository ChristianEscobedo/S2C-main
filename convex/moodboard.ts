import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Generate upload URL that expires in 1 hour
    return await ctx.storage.generateUploadUrl();
  },
});

export const addMoodBoardImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the project and verify ownership
    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("Access denied");
    }

    // Get current mood board images (or empty array)
    const currentImages = project.moodBoardImages || [];

    // Check if we're at the limit
    if (currentImages.length >= 5) {
      throw new Error("Maximum 5 mood board images allowed");
    }

    // Add the new storage ID
    const updatedImages = [...currentImages, storageId];

    // Update the project
    await ctx.db.patch(projectId, {
      moodBoardImages: updatedImages,
      lastModified: Date.now(),
    });

    return { success: true, imageCount: updatedImages.length };
  },
});

export const removeMoodBoardImage = mutation({
  args: {
    projectId: v.id("projects"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { projectId, storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the project and verify ownership
    const project = await ctx.db.get(projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.userId !== userId) {
      throw new Error("Access denied");
    }

    // Get current mood board images
    const currentImages = project.moodBoardImages || [];

    // Remove the storage ID
    const updatedImages = currentImages.filter((id) => id !== storageId);

    // Update the project
    await ctx.db.patch(projectId, {
      moodBoardImages: updatedImages,
      lastModified: Date.now(),
    });

    // Delete the file from storage
    try {
      await ctx.storage.delete(storageId);
    } catch (error) {
      console.error(
        `Failed to delete mood board image from storage ${storageId}:`,
        error
      );
    }

    return { success: true, imageCount: updatedImages.length };
  },
});

export const getMoodBoardImages = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    // Get the project and verify ownership
    const project = await ctx.db.get(projectId);
    if (!project || project.userId !== userId) {
      return [];
    }

    // Get storage IDs
    const storageIds = project.moodBoardImages || [];

    // Generate URLs for each image
    const images = await Promise.all(
      storageIds.map(async (storageId, index) => {
        try {
          const url = await ctx.storage.getUrl(storageId);
          return {
            id: `convex-${storageId}`, // Unique ID for client-side tracking
            storageId,
            url,
            uploaded: true,
            uploading: false,
            index, // Preserve order
          };
        } catch (error) {
          return null;
        }
      })
    );

    // Filter out any failed URLs and sort by index
    return images
      .filter((image) => image !== null)
      .sort((a, b) => a!.index - b!.index);
  },
});

export const getImageUrl = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    try {
      const url = await ctx.storage.getUrl(storageId);
      return { url };
    } catch (error) {
      throw new Error("Failed to get image URL");
    }
  },
});
