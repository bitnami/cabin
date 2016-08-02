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
import ScrollView from 'components/commons/ScrollView';
import ListItem from 'components/commons/ListItem';
import ChartItem from './ChartItem';

const { PropTypes } = React;
const {
  View,
  StyleSheet,
  Dimensions,
} = ReactNative;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
  },
  list: {
    flex: 1,
  },
  content: {
    paddingTop: 20,
  },
});

export default class DeployClusters extends Component {

  static propTypes = {
    chart: PropTypes.instanceOf(Immutable.Map).isRequired,
    clusters: PropTypes.instanceOf(Immutable.List).isRequired,
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.list} contentContainerStyle={styles.content}>
          <ChartItem chart={this.props.chart} style={{width: Dimensions.get('window').width, paddingHorizontal: 10}}/>
          {this.renderClusters()}
        </ScrollView>
      </View>
    );
  }

  renderClusters() {
    return this.props.clusters.map(cluster => {
      return <ListItem title={cluster.get('name')} subtitle={cluster.get('url')} />;
    });
  }
}