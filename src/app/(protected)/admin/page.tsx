"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/store";
import { Id } from "../../../../convex/_generated/dataModel";
import { toast } from "sonner";

export default function AdminPage() {
  const [creditAmount, setCreditAmount] = useState(100);
  const me = useAppSelector((state) => state.profile.user);
  
  const addCredits = useMutation(api.subscription.adminAddCredits);
  const creditBalance = useQuery(api.subscription.getCreditsBalance, {
    userId: me?.id as Id<'users'>,
  });

  const handleAddCredits = async () => {
    if (!me?.id) {
      toast.error("Please sign in first");
      return;
    }

    try {
      const result = await addCredits({
        userId: me.id as Id<'users'>,
        amount: creditAmount,
        reason: "Admin self-grant for testing"
      });
      
      if (result.ok) {
        toast.success(`Added ${result.added} credits! New balance: ${result.balance}`);
      }
    } catch (error) {
      toast.error("Failed to add credits: " + (error as Error).message);
    }
  };

  if (!me) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
          <p className="text-muted-foreground">Please sign in to access admin features.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Credits</CardTitle>
          <CardDescription>Your current credit balance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-primary">
            {creditBalance ?? 0} credits
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Add Credits</CardTitle>
          <CardDescription>Add credits to your account for testing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="credits" className="block text-sm font-medium mb-2">
              Amount to add:
            </label>
            <Input
              id="credits"
              type="number"
              value={creditAmount}
              onChange={(e) => setCreditAmount(Number(e.target.value))}
              min="1"
              max="10000"
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={() => setCreditAmount(100)} variant="outline">
              100 Credits
            </Button>
            <Button onClick={() => setCreditAmount(500)} variant="outline">
              500 Credits
            </Button>
            <Button onClick={() => setCreditAmount(1000)} variant="outline">
              1000 Credits
            </Button>
          </div>

          <Button onClick={handleAddCredits} className="w-full">
            Add {creditAmount} Credits
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
