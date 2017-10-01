/*
  Copyright 2015 Skippbox, Ltd

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import SettingsActions from 'actions/SettingsActions';
import Linking from 'utils/Linking';

const { View, Image, TextInput, ScrollView, StyleSheet } = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginRight: 6,
  },
  tintColor: {
    tintColor: Colors.BLACK,
    opacity: 0.7,
  },
  replicasInput: {
    width: 60,
    alignSelf: 'center',
    textAlign: 'right',
  },
});

export default class Settings extends Component {

  static navigatorStyle = defaultNavigatorStyle;

  render() {
    const maxReplicas = alt.stores.SettingsStore.getMaxReplicas();
    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.list}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardDismissMode="interactive"
        >
          <ListHeader title="Customize" />
          <ListItem
            title={intl('settings_entities_list')}
            showArrow={true}
            onPress={() =>
              this.props.navigator.push({screen: 'cabin.SettingsEntities', title: intl('settings_entities_list')})
            }
          />
          <ListItem
            title="Charts stores"
            showArrow={true}
            onPress={() =>
              this.props.navigator.push({screen: 'cabin.SettingsChartsStores', title: 'Charts Stores'})
            }
          />
          <ListItem
            title="Maximum number of replicas"
            isLast={true}
            onPress={() => {
              this.replicasInput && this.replicasInput.focus();
            }}
            renderDetail={() => {
              return (
                <TextInput
                  ref={t => {
                    this.replicasInput = t;
                  }}
                  style={styles.replicasInput}
                  defaultValue={`${maxReplicas}`}
                  keyboardType="numeric"
                  underlineColorAndroid="transparent"
                  onSubmitEditing={e => {
                    const value = parseInt(e.nativeEvent.text, 10);
                    if (!value || value <= 0) {
                      this.replicasInput.setNativeProps({
                        text: `${maxReplicas}`,
                      });
                      return;
                    }
                    this.replicasInput.setNativeProps({ text: `${value}` });
                    SettingsActions.updateMaxReplicas(value);
                  }}
                />
              );
            }}
          />

          <ListHeader style={{ marginTop: 20 }} title="About us" />
          <ListItem
            detailTitle={APP_CONFIG.VERSION}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image
                    style={[styles.logo, { height: 30, width: 81 }]}
                    source={require('images/logo.png')}
                  />
                </View>
              );
            }}
          />
          <ListItem
            detailTitle="@bitnami"
            onPress={() => Linking.openURL('https://twitter.com/bitnami')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image
                    style={styles.logo}
                    source={require('images/twitter.png')}
                  />
                </View>
              );
            }}
          />
          <ListItem
            detailTitle="kubernetes@bitnami.com"
            onPress={() => Linking.openURL('mailto:kubernetes@bitnami.com')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image
                    style={[styles.logo, styles.tintColor]}
                    source={require('images/mail.png')}
                  />
                </View>
              );
            }}
          />
          <ListItem
            detailTitle="https://bitnami.com"
            isLast={true}
            onPress={() => Linking.openURL('https://bitnami.com')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image
                    style={[styles.logo, styles.tintColor]}
                    source={require('images/web.png')}
                  />
                </View>
              );
            }}
          />

          <ListHeader style={{ marginTop: 20 }} title="Issues" />
          <ListItem
            detailTitle="Github"
            showArrow={true}
            isLast={true}
            onPress={() =>
              Linking.openURL('https://github.com/bitnami/cabin/issues')}
            renderTitle={() => {
              return (
                <View style={styles.titleContainer}>
                  <Image
                    style={[styles.logo, styles.tintColor]}
                    source={require('images/github.png')}
                  />
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
    );
  }
}
