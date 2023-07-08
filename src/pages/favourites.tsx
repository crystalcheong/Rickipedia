import { useAuth, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/router"
import { useState } from "react"

import AuthSignIn from "@/components/Auth.SignIn"
import CharacterCard from "@/components/Character.Card"
import BaseLayout from "@/components/layouts/Layout.Base"
import LocationCard from "@/components/Location.Card"
import { Badge } from "@/components/ui"
import { type Favourite } from "@/data/db/favourites/schema"
import { type SchemaType } from "@/types/rickAndMorty"
import { api, cn } from "@/utils"

const InitialFavouritesStates: Record<SchemaType, Favourite[]> = {
  character: [],
  episode: [],
  location: [],
}

const FavouritesPage = () => {
  const clerk = useClerk()
  const { userId } = useAuth()
  const router = useRouter()

  const [favourites, setFavourites] = useState<typeof InitialFavouritesStates>(
    InitialFavouritesStates
  )
  const characterIds = favourites.character.map(({ schemaId }) => schemaId)
  const locationIds = favourites.location.map(({ schemaId }) => schemaId)

  //#endregion  //*======== QUERIES ===========
  api.favourites.getAll.useQuery(undefined, {
    initialData: [],
    enabled: !!userId,
    onSuccess: (data: Favourite[]) => {
      setFavourites(
        data.reduce((favouritesMap = InitialFavouritesStates, favourite) => {
          favouritesMap[favourite.schemaType] = (
            favouritesMap[favourite.schemaType] ?? []
          ).concat([favourite])
          return favouritesMap
        }, InitialFavouritesStates)
      )
    },
    onSettled: (_, error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        return clerk.openSignIn({
          redirectUrl: router.asPath,
        })
      }
    },
  })

  const [{ data: characters = [] }, { data: locations = [] }] = api.useQueries(
    (trpc) => [
      trpc.rickAndMorty.getCharacters(
        {
          ids: characterIds,
        },
        {
          initialData: [],
          enabled: !!favourites,
        }
      ),
      trpc.rickAndMorty.getLocations(
        {
          ids: locationIds,
        },
        {
          initialData: [],
          enabled: !!favourites,
        }
      ),
    ]
  )
  //#endregion  //*======== QUERIES ===========

  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <AuthSignIn />

      <section className="flex flex-col gap-4">
        <header className="flex flex-row items-center gap-2">
          <h4>Characters</h4>
          {!!characterIds.length && (
            <Badge className="rick dark:slime">{characterIds.length}</Badge>
          )}
        </header>
        <div
          className={cn(
            "relative w-full snap-x snap-mandatory snap-always overflow-x-auto",
            "flex flex-row flex-nowrap place-items-center gap-5"
          )}
        >
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isFavourite={characterIds.includes(character.id)}
              className="shrink-0 snap-start last:mr-6"
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <header className="flex flex-row items-center gap-2">
          <h4>Locations</h4>
          {!!locationIds.length && (
            <Badge className="rick dark:slime">{locationIds.length}</Badge>
          )}
        </header>
        <div
          className={cn(
            "relative w-full snap-x snap-mandatory snap-always overflow-x-auto",
            "flex flex-row flex-nowrap place-items-center gap-5"
          )}
        >
          {locations.map((location) => (
            <LocationCard
              key={location.id}
              location={location}
              isFavourite={locationIds.includes(location.id)}
              className="shrink-0 snap-start last:mr-6"
            />
          ))}
        </div>
      </section>
    </BaseLayout>
  )
}

export default FavouritesPage