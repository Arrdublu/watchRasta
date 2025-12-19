
export default function ModernSlaveryActPage() {
    return (
      <div className="container py-16 md:py-24">
        <div className="max-w-3xl mx-auto prose dark:prose-invert">
          <h1 className="text-4xl font-headline font-bold mb-8">Modern Slavery Act Statement</h1>
          <div className="space-y-6 text-muted-foreground">
            <p><strong>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong></p>
            <p>This statement is made pursuant to section 54(1) of the Modern Slavery Act 2015 and constitutes our slavery and human trafficking statement for the current financial year. It outlines the steps watchRasta, operated by Arrdublu Limited, has taken to ensure that modern slavery and human trafficking are not taking place within our business or supply chains.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Our Commitment</h2>
            <p>watchRasta is committed to acting ethically and with integrity in all our business dealings and relationships. We are committed to implementing and enforcing effective systems and controls to ensure modern slavery is not taking place anywhere in our own business or in any of our supply chains.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Our Business and Supply Chains</h2>
            <p>As a platform for music and culture, our primary operations involve digital content creation, curation, and merchandise sales. Our supply chains include freelance content creators, software service providers, merchandise manufacturers, and logistics partners. We recognize that the risk of modern slavery can exist in any supply chain.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Our Policies on Slavery and Human Trafficking</h2>
            <p>We operate a number of internal policies to ensure that we are conducting business in an ethical and transparent manner. These include:</p>
            <ul>
                <li><strong>Code of Conduct:</strong> Our code makes clear to employees the actions and behavior expected of them when representing the organization.</li>
                <li><strong>Supplier Code of Conduct:</strong> We are committed to ensuring our suppliers adhere to the highest standards of ethics. Suppliers are required to demonstrate that they provide safe working conditions, treat workers with dignity and respect, and act ethically and within the law in their use of labor.</li>
                <li><strong>Whistleblowing Policy:</strong> We encourage all our workers, customers, and other business partners to report any concerns related to the direct activities, or the supply chains of, the organization.</li>
            </ul>

            <h2 className="text-2xl font-headline font-bold pt-4">Due Diligence Processes</h2>
            <p>As part of our initiative to identify and mitigate risk we have in place systems to:</p>
            <ul>
                <li>Identify and assess potential risk areas in our supply chains.</li>
                <li>Mitigate the risk of slavery and human trafficking occurring in our supply chains.</li>
                <li>Monitor potential risk areas in our supply chains.</li>
                <li>Protect whistleblowers.</li>
            </ul>

            <h2 className="text-2xl font-headline font-bold pt-4">Risk and Compliance</h2>
            <p>We will not knowingly support or deal with any business involved in slavery or human trafficking. The board of directors has overall responsibility for ensuring this policy complies with our legal and ethical obligations, and that all those under our control comply with it.</p>

            <h2 className="text-2xl font-headline font-bold pt-4">Training</h2>
            <p>To ensure a high level of understanding of the risks of modern slavery and human trafficking in our supply chains and our business, we provide training to our staff. We also require our business partners to provide training to their staff and suppliers and to provide evidence of this.</p>
            
            <p>This statement has been approved by the board of directors of Arrdublu Limited and will be reviewed and updated annually.</p>
          </div>
        </div>
      </div>
    );
  }
  
