import { SubscriptionEntitlementQuery } from "@/convex/query.config";
import { redirect } from "next/navigation";
import { combinedSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

const Page = async () => {
  const { entitlement, profileName } = await SubscriptionEntitlementQuery();
  console.log(entitlement);
  if (!entitlement._valueJSON) {
    redirect(`/billing/${combinedSlug(profileName!)}`);
  }

  redirect(`/dashboard/${combinedSlug(profileName!)}`);
};

export default Page;
