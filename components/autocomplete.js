import React, { useEffect, useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown'

const RemoteDataSetExample = () => {
  const [loading, setLoading] = useState(false)
  const [remoteDataSet, setRemoteDataSet] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const getSuggestions = useCallback(async (q) => {
    const filterToken = q.toLowerCase()
    console.log('getSuggestions', filterToken)
    if (typeof q !== 'string' || q.length < 3) {
      setRemoteDataSet(null)
      return
    }
    setLoading(true)

    const response = await fetch(
      'https://pokeapi.co/api/v2/pokemon/?limit=898'
    ).then(
      (data) =>
        new Promise((res) => {
          setTimeout(() => res(data), 2000)
        })
    )
    const items = await response.json()

    const suggestions = items['results']
      .filter((item) => item.name.toLowerCase().includes(filterToken))
      .map((item) => ({
        id: item.url,
        title: item.name,
      }))

    setRemoteDataSet(suggestions)
    setLoading(false)
  }, [])

  return (
    <>
      <AutocompleteDropdown
        dataSet={remoteDataSet}
        closeOnBlur={false}
        useFilter={false}
        clearOnFocus={false}
        textInputProps={{
          placeholder: 'Start typing est...',
        }}
        onSelectItem={setSelectedItem}
        loading={loading}
        onChangeText={getSuggestions}
        suggestionsListTextStyle={{
          color: '#8f3c96',
        }}
        EmptyResultComponent={
          <Text style={{ padding: 10, fontSize: 15 }}>Oops ¯\_(ツ)_/¯</Text>
        }
      />
      <Text style={{ color: '#668', fontSize: 13 }}>
        Selected item: {JSON.stringify(selectedItem)}
      </Text>
    </>
  )
}

export default RemoteDataSetExample
