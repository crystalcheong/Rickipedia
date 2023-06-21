import Link from "next/link"
import { NextSeo, type NextSeoProps } from "next-seo"
import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react"

import { ErrorBoundary } from "@/components/providers"
import ThemeSwitch from "@/components/Theme.Switch"
import { NextImage } from "@/components/ui"
import { AppRoutes } from "@/data/static"
import { AppName } from "@/data/static/app"
import { cn } from "@/utils"

interface SlimePortalProps extends PropsWithChildren {
  show?: boolean
}

export const SlimePortal: FC<SlimePortalProps> = ({
  children,
  show = false,
}: SlimePortalProps) => {
  const [showPortal, setShowPortal] = useState<boolean>(show)

  useEffect(() => {
    setTimeout(function () {
      setShowPortal(false)
    }, 500)
  }, [])

  return (
    <>
      {showPortal ? (
        <NextImage
          isPriority
          useSkeleton
          src={"/assets/Portal.gif"}
          alt={"logo"}
          width={500}
          height={500}
          className={cn(
            "relative",
            "m-auto !w-[50vh]",
            "transition-all	ease-in-out hover:scale-150"
          )}
        />
      ) : (
        children
      )}
    </>
  )
}

interface Props extends ComponentProps<"main"> {
  showPortal?: boolean
  seo?: Partial<NextSeoProps>
}

const BaseLayout = ({
  showPortal = true,
  children,
  className,
  seo,
  ...rest
}: Props) => {
  return (
    <>
      <NextSeo {...seo} />
      <header
        className={cn("sticky top-0 z-40", "bg-background/80 backdrop-blur-md")}
      >
        <nav
          className={cn(
            "mx-auto w-10/12",
            "flex flex-row place-content-between place-items-center gap-4",
            "py-4"
          )}
        >
          <Link href="/">
            <NextImage
              isPriority
              useSkeleton
              src={"/assets/Logo.png"}
              alt={"logo"}
              width={500}
              height={500}
              className={cn(
                "object-cover object-left-top",
                "relative",
                "my-0 mt-auto",
                "h-12 w-full",
                "rounded-full",
                "shadow-lg shadow-green-500/50 hover:shadow-sm"
              )}
            />
          </Link>
          <ThemeSwitch />
        </nav>
      </header>
      <main
        className={cn(
          "scroll-py-10 py-10",
          "mx-auto min-h-[80vh] w-10/12",
          "[&>*]:w-full",
          className
        )}
        {...rest}
      >
        <SlimePortal show={showPortal}>
          <ErrorBoundary>{children}</ErrorBoundary>
        </SlimePortal>
      </main>
      <footer className={cn("border-t")}>
        <main className={cn("mx-auto w-10/12", "py-4", "flex flex-col gap-4")}>
          <h4 className="slime bg-clip-text text-transparent">{AppName}</h4>

          <aside className="flex flex-col gap-2 sm:flex-row">
            {AppRoutes.map((route) => (
              <Link
                key={`footer-route-${route.label}`}
                href={route.href}
                className="hover:slime text-muted-foreground hover:bg-clip-text hover:text-transparent sm:text-sm"
              >
                {route.label}
              </Link>
            ))}
          </aside>
        </main>
      </footer>
    </>
  )
}

export default BaseLayout
