import { StyleSheet } from 'react-native';

import { quotes } from '@/components/internaldata';
import SessionCard from '@/components/sessionCard';
import { Text, View } from '@/components/Themed';
import { useUser } from '@/components/userContext';
import { useState } from 'react';

export default function TabOneScreen() {
  const { user } = useUser()
  const [tab, setTab] = useState(0)

  function getRandomQuote(quotes: Array<String>) {
    if (!quotes || quotes.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  return (
    <View style={styles.container}>
      <View style={styles.upperContainer}>
        <Text style={styles.title}> Welcome Back</Text>
        <Text style={styles.title}>{user?.username}!</Text>
        <Text style={{ color: "#D2C5AC", fontSize: 16, fontWeight: 600, textAlign: "center", marginTop: 20 }}>
          "{getRandomQuote(quotes)}"
        </Text>


      </View>
      <SessionCard />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#252C37",
    width: "100%",
    padding: 16
  },
  upperContainer: {
    backgroundColor: "#252C37",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: "#F8C61E",
    opacity: 0.8,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
