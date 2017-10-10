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
import ActionSheet from '@expo/react-native-action-sheet';
import AltContainer from 'alt-container';
import CollectionView from 'components/commons/CollectionView';
import Colors, { defaultNavigatorStyle } from 'styles/Colors';
import ClustersItem from 'components/Clusters/ClustersItem';
import EmptyView from 'components/commons/EmptyView';
import ClustersActions from 'actions/ClustersActions';
import FAB from 'components/commons/FAB';

const {
  View,
  Image,
  InteractionManager,
  Platform,
  StyleSheet,
  DeviceEventEmitter,
} = ReactNative;

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  list: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  listContent: {
    marginTop: 20,
  },
});

export class ClustersIndexNavBarTitle extends Component {
  render() {
    return (
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
        <Image style={{resizeMode: 'contain', width: 32, height: 32, tintColor: Colors.WHITE, marginRight: 6}} source={require('images/kubernetes.png')} />
        <Image style={{resizeMode: 'contain', width: 60, tintColor: Colors.WHITE}} source={require('images/cabin.png')}/>
      </View>
    );
  }
}

export default class ClustersIndex extends Component {

  static navigatorStyle = {
    ...defaultNavigatorStyle,
    navBarCustomView: 'cabin.ClustersIndex.Title',
  };

  static navigatorButtons = {
    rightButtons: [{
      id: 'add',
      icon: require('images/add.png'),
    }],
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  componentDidMount() {
    this.navigationEventListener = DeviceEventEmitter.addListener('clusters:navigation', this.handleShowCluster.bind(this));
    this.actionSheetListener = DeviceEventEmitter.addListener('actionSheet:show', this.onActionSheetShow.bind(this));
    InteractionManager.runAfterInteractions(() => this.checkClusters());
  }

  componentWillUnmount() {
    this.navigationEventListener.remove();
    this.actionSheetListener.remove();
    clearTimeout(this.checkTimeout);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress' && event.id === 'add') {
      this.showClusterNew();
    }
  }

  render() {
    return (
      <ActionSheet ref="actionSheet">
        <View style={styles.flex}>
          <AltContainer stores={{
            list: () => {
              return {
                store: alt.stores.ClustersStore,
                value: alt.stores.ClustersStore.getClusters(),
              };
            }}}>
            <CollectionView style={styles.list}
              ref="CollectionView"
              scrollEnabled={this.state.scrollEnabled}
              contentInset={{bottom: 40}}
              scrollIndicatorInsets={{bottom: 0}}
              contentContainerStyle={styles.listContent}
              list={alt.stores.ClustersStore.getClusters()}
              renderRow={this.renderRow.bind(this)}
              renderEmpty={() => <EmptyView
                  image={require('images/cubes.png')}
                  title={intl('clusters_empty_title')}
                  subtitle={intl('clusters_empty_subtitle')}
                  actionTitle={intl('clusters_empty_action')}
                  onPress={() => this.showClusterNew()}
                />}
              onRefresh={this.handleRefresh.bind(this)}
            />
          </AltContainer>
          {Platform.OS === 'android' &&
            <FAB
              backgroundColor={Colors.BLUE}
              onPress={() => this.showClusterNew()} />}
        </View>
      </ActionSheet>
    );
  }

  renderRow(cluster) {
    const isCompactSize = alt.stores.ClustersStore.getClusters().size > 5;
    return (
      <ClustersItem
        cluster={cluster}
        compactSize={isCompactSize}
        onPress={() => this.onSelectCluster(cluster)}
        onSwipeStart={() => this.setState({scrollEnabled: false})}
        onSwipeEnd={() => this.setState({scrollEnabled: true})}
      />
    );
  }

  handleRefresh() {
    this.checkClusters();
  }

  checkClusters() {
    clearTimeout(this.checkTimeout);
    ClustersActions.checkClusters().then(() => {
      this.checkTimeout = setTimeout(() => {
        this.checkClusters();
      }, 10000);
    });
  }

  handleShowCluster(cluster) {
    this.props.navigator.popToRoot();
    InteractionManager.runAfterInteractions(() => {
      this.onSelectCluster(cluster);
    });
  }

  showClusterNew() {
    this.props.navigator.showModal({
      screen: 'cabin.ClustersNew',
      title: 'New Cluster',
    });
  }

  onSelectCluster(cluster) {
    ClustersActions.fetchClusterEntities(cluster);
    ClustersActions.fetchNamespaces(cluster);
    this.props.navigator.push({
      screen: 'cabin.ClustersShow',
      title: cluster.get('name'),
      backButtonTitle: '',
      passProps: { cluster },
    });
  }

  onActionSheetShow({options, title}) {
    let cancelButtonIndex = 0;
    let destructiveButtonIndex;
    const titles = options.map((opt, i) => {
      if (opt.cancel === true) {
        cancelButtonIndex = i;
      } else if (opt.destructive === true) {
        destructiveButtonIndex = i;
      }
      return opt.title;
    });
    this.refs.actionSheet.showActionSheetWithOptions({
      title,
      options: titles,
      cancelButtonIndex, destructiveButtonIndex,
    },
    (index) => {
      const onPress = options[index].onPress;
      onPress && onPress(index);
    });
  }
}
