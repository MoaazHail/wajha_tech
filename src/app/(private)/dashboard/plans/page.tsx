import Header from "../_components/header";
import { PlansManager } from "./_components/plans-manager";

export default function Page() {
  return (
    <div className="grid gap-6">
      <Header title="الخطط" />
      <PlansManager />

      {/* Spacial Sail */}
      <Header title="عروض خاصه" />
      

    </div>
  );
}
