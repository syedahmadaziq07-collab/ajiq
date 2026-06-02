import { Link } from "wouter";

export function Navbar() {
  return (
    <nav className="w-full flex items-center justify-center px-6 sm:px-10 border-b border-[#EEEEEE]" style={{ height: "64px" }}>
      <div className="flex items-center w-full max-w-[1200px]">
        <Link href="/" className="flex items-center">
          <img
            src="https://framerusercontent.com/images/TqbHTJv9SoFPXMkBqMgSuPnpA.png"
            alt="Askalm"
            style={{ height: "28px", width: "auto" }}
          />
        </Link>
      </div>
    </nav>
  );
}