import Link from "next/link";

import { NOT_FOUND_COPY } from "@/lib/copy";
import { TOKEN } from "@/lib/tokens";

export default function NotFound() {
  return (
    <div className={`${TOKEN.CONTAINER_NARROW} flex min-h-[70vh] items-center py-28`}>
      <div className={`${TOKEN.PANEL} mx-auto w-full text-center`}>
        <p className={TOKEN.MONO_TAG + " text-slate-500"}>{NOT_FOUND_COPY.badge}</p>
        <h1 className={`${TOKEN.H2} mt-5`}>{NOT_FOUND_COPY.heading}</h1>
        <p className={`${TOKEN.BODY_LG} mx-auto mt-4 max-w-md`}>{NOT_FOUND_COPY.body}</p>
        <Link href="/" className={`${TOKEN.BTN_PRIMARY} mt-8`}>
          {NOT_FOUND_COPY.cta}
        </Link>
      </div>
    </div>
  );
}
