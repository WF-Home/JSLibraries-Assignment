import '../../css/header.css';
import burger from "../../images/burger.svg";
import {useListNavigation, useFloating, useInteractions} from '@floating-ui/react';
import { useState, useRef } from 'react';


function Header() {

  const [activeIndex, setActiveIndex] = useState(null);
 
  const {refs, floatingStyles, context} = useFloating({
    open: true,
  });
 
  const listRef = useRef([]);
 
  const listNavigation = useListNavigation(context, {
    listRef,
    activeIndex,
    onNavigate: setActiveIndex,
  });
 
  const {getReferenceProps, getFloatingProps, getItemProps} =
    useInteractions([listNavigation]);
 
  const items = ['About', 'Services', 'Contact Us'];

  return (
    <header>
        <section id="logo">
            <p>Villa Bautista</p>
        </section>
        <section id="burger-menu">
          <img 
            id="burger-icon" 
            src={burger} 
            ref={refs.setReference} 
            {...getReferenceProps()}
          >
          </img>
          <nav
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {items.map((item, index) => (
              <li 
                key={item}
                tabIndex={activeIndex === index ? 0 : -1}
                ref={(node) => { listRef.current[index] = node;}}
                {...getItemProps()}
              >
                {item}
              </li>
            ))}
          </nav>
        </section>
    </header>
  );
}

export default Header;