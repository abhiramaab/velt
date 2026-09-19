import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Terms & Conditions — Velt",
  description: "Terms and conditions of service for Velt Studio.",
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[800px] px-6 pb-24 pt-32">
        <h1 className="font-lastik text-4xl text-slate-900 md:text-5xl">Terms &amp; Conditions</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: September 19, 2026</p>

        <article className="prose prose-slate mt-8 space-y-6 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using Velt (&ldquo;Service&rdquo;), you agree to be bound by these Terms &amp; Conditions. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Description of Service</h2>
            <p className="mt-2">
              Velt is an AI-powered design and prototype creation platform that converts natural language prompts into responsive websites, marketing assets, and design layouts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. Accounts &amp; Subscriptions</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>You must provide accurate and complete information when registering an account.</li>
              <li>Subscription plans (Starter, Pro, Max) are billed on a recurring monthly or annual basis as selected during checkout.</li>
              <li>Payments are processed securely via our billing partner, Razorpay. All fees are clearly stated prior to purchase.</li>
              <li>Each subscription tier provides an allocated number of generation credits per monthly cycle. Unused credits do not roll over unless explicitly stated.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Intellectual Property &amp; Commercial Usage</h2>
            <p className="mt-2">
              <strong>Ownership:</strong> You retain full ownership and commercial rights to the output designs and code generated using your active account on Velt. You are free to export, deploy, modify, and license your creations for personal, commercial, or client work.
            </p>
            <p className="mt-2">
              <strong>Acceptable Use:</strong> You agree not to use Velt to generate unlawful, infringing, abusive, defamatory, or harmful content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Limitation of Liability</h2>
            <p className="mt-2">
              Velt is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We strive for high availability and aesthetic fidelity, but we make no warranties that the service will be entirely uninterrupted or error-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Cancellations &amp; Refunds</h2>
            <p className="mt-2">
              You may cancel your recurring subscription at any time through your account or by contacting <a href="mailto:hello@velt.cloud" className="text-sky-600 underline">hello@velt.cloud</a>. If you experience technical defects preventing service usage, please contact support within 7 days of purchase for assistance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">7. Contact Information</h2>
            <p className="mt-2">
              For any questions, legal notices, or inquiries regarding these Terms, reach out to us at <a href="mailto:hello@velt.cloud" className="text-sky-600 underline">hello@velt.cloud</a>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
