import Header from "../_components/header";
import { listBookings } from "../_lib/apis/dashboard.api";
import { BookingManager } from "./_components/booking-manager";

export default async function Page() {
  const bookings = await listBookings();

  return (
    <section className="grid grid-cols-1 gap-6">
      <Header title="الحجوزات" />
      <BookingManager bookings={bookings} />
    </section>
  );
}
