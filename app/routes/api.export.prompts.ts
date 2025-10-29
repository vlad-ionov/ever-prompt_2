import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader(_args: LoaderFunctionArgs) {
  // TODO: Stream prompt export when data layer is ready
  return json({ message: "Export endpoint pending implementation" });
}
