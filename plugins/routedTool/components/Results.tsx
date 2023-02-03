import React from 'react'
import {useFetch} from 'usehooks-ts'
import {Stack, Card, Spinner, Text} from '@sanity/ui'

const url = `https://pokeapi.co/api/v2/type/`
const cardProps = {shadow: 1, padding: 4, radius: 2}

type Result = {[key: string]: any} & {
  pokemon: {
    pokemon: {
      name: string
      url: string
    }
    slot: number
  }[]
}

export default function Results({type}: {type: string}) {
  const {data, error} = useFetch<Result>(`${url}${type}`)

  if (error)
    return (
      <Card tone="critical" {...cardProps}>
        <Text>There has been an error</Text>
      </Card>
    )

  if (!data)
    return (
      <Card tone="default" {...cardProps}>
        <Spinner />
      </Card>
    )

  return (
    <Card {...cardProps}>
      {data?.pokemon && data?.pokemon?.length > 0 ? (
        <Stack space={3}>
          {data.pokemon.map((pokemon) => (
            <Text key={pokemon.pokemon.name}>{pokemon.pokemon.name}</Text>
          ))}
        </Stack>
      ) : null}
    </Card>
  )
}
