export default function Footer() {
  return (
    <footer className="bg-[#021952] text-white px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex items-center gap-2 text-xl font-bold">
          ✈️ <span>RouteWise</span>
        </div>

        <p className="text-sm">
          © 2025 <span className="font-medium">RouteWise</span>. All rights
          reserved.
        </p>

        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-blue-400">
            License
          </a>
          <a href="#" className="hover:text-blue-400">
            Help
          </a>
          <a href="#" className="hover:text-blue-400">
            Contact
          </a>
          <a href="#" className="hover:text-blue-400">
            Privacy
          </a>
        </div>
      </div>
    </footer>
  );
}
