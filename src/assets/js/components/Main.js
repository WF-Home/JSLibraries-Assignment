import '../../css/main.css';
import Hero from './Hero';
import Service from './Service';
import Contact from './Contact';

function Main() {
    return (
        <main>
            <Hero />
            <section id="services">
                <h2>Services</h2>
                <Service />
                <Service />
                <Service />
            </section>
            <Contact />
        </main>
    );
}

export default Main;