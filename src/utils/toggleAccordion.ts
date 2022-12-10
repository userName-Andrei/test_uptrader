import { RefObject, MouseEvent } from "react";

const toggleAccordion = (event: MouseEvent<HTMLElement>, accordionRef: RefObject<HTMLElement>) => {
    const content = accordionRef.current?.children[1] as HTMLElement;

    if (accordionRef.current && content) {
        if (accordionRef.current.classList.contains('open')) {
            content.style.maxHeight = 0 + 'px';

            accordionRef.current.classList.toggle('open');
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';

            accordionRef.current.classList.toggle('open');
        }
    }
}

export default toggleAccordion