import styles from '@/styles/contact.module.css';
import { Mail, Phone, Send } from 'lucide-react';

export default function Contact() {
  return (
    <div className={styles.container}>
      <h1>Contact Us</h1>
      <p className={styles.intro}>
        We&apos;re here to help! Reach out with any questions, feedback, or support needs.
      </p>
      <div className={styles.info}>
        <div>
          <Mail size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span>support@moneygrow.com</span>
        </div>
        <div>
          <Phone size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          <span>+1 (555) 123-4567</span>
        </div>
      </div>
     
      <footer className={styles.footer}>
        &copy; 2025 MoneyGrow. All rights reserved.
      </footer>
    </div>
  );
}