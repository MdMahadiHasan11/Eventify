import Carosel from "./Carosel";
import Hero from "./HeroSection/Hero";

const Home = () => {
  return (
    <div>
      <Hero />

      <div className="w-2/4 mx-auto mt-10 mb-4">
        <div>
          <p className="text-3xl py-3 text-center font-bold">Even Photo</p>
        </div>
        <Carosel />
      </div>
    </div>
  );
};

export default Home;
