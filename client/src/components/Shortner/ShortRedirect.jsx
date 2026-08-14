import { useEffect } from "react";
import { useParams } from "react-router-dom";

const ShortRedirect = () => {

    const { code } = useParams();

    useEffect(() => {

        window.location.href =
            `https://project-coin.onrender.com/s/${code}`;

    }, [code]);

    return <h2>Loading...</h2>;

};

export default ShortRedirect;