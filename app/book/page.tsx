import Reveal from "@/components/Reveal";
import BookingForm from "@/components/BookingForm";

export default function BookPage() {
  return (
    <section className="pt-40 pb-24">
      <div className="container-narrow">
        <Reveal>
          <p className="eyebrow-line mb-5">Book an appointment</p>
          <h1 className="font-serif text-3xl md:text-4xl text-ink-primary mb-14 max-w-lg">
            Takes about two minutes, start to confirmation.
          </h1>
        </Reveal>
        <BookingForm />
      </div>
    </section>
  );
}
