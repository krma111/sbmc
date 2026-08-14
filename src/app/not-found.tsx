import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <p className="text-6xl font-extrabold tracking-tight text-neutral-200">404</p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-charcoal">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-neutral-500">
          The page you are looking for does not exist. Return to the SBMC homepage to start
          your free business check.
        </p>
        <Link
          href="/en"
          className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-charcoal px-6 text-sm font-bold text-white transition-colors hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}