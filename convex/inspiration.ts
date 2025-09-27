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

export const addInspirationImage = mutation({
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
      throw new Error("Not authorized to modify this project");
    }

    // Get current inspiration images
    const currentImages = project.inspirationImages || [];

    // Check if we already have this image
    if (currentImages.includes(storageId)) {
      return { success: true, message: "Image already added" };
    }

    // Check if we're at the limit (6 images)
    if (currentImages.length >= 6) {
      throw new Error("Maximum of 6 inspiration images allowed per project");
    }

    // Add the new storage ID
    const updatedImages = [...currentImages, storageId];

    // Update the project with the new inspiration images array
    await ctx.db.patch(projectId, {
      inspirationImages: updatedImages,
      lastModified: Date.now(),
    });

    return {
      success: true,
      message: "Inspiration image added successfully",
      totalImages: updatedImages.length,
    };
  },
});

export const removeInspirationImage = mutation({
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
      throw new Error("Not authorized to modify this project");
    }

    // Get current inspiration images
    const currentImages = project.inspirationImages || [];

    // Remove the storage ID
    const updatedImages = currentImages.filter((id) => id !== storageId);

    // Update the project
    await ctx.db.patch(projectId, {
      inspirationImages: updatedImages,
      lastModified: Date.now(),
    });

    // Delete the file from storage
    try {
      await ctx.storage.delete(storageId);
    } catch (error) {
      console.warn("Failed to delete file from storage:", error);
    }

    return {
      success: true,
      message: "Inspiration image removed successfully",
      remainingImages: updatedImages.length,
    };
  },
});

export const getInspirationImages = query({
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
    const storageIds = project.inspirationImages || [];

    // Generate URLs for each image
    const images = await Promise.all(
      storageIds.map(async (storageId, index) => {
        try {
          const url = await ctx.storage.getUrl(storageId);
          return {
            id: `inspiration-${storageId}`, // Unique ID for client-side tracking
            storageId,
            url,
            uploaded: true,
            uploading: false,
            index, // Preserve order
          };
        } catch (error) {
          console.warn(
            `⚠️ [Convex] Failed to get URL for inspiration storage ID ${storageId}:`,
            error
          );
          return null;
        }
      })
    );

    // Filter out any failed URLs and sort by index
    const validImages = images
      .filter((image) => image !== null)
      .sort((a, b) => a!.index - b!.index);

    return validImages;
  },
});

export const clearAllInspirationImages = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, { projectId }) => {
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
      throw new Error("Not authorized to modify this project");
    }

    // Get current inspiration images
    const currentImages = project.inspirationImages || [];

    // Delete all files from storage
    const deletePromises = currentImages.map(async (storageId) => {
      try {
        await ctx.storage.delete(storageId);
        console.log("🗑️ [Convex] File deleted from storage:", storageId);
      } catch (error) {
        console.warn(
          `⚠️ [Convex] Failed to delete file from storage ${storageId}:`,
          error
        );
      }
    });

    await Promise.all(deletePromises);

    // Clear the inspiration images array
    await ctx.db.patch(projectId, {
      inspirationImages: [],
      lastModified: Date.now(),
    });

    return {
      success: true,
      message: "All inspiration images cleared successfully",
      deletedImages: currentImages.length,
    };
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
      return { url, storageId };
    } catch (error) {
      throw new Error("Failed to get image URL");
    }
  },
});
