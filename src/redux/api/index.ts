import { BillingApi } from "./billing";
import { ProjectApi } from "./project";
import { styleGuideApi } from "./style-guide";
import { generationApi } from "./generation";

//centralized api export
export const apis = [BillingApi, ProjectApi, styleGuideApi, generationApi];
