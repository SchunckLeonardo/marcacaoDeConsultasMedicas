import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

interface cepResponse {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  estado: string
}

export default function App() {
  const [cep, setCep] = useState("")
  const [response, setResponse] = useState<cepResponse>()
  const [loading, setLoading] = useState(false)

  function handleSubmit() {
    setLoading(true)
    new Promise((res) => {
      setTimeout(() => res(""), 2000)
    }).then(() => {
    fetch(`https://viacep.com.br/ws/${cep}/json/`).then((res) => res.json()).then((res) => {
      setResponse(res)
      setLoading(false)
    })
    })
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TextInput onChangeText={setCep} placeholder='Digite o seu CEP' style={{ padding: 10, backgroundColor: '#eee', borderRadius: 10, width: "50%" }} />
      </KeyboardAvoidingView>
      <Button title='buscar dados' onPress={() => handleSubmit()}/>
        {loading && <ActivityIndicator size="large" color="blue" />}
        {response && <>
            <Text style={styles.text}>Cidade: {response.localidade}</Text>
            <Text style={styles.text}>Estado: {response.estado}</Text>
            <Text style={styles.text}>Rua: {response.logradouro}</Text>
            <Text style={styles.text}>Bairro: {response.bairro}</Text>
          </>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white'
  }
});
