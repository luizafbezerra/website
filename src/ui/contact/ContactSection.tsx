"use client";

import { ContactForm } from "@/ui/contact/ContactForm";
import { useRef } from "react";

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="dot-grid relative py-16 sm:py-24"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto max-w-[800px] px-6">
        <div>
          <h2
            id="contact-heading"
            className="mb-4 text-center text-3xl font-bold text-foreground sm:text-4xl"
          ></h2>
          <p className="mb-12 text-center text-muted-foreground"></p>

          <div className="mx-auto max-w-lg">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
