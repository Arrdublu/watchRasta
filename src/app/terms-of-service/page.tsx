
export default function TermsOfServicePage() {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-headline font-bold mb-8">Terms of Service</h1>
          <div className="space-y-6 text-muted-foreground">
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            <p>Welcome to watchRasta. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, do not use our services.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">1. Use of Our Service</h2>
            <p>watchRasta provides a platform for discovering music, reading articles, purchasing goods, and interacting with content. You agree to use our service in compliance with all applicable laws and not for any prohibited purposes.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">2. User Accounts</h2>
            <p>To access certain features, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">3. Intellectual Property</h2>
            <p>All content on our website, including text, graphics, logos, music, and software, is the property of watchRasta or its content suppliers and is protected by international copyright laws. You may not reproduce, distribute, or create derivative works from any content without our express permission.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">4. User-Generated Content</h2>
            <p>If you post or upload content to our site ("User Content"), you grant watchRasta a non-exclusive, worldwide, royalty-free license to use, reproduce, and display such User Content in connection with the service. You represent that you have the right to grant this license and that your User Content does not violate any third-party rights.</p>
             <p>We reserve the right, but are not obligated, to review, screen, or remove User Content at our sole discretion and without notice.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">5. Purchases and Payments</h2>
            <p>When you make a purchase on our site, you agree to provide current, complete, and accurate purchase and account information. All payments are processed through our third-party payment processor, Stripe. We are not responsible for any errors by the payment processor. Prices for our products are subject to change without notice.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">6. Disclaimer of Warranties</h2>
            <p>Our service is provided "as is" and "as available" without any warranties of any kind, either express or implied. We do not warrant that the service will be uninterrupted, secure, or error-free.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">7. Limitation of Liability</h2>
            <p>In no event shall watchRasta, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the service.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">8. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which our parent company, Arrdublu Limited, is registered, without regard to its conflict of law provisions.</p>
            
            <h2 className="text-2xl font-headline font-bold pt-4">9. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will notify you of any changes by posting the new Terms on this page. Your continued use of the service after any such changes constitutes your acceptance of the new Terms.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at hi@watchrasta.com.</p>
          </div>
        </div>
      </div>
    );
  }
  