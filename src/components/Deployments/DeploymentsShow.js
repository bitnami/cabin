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
import Colors from 'styles/Colors';
import ListItem from 'components/commons/ListItem';
import ListHeader from 'components/commons/ListHeader';
import LabelsView from 'components/commons/LabelsView';
import ScrollView from 'components/commons/ScrollView';
import ReplicationsSlider from 'components/Replications/ReplicationsSlider';
import DeploymentsActions from 'actions/DeploymentsActions';
import PodsActions from 'actions/PodsActions';
import EntitiesActions from 'actions/EntitiesActions';
import ActionSheetUtils from 'utils/ActionSheetUtils';
import Alert from 'utils/Alert';
import AlertUtils from 'utils/AlertUtils';
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

export class DeploymentsShowContainer extends Component {

  static navigatorButtons = {
    rightButtons: [{
      id: 'more',
      icon: require('images/more.png'),
    }, {
      id: 'yaml',
      icon: require('images/view.png'),
    }],
  };

  render() {
    const { deployment, cluster, navigator } = this.props;
    return (
      <AltContainer
        stores={{
          deployment: () => {
            return {
              store: alt.stores.DeploymentsStore,
              value: alt.stores.DeploymentsStore.get({
                entity: deployment,
                cluster,
              }),
            };
          },
        }}
      >
        <DeploymentsShow
          deployment={deployment}
          cluster={cluster}
          navigator={navigator}
        />
      </AltContainer>
    );
  }
}

export default class DeploymentsShow extends Component {

  static propTypes = {
    deployment: PropTypes.instanceOf(Immutable.Map),
    cluster: PropTypes.instanceOf(Immutable.Map),
  }

  constructor(props) {
    super(props);
    this.state = {
      sliderValue: props.deployment.getIn(['spec', 'replicas']),
    };
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'yaml':
        this.props.navigator.push({
          screen: 'cabin.EntitiesYaml',
          passProps: { cluster: this.props.cluster, entity: this.props.deployment },
        });
        break;
      case 'more':
        const options = [
          { title: intl('cancel') },
          {
            title: intl('deployment_rolling_update_action'),
            onPress: () => {
              this.performRollingUpdate();
            },
          },
        ];
        ActionSheetUtils.showActionSheetWithOptions({options});
        break;
    }
  }

  render() {
    const { deployment } = this.props;
    const hasConfiguration = !!deployment.getIn(['metadata', 'annotations', 'kubectl.kubernetes.io/last-applied-configuration']);
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} contentContainerStyle={styles.containerContent} onRefresh={this.handleRefresh.bind(this)}>
          <ListHeader title=""/>
          <ListItem title="Name" detailTitle={deployment.getIn(['metadata', 'name'])}/>
          <ListItem title="Namespace" detailTitle={deployment.getIn(['metadata', 'namespace'])}/>
          <ListItem title="Age" detailTitle={intlrd(deployment.getIn(['metadata', 'creationTimestamp']))}/>
          <ListItem title="History" showArrow={true} isLast={!hasConfiguration} onPress={this.handleShowHistory.bind(this)}/>
          {hasConfiguration && <ListItem title="Copy to another cluster" showArrow={true} isLast={true} onPress={this.handleCopyObject.bind(this)}/>}
          <ListHeader title="Replicas"/>
          <ReplicationsSlider replication={deployment} onSubmit={this.handleReplicasComplete.bind(this)}/>
          <ListItem title="Current" detailTitle={`${deployment.getIn(['status', 'replicas'], 0)}`}/>
          <ListItem title="Up to date" detailTitle={`${deployment.getIn(['status', 'updatedReplicas'], 0)}`}/>
          <ListItem title="Available" detailTitle={`${deployment.getIn(['status', 'availableReplicas'], 0)}`} isLast={true}/>
          <LabelsView entity={deployment} onSubmit={this.handleLabelSubmit.bind(this)} onDelete={this.handleLabelDelete.bind(this)} />
        </ScrollView>
      </View>
    );
  }

  handleRefresh() {
    DeploymentsActions.fetchDeployments(this.props.cluster);
  }

  handleShowHistory() {
    const { cluster, deployment } = this.props;
    DeploymentsActions.fetchHistory({cluster, deployment});
    this.props.navigator.push({ screen: 'cabin.DeploymentsHistory', title: intl('history'), passProps: {cluster, deployment} });
  }

  handleLabelSubmit({key, value}) {
    return DeploymentsActions.addDeploymentLabel({deployment: this.props.deployment, cluster: this.props.cluster, key, value});
  }

  handleLabelDelete(key) {
    return DeploymentsActions.deleteDeploymentLabel({deployment: this.props.deployment, cluster: this.props.cluster, key});
  }

  handleReplicasComplete(value) {
    return DeploymentsActions.scaleDeployment({deployment: this.props.deployment, cluster: this.props.cluster, replicas: value}).then(() => {
      setTimeout(() => {
        PodsActions.fetchPods(this.props.cluster);
        this.handleRefresh();
      }, 2000);
    });
  }

  handleCopyObject() {
    const options = [{title: intl('cancel')}];
    alt.stores.ClustersStore.getClusters().map(cluster => {
      if (cluster.get('url') !== this.props.cluster.get('url')) {
        options.push({title: cluster.get('name'), onPress: () => this.copyToCluster(cluster)});
      }
    });
    ActionSheetUtils.showActionSheetWithOptions({title: 'Copy to another cluster', options});
  }

  copyToCluster(cluster) {
    const config = this.props.deployment.getIn(['metadata', 'annotations', 'kubectl.kubernetes.io/last-applied-configuration']);
    const params = JSON.parse(config);
    if (params === null) {
      AlertUtils.showError();
      return;
    }
    EntitiesActions.createEntity({cluster, params: Immutable.fromJS(params), entityType: 'deployments'}).then(() => {
      AlertUtils.showSuccess({message: `Deployment copied to ${cluster.get('name')}`});
    });
  }

  performRollingUpdate() {
    const { cluster, deployment } = this.props;
    const containers = deployment.getIn(
      ['spec', 'template', 'spec', 'containers'],
      Immutable.List()
    );
    if (containers.size !== 1) {
      Alert.alert(null, intl('rolling_update_multiple_containers'));
      return;
    }
    Alert.prompt(
      intl('rolling_update_alert'),
      `${intl(
        'rolling_update_alert_subtitle'
      )} ${containers.first().get('image')}`,
      [
        { text: intl('cancel') },
        {
          text: intl('rolling_update_start'),
          onPress: text => {
            DeploymentsActions.rollingUpdate({
              cluster,
              deployment,
              image: text,
            });
          },
        },
      ]
    );
  }

}
