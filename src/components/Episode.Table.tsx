import { type ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/Button"
import { type BaseDataTableProps, DataTable } from "@/components/ui/Table.Data"
import { type Episode } from "@/data/clients/rickAndMorty"

const episodeColumns: ColumnDef<Episode>[] = [
  {
    accessorKey: "episode",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Episode
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "air_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Air Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
]

interface EpisodeTable extends BaseDataTableProps {
  episodes: Episode[]
  columns?: typeof episodeColumns
}

const EpisodeTable = ({ episodes, columns, ...rest }: EpisodeTable) => {
  return (
    <DataTable
      filter="name"
      columns={episodeColumns.concat(columns ?? [])}
      data={episodes}
      {...rest}
    />
  )
}

export default EpisodeTable
