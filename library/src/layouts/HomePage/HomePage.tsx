import { ExploreTopBooks } from "./Components/ExploreTopBooks";
import { Carousel } from "./Components/Carousel";
import { Heroes } from "./Components/Hero";
import { LibraryServices } from "./Components/LibraryServices";
export const HomePage = () => {
    return (
        <div>
            <ExploreTopBooks />
            <Carousel />
            <Heroes />
            <LibraryServices />
        </div>
    );
}