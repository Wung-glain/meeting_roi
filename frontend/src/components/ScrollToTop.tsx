import { useEffect} from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    const { pathname} = useLocation();
    useEffect(() => {
        window.scroll(0, 0);
        console.log("hello")
    }, [pathname]);
    return null;
};

export default ScrollToTop;