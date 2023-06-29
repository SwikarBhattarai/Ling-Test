/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import data from './Mock/data.json';
import {
  Alert,
  Button,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

interface UserData {
  bananas: number;
  lastDayPlayed: string;
  longestStreak: number;
  name: string;
  stars: number;
  subscribed: boolean;
  uid: string;
  rank: number;
}

interface SearchedUserData {
  bananas: number;
  lastDayPlayed: string;
  longestStreak: number;
  name: string;
  stars: number;
  subscribed: boolean;
  uid: string;
}

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([]);
  const [searchedUser, setSearchedUser] = useState('');
  const [searchedUserData, setSearchedUserData] = useState<
    SearchedUserData | undefined
  >(undefined);
  const [toptenList, settopTenList] = useState<UserData[]>([]);

  useEffect(() => {
    const topTenUsers = Object.values(data).sort(
      (a, b) => b.bananas - a.bananas,
    );
    settopTenList(topTenUsers.slice(0, 10).map((l, i) => ({...l, rank: i})));
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onChange = (value: any) => {
    if (!value) {
      setFilteredUsers([]);
      setSearchedUserData(undefined);
    }
    setSearchedUser(value);
  };

  const onSearchUser = () => {
    const lowerCaseName = searchedUser.toLowerCase();
    const filteredData = Object.values(data).find(
      userData => userData.name.toLowerCase() === lowerCaseName,
    );
    if (filteredData) {
      setSearchedUserData(filteredData);
      if (toptenList.map(t => t.uid).includes(filteredData.uid)) {
        setFilteredUsers(toptenList);
      } else {
        const sortedList = Object.values(data)
          .sort((a, b) => b.bananas - a.bananas)
          .map((l, i) => ({...l, rank: i}));
        const getFilteredRank = sortedList.find(
          l => l.uid === filteredData.uid,
        );
        if (getFilteredRank) {
          setFilteredUsers([...toptenList.slice(0, 9), getFilteredRank]);
        }
      }
    } else {
      Alert.alert("User doesn't exist!");
    }
  };

  const checkSearchedUser = (id: string) => {
    return id === searchedUserData?.uid;
  };

  const renderItem: React.FC<{item: UserData; index: number}> = ({
    item,
    index,
  }) => (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: index % 2 ? '#ABBAFF' : '#fff',
      }}>
      <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
        <Text
          testID="user-data"
          style={[{flex: 1}, checkSearchedUser(item.uid) && {color: 'red'}]}>
          {item.name}
        </Text>
      </View>
      <View style={{width: 1, backgroundColor: '#244bff'}} />
      <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
        <Text style={{flex: 1}}>{item.rank + 1}</Text>
      </View>
      <View style={{width: 1, backgroundColor: '#244bff'}} />
      <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
        <Text style={{flex: 1}}>{item.bananas}</Text>
      </View>
      <View style={{width: 1, backgroundColor: '#244bff'}} />
      <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
        <Text style={{flex: 1}}>
          {checkSearchedUser(item.uid) ? 'true' : 'false'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        <View
          style={{
            flex: 0.7,
            backgroundColor: '#fff',
            flexDirection: 'row',
            height: 47,
            borderWidth: 0.25,
            borderColor: '#AFAFAF',
            borderRadius: 4,
            alignItems: 'center',
          }}>
          <View style={{padding: 10}}>
            <Image
              source={require('./Assets/search.png')}
              resizeMode="contain"
              style={{height: 20, width: 20}}
            />
          </View>
          <TextInput
            placeholder={'User name..'}
            placeholderTextColor={'#A3A3A3'}
            autoCapitalize="none"
            underlineColorAndroid="transparent"
            value={searchedUser}
            style={[
              {
                flex: 1,
                paddingTop: 10,
                marginRight: 10,
                paddingBottom: 10,
                flexWrap: 'wrap',
                backgroundColor: '#fff',
              },
            ]}
            onChangeText={onChange}
          />
        </View>
        <View style={{width: 10}} />
        <View style={{flex: 0.3}}>
          <Button
            title="Search"
            onPress={onSearchUser}
            disabled={!searchedUser}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        {filteredUsers && filteredUsers.length === 0 ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text> The list is empty.</Text>
          </View>
        ) : (
          <View style={{flex: 1, marginHorizontal: 10}}>
            <View
              style={{
                flexDirection: 'row',
                backgroundColor: '#5674ff',
              }}>
              <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>Name</Text>
              </View>
              <View style={{width: 1, backgroundColor: '#244bff'}} />
              <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>Rank</Text>
              </View>
              <View style={{width: 1, backgroundColor: '#244bff'}} />
              <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>
                  No. of Bananas
                </Text>
              </View>
              <View style={{width: 1, backgroundColor: '#244bff'}} />
              <View style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                <Text style={{fontWeight: 'bold', color: '#fff'}}>
                  isSearchedUser?
                </Text>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{paddingBottom: 20}}>
              {filteredUsers.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    backgroundColor: index % 2 ? '#ABBAFF' : '#fff',
                  }}>
                  <View
                    style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                    <Text
                      testID="user-data"
                      style={[
                        {flex: 1},
                        checkSearchedUser(item.uid) && {color: 'red'},
                      ]}>
                      {item.name}
                    </Text>
                  </View>
                  <View style={{width: 1, backgroundColor: '#244bff'}} />
                  <View
                    style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                    <Text style={{flex: 1}}>{item.rank + 1}</Text>
                  </View>
                  <View style={{width: 1, backgroundColor: '#244bff'}} />
                  <View
                    style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                    <Text style={{flex: 1}}>{item.bananas}</Text>
                  </View>
                  <View style={{width: 1, backgroundColor: '#244bff'}} />
                  <View
                    style={{flex: 1 / 4, alignItems: 'center', padding: 10}}>
                    <Text style={{flex: 1}}>
                      {checkSearchedUser(item.uid) ? 'true' : 'false'}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
});

export default App;
