import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const metadata = {
  title: "Privacy Policy — Velt",
  description: "Privacy policy and data practices for Velt Studio.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[800px] px-6 pb-24 pt-32">
        <h1 className="font-lastik text-4xl text-slate-900 md:text-5xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Last updated: September 19, 2026</p>

        <article className="prose prose-slate mt-8 space-y-6 text-[15px] leading-relaxed text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">1. Overview</h2>
            <p className="mt-2">
              Velt (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how your information is collected, used, and safeguarded when you visit our website or use our design generation platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">2. Information We Collect</h2>
            <p className="mt-2">
              We collect information that you provide directly to us when creating an account, generating designs, or purchasing subscriptions:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Account Information:</strong> Name, email address, and encrypted credentials.</li>
              <li><strong>Generation Prompts &amp; Artifacts:</strong> The textual prompts, design specifications, and exported layouts you create within Velt.</li>
              <li><strong>Billing &amp; Transaction Details:</strong> Payment identifiers and order IDs processed securely via Razorpay. We do not store raw credit card numbers or banking secrets on our servers.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">3. How We Use Your Information</h2>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>To provide, maintain, and improve our AI design generation and editing services.</li>
              <li>To manage your subscription, issue tokens, and calculate plan generation limits.</li>
              <li>To deliver customer support and respond to inquiries sent to <a href="mailto:hello@velt.cloud" className="text-sky-600 underline">hello@velt.cloud</a>.</li>
              <li>To prevent fraudulent activity and protect the security of our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">4. Third-Party Services</h2>
            <p className="mt-2">
              We partner with trusted third-party service providers to power Velt:
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Razorpay:</strong> Handles secure payment gateway checkout and processing.</li>
              <li><strong>AI Model Providers:</strong> Process design generation prompts under strict data confidentiality terms.</li>
              <li><strong>Hosting &amp; Storage:</strong> Vercel and Supabase for hosting infrastructure and secure database persistence.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">5. Data Retention &amp; Rights</h2>
            <p className="mt-2">
              You retain full rights to the designs and intellectual property generated through your account. You may request account deletion or export of your design records at any time by contacting us at <a href="mailto:hello@velt.cloud" className="text-sky-600 underline">hello@velt.cloud</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">6. Contact Us</h2>
            <p className="mt-2">
              If you have any questions about this Privacy Policy or our practices, please email us at <a href="mailto:hello@velt.cloud" className="text-sky-600 underline">hello@velt.cloud</a>.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
