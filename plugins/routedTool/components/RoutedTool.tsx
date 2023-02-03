import React from 'react'
import {Heading, Container, Stack, Card, Inline, Button, Flex, Text} from '@sanity/ui'
import {StateLink, useRouter, useRouterState} from 'sanity/router'
import {RoutedToolConfig} from '../tool'
import Results from './Results'

type RoutedToolProps = {
  tool: RoutedToolConfig
}

const selector = (state: any) => {
  return {
    type: state.type,
  }
}

export default function RoutedTool(props: RoutedToolProps) {
  // Passed in from tool definition
  const {types} = props.tool.options ?? {}

  const {navigate} = useRouter()

  // Using this hook so that the state is typed
  // For some reason, it also requires the selector function to be supplied
  const state = useRouterState<{type: string}>(selector)

  return (
    <Flex height="fill" justify="center" padding={2}>
      <Container>
        <Stack space={4}>
          {types && types?.length > 0 ? (
            <Card padding={2}>
              <Inline space={2}>
                {types.map((type) => {
                  const isActive = state.type && state.type.toLowerCase() === type.toLowerCase()

                  return (
                    <Button
                      key={type}
                      text={type}
                      onClick={() => navigate({type: type.toLowerCase()})}
                      mode={isActive ? `default` : `ghost`}
                      tone={isActive ? `primary` : `default`}
                    />
                  )
                })}
              </Inline>
            </Card>
          ) : null}

          {state.type ? (
            <Card padding={2}>
              <Card padding={4}>
                <Heading>{state.type.toLocaleUpperCase()}</Heading>
              </Card>
              <Results type={state.type} />
            </Card>
          ) : (
            <Card padding={2}>
              <Text>Select a Type to continue</Text>
            </Card>
          )}
        </Stack>
      </Container>
    </Flex>
  )
}
