import '../../css/footer.css';

function Footer() {

    const currentYear = new Date().getFullYear()
    return (
        <footer>
            <p>Wiljay Flores © {currentYear}</p>
        </footer>
    );
}

export default Footer;