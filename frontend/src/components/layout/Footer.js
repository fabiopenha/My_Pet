import styles from './Footer.module.css';

const date = new Date().getFullYear()
function Footer() {
    return (
        <footer className={styles.footer}>
            <p><span className="bold">My Pet</span> &copy; {date}</p>
        </footer>
    )
}

export default Footer;