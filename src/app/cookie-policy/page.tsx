
export default function CookiePolicyPage() {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-headline font-bold mb-8">Cookie Policy</h1>
          <div className="space-y-6 text-muted-foreground">
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            <p>This Cookie Policy explains how watchRasta ("we," "us," and "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">What are cookies?</h2>
            <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
            <p>Cookies set by the website owner (in this case, watchRasta) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Why do we use cookies?</h2>
            <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our website. For example, we use cookies to remember your login status and preferences.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">What types of cookies do we use?</h2>
            <ul>
                <li><strong>Essential Cookies:</strong> These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas.</li>
                <li><strong>Performance and Functionality Cookies:</strong> These cookies are used to enhance the performance and functionality of our website but are non-essential to their use. However, without these cookies, certain functionality (like remembering your login details) may become unavailable.</li>
                <li><strong>Analytics and Customization Cookies:</strong> These cookies collect information that is used either in aggregate form to help us understand how our website is being used or how effective our marketing campaigns are, or to help us customize our website for you.</li>
                <li><strong>Authentication Cookies:</strong> We use authentication cookies to identify you when you log in to our members-only areas. These cookies are essential for you to access your personal dashboard, saved favorites, and other user-specific features.</li>
            </ul>

            <h2 className="text-2xl font-headline font-bold pt-4">How can you control cookies?</h2>
            <p>You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by setting or amending your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.</p>
            <p>Most browsers allow you to manage your cookie settings. These settings can usually be found in the 'options' or 'preferences' menu of your browser. For more information, please refer to the help documentation for your browser.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Changes to this Cookie Policy</h2>
            <p>We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal, or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Contact Us</h2>
            <p>If you have any questions about our use of cookies or other technologies, please email us at hi@watchrasta.com.</p>
          </div>
        </div>
      </div>
    );
  }
  
