const ErrorPage = () => {
  return (
    <div className="h-screen bg-slate-300 flex flex-col justify-center items-center">
      <p>404 Page not found</p>
      <div>
        <button
          onClick={() => window.location.replace("/")}
          className="btn btn-primary mt-3"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
