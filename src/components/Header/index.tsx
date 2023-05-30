import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

export function Header() {

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink activeClassName={styles.active} href="/">
          <img src="/images/logo.svg" alt="ig.news" />
        </ActiveLink>
        <nav>
          <ActiveLink href="/" activeClassName={styles.active}>Home</ActiveLink>
          <ActiveLink href="/posts" activeClassName={styles.active}>Posts</ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
