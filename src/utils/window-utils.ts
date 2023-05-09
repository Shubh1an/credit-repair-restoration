
import { scroller } from 'react-scroll';

export class WindowUtils {

    static ScrollToTop(top = 0, left = 0) {
        window.scroll({
            top,
            left,
            behavior: 'smooth'
        });
    }
    static scrollToForm(id: string) {
        setTimeout(() => {
            scroller.scrollTo(id, {
                duration: 1000,
                delay: 10,
                smooth: true
            });
        }, 0);
    }
    static CopyToClipBoard(text: string): Promise<any> {
        return navigator.clipboard.writeText(text);
    }
    static isCurrentWindowInIFrame(): boolean {
        return (window.location !== window.parent.location);
    }
}