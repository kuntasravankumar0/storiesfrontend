import { motion } from 'framer-motion';
import './StaticPages.css';

const TermsAndConditions = () => {
  return (
    <div className="static-page">
      <div className="container">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>📋 Terms & Conditions</h1>
          <p className="last-updated">Last updated: June 2024</p>
        </motion.div>

        <motion.div className="static-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing and using Ink & Dreams, you accept and agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.</p>
          </section>

          <section>
            <h2>2. User Account</h2>
            <p>To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
            <ul>
              <li>You must provide accurate and complete information during registration.</li>
              <li>You must be at least 13 years old to use this platform.</li>
              <li>One person may not maintain more than one account.</li>
            </ul>
          </section>

          <section>
            <h2>3. Content Guidelines</h2>
            <p>All stories, quotes, and content on Ink & Dreams are the intellectual property of their respective authors. Users may not:</p>
            <ul>
              <li>Copy, reproduce, or distribute any content without permission.</li>
              <li>Post offensive, hateful, or inappropriate comments.</li>
              <li>Use the platform for any illegal activities.</li>
              <li>Attempt to hack, disrupt, or compromise the platform.</li>
            </ul>
          </section>

          <section>
            <h2>4. Intellectual Property</h2>
            <p>All stories and content published on Ink & Dreams are protected by copyright. The original authors retain all rights to their creative works. The platform name, logo, and design are trademarks of Ink & Dreams.</p>
          </section>

          <section>
            <h2>5. User Comments</h2>
            <p>Comments are subject to moderation by our admin team. We reserve the right to remove any comment that violates our community guidelines. Comments must be respectful, relevant, and constructive.</p>
          </section>

          <section>
            <h2>6. Privacy</h2>
            <p>We collect minimal personal information (email, username) to provide our services. We do not sell or share your personal data with third parties. Your reading history and preferences are stored securely.</p>
          </section>

          <section>
            <h2>7. Account Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may request account deletion by contacting us at gynaneshwar2261@gmail.com.</p>
          </section>

          <section>
            <h2>8. Disclaimer</h2>
            <p>Ink & Dreams is provided "as is" without warranties of any kind. We are not responsible for any damages arising from the use of this platform. Stories are works of fiction unless stated otherwise.</p>
          </section>

          <section>
            <h2>9. Changes to Terms</h2>
            <p>We may update these terms from time to time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>For any questions regarding these terms, please contact us at:</p>
            <p className="contact-info">📧 gynaneshwar2261@gmail.com</p>
          </section>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
