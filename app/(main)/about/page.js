import styles from '@/styles/about.module.css';
import { Briefcase, Leaf, Handshake } from 'lucide-react';

export default function About() {
  return (
    <div className={styles.container}>
      <h1>About MoneyGrow</h1>
      <p className={styles.intro}>
        MoneyGrow is a financial platform designed to help you grow your money passively every single day.
      </p>

      <section className={styles.section}>
        <h2>
          <Briefcase size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          How It Works
        </h2>
        <p>
          Simply invest an amount—like <strong>$100</strong>—and our system rewards you daily with a fixed return. For example,
          if you invest $100, you receive <strong>$2/day</strong> directly into your balance. You can withdraw or reinvest at any time.
        </p>
      </section>

      <section className={styles.section}>
        <h2>
          <Leaf size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Our Mission
        </h2>
        <p>
          We are a company focused on helping people earn money through a reliable and transparent model. Whether you&apos;re saving for the future or looking for passive income,
          MoneyGrow is here to support you.
        </p>
      </section>

      <section className={styles.section}>
        <h2>
          <Handshake size={22} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Why Choose Us
        </h2>
        <ul>
          <li>✅ Simple & transparent system</li>
          <li>✅ Daily earnings based on your investment</li>
          <li>✅ Trusted by a growing community</li>
          <li>✅ 24/7 support for all our users</li>
        </ul>
      </section>

      <footer className={styles.footer}>
        &copy; 2025 MoneyGrow. All rights reserved.
      </footer>
    </div>
  );
}