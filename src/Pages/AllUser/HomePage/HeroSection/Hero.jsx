const Hero = () => {
  return (
    <div>
      <div
        className="hero h-[70vh]"
        style={{
          backgroundImage:
            "url(https://wallpapers.com/images/featured/corporate-event-g6myc8i808y8llhh.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Event Management System is a web application that allows you to
              create and manage events for your organization.
            </p>
            <button
              onClick={() => (window.location.href = "/events")}
              className="btn btn-primary"
            >
              Apply Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
