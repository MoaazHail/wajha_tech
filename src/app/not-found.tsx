import { StatusScreen } from "@/shared/components/status-screen";

export default function NotFound() {
  return (
    <StatusScreen
      title="الصفحة غير موجودة"
      description="الرابط الذي فتحته غير صحيح أو تم نقل الصفحة."
      action={{ label: "العودة للرئيسية", href: "/" }}
    />
  );
}
