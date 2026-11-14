import { sampleMenswear } from "@/data/sample-menswear";
import { listImportedSamples } from "@/lib/local-account";

export function currentSampleCatalog() {
  return [...sampleMenswear, ...listImportedSamples()];
}
