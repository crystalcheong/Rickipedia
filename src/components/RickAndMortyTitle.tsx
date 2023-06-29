import Link from "next/link"
import { Fragment } from "react"

import { RenderGuard } from "@/components/providers"
import { Separator } from "@/components/ui"
import RollingNumbers from "@/components/ui/RollingNumbers"
import { api, cn } from "@/utils"
import RickAndMortyLogo from "~/assets/RickAndMorty.svg"

const RickAndMortyTitle = () => {
  const { data: schemaLimits } = api.rickAndMorty.getSchemaLimits.useQuery()

  return (
    <header className="flex flex-col gap-8">
      <RickAndMortyLogo className="sm:36 h-24 w-full sm:h-36" />
      <RenderGuard renderIf={!!schemaLimits}>
        <aside
          className={cn(
            "mx-auto max-w-md",
            "text-sm",
            "flex flex-col place-content-between place-items-center gap-2 sm:flex-row"
          )}
        >
          {Object.entries(schemaLimits ?? {}).map(([type, limit]) => (
            <Fragment key={`${type}-limit`}>
              <Link
                href={`/${type}`}
                className={cn(
                  "font-semibold uppercase",
                  "text-muted-foreground underline-offset-4 hover:underline",
                  "max-w-prose text-center"
                )}
              >
                <RollingNumbers
                  className="rick dark:slime bg-clip-text text-transparent"
                  value={limit}
                />
                &nbsp;
                {type}s
              </Link>
              <Separator
                orientation="vertical"
                className={cn(
                  "last:hidden",
                  "rick dark:slime",
                  "h-[1px] w-20 sm:h-5 sm:w-[1px]"
                )}
              />
            </Fragment>
          ))}
        </aside>
      </RenderGuard>
    </header>
  )
}

export default RickAndMortyTitle
