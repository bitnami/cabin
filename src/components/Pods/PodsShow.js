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
import StatusView from 'components/commons/StatusView';
import LabelsView from 'components/commons/LabelsView';
import ScrollView from 'components/commons/ScrollView';
import PodsActions from 'actions/PodsActions';
import EntitiesUtils from 'utils/EntitiesUtils';
import AltContainer from 'alt-container';

const {
  View,
  StyleSheet,
} = ReactNative;

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  containerContent: {
    paddingBottom: 20,
  },
});

export class PodsShowContainer extends Component {

  static navigatorStyle = defaultNavigatorStyle;

  static navigatorButtons = {
    rightButtons: [{
      id: 'yaml',
      icon: require('images/view.png'),
    }],
  };

  render() {
    const { pod, cluster, navigator } = this.props;
    return (
      <AltContainer
        stores={{
          pod: () => {
            return {
              store: alt.stores.PodsStore,
              value: alt.stores.PodsStore.get({ entity: pod, cluster }),
            };
          },
        }}
      >
        <PodsShow pod={pod} cluster={cluster} navigator={navigator} />
      </AltContainer>
    );
  }
}

export default class PodsShow extends Component {

  static propTypes = {
    pod: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  componentDidMount() {
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress' && event.id === 'yaml') {
      this.props.navigator.push({
        screen: 'cabin.EntitiesYaml',
        passProps: { cluster: this.props.cluster, entity: this.props.pod },
      });
    }
  }

  render() {
    const { pod } = this.props;
    let ready = 0;
    const containerStatuses = pod.getIn(['status', 'containerStatuses'], Immutable.List()).map(status => {
      if (status.get('ready')) { ready++; }
      return status;
    });
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} contentContainerStyle={styles.containerContent} onRefresh={this.handleRefresh.bind(this)}>
          <ListHeader title=""/>
          <ListItem title="Name" detailTitle={pod.getIn(['metadata', 'name'])}/>
          <ListItem title="Namespace" detailTitle={pod.getIn(['metadata', 'namespace'])}/>
          <ListItem title="Status" renderDetail={() => {
            return <StatusView status={EntitiesUtils.statusForEntity(pod)}/>;
          }}/>
          <ListItem title="Ready" detailTitle={`${ready}/${containerStatuses.size}`}/>
          <ListItem title="HostIP" detailTitle={`${pod.getIn(['status', 'hostIP'])}`}/>
          <ListItem title="PodIP" detailTitle={pod.getIn(['status', 'podIP'])} />
          <ListItem title="Logs" showArrow={true} onPress={() => this.showLogs()} isLast={true}/>
          <ListItem title="Exec" showArrow={true} isLast={true} onPress={() => this.showExec()}/>
          <LabelsView entity={pod} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
          <ListHeader title="Containers"/>
          {this.renderContainers()}
        </ScrollView>
      </View>
    );
  }

  renderContainers() {
    const containers = this.props.pod.getIn(['spec', 'containers']);
    const items = containers.map((container, i) => {
      return (
        <ListItem key={i} showArrow={true} isLast={i === containers.size - 1} title={container.get('name')} subtitle={container.get('image')}
          onPress={() => this.showLogs(container.get('name'))}
        />
      );
    });
    return items;
  }

  handleRefresh() {
    PodsActions.fetchPods(this.props.cluster);
  }

  handleLabelSubmit({key, value}) {
    return PodsActions.addPodLabel({pod: this.props.pod, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return PodsActions.deletePodLabel({pod: this.props.pod, cluster: this.props.cluster, key});
  }

  showLogs(container) {
    this.props.navigator.push({screen: 'cabin.PodsLogs', title: 'Logs', passProps: {pod: this.props.pod, cluster: this.props.cluster, container}});
  }

  showExec(container) {
    this.props.navigator.push({screen: 'cabin.PodsExec', title: 'Exec', passProps: {pod: this.props.pod, cluster: this.props.cluster, container}});
  }
}
