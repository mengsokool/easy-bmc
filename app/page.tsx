import { Loader } from "lucide-react";
import dynamic from "next/dynamic";

const BusinessModelCanvas = dynamic(() => import("./bmc"), {
  ssr: false,
  loading: () => (
    <div className="h-dvh flex flex-col items-center justify-center">
      <Loader className="size-6 animate-spin" />
    </div>
  ),
});

export default function Page() {
  return <BusinessModelCanvas />;
}
