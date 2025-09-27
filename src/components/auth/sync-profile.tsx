"use client";

import { useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setProfile } from "@/redux/slice/profile";
import { normalizeProfile } from "@/types/user";

export const SyncProfile = () => {
  const dispatch = useAppDispatch();
  const currentProfile = useAppSelector((state) => state.profile.user);
  
  // Fetch current user from Convex
  const convexUser = useQuery(api.user.getCurrentUser, {});
  
  useEffect(() => {
    if (convexUser && (!currentProfile || currentProfile.id !== convexUser._id)) {
      // Normalize and update Redux state with fresh user data
      const normalizedProfile = normalizeProfile(convexUser);
      dispatch(setProfile(normalizedProfile));
    }
  }, [convexUser, currentProfile, dispatch]);

  return null; // This component doesn't render anything
};
