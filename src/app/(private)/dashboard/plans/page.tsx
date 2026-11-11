import Header from "../_components/header";
import { listPlans } from "../_lib/apis/dashboard.api";
import { PlansManager } from "./_components/plans-manager";

export default async function Page() {
  const plans = await listPlans();

  return (
    <div className="grid grid-cols-1 gap-6">
      <Header title="الخطط" />
      <PlansManager plans={plans} />

      {/* Spacial Sail */}
      <Header title="عروض خاصه" />
      

    </div>
  );
}
