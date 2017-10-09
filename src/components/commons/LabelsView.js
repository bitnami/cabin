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
import TagInput from 'react-native-tag-input';
import SnackbarUtils from 'utils/SnackbarUtils';

const { View, StyleSheet } = ReactNative;

import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  close: {
    width: 10,
    height: 10,
    tintColor: Colors.GRAY,
  },
  closeContainer: {
    marginVertical: -10,
    marginRight: -10,
    padding: 10,
    paddingTop: 15,
  },
});

export default class LabelsView extends Component {
  static propTypes = {
    entity: PropTypes.instanceOf(Immutable.Map),
    onSubmit: PropTypes.func,
  };

  constructor() {
    super();
    this.input;
  }

  render() {
    const { entity } = this.props;

    const labels = entity.getIn(['metadata', 'labels'], Immutable.List());
    const values = labels
      .map((value, key) => {
        return `${key}:${value}`;
      })
      .toArray();
    return (
      <View style={styles.container}>
        <ListHeader title="Labels" />
        <ListItem
          isLast
          style={{ height: null }}
          renderTitle={() => {
            return (
              <TagInput
                style={{ flex: 1, backgroundColor: 'red' }}
                ref={e => {
                  this.input = e;
                }}
                autoCapitalize="none"
                autoCorrect={false}
                placeholder="new:label"
                returnKeyType="done"
                keyboardType="ascii-capable"
                value={values}
                regex={/^[a-z0-9.\/]+:[a-z0-9.\/]+$/}
                labelExtractor={(label) => label}
                onChange={e => {
                  if (e.length < values.length) {
                    const deletedKey = '';
                    values.forEach(v => {
                      if (e.indexOf(v) === -1) {
                        deletedKey = v.split(':')[0];
                      }
                    });
                    this.handleDelete(deletedKey);
                  } else {
                    this.handleSubmit(e[e.length - 1]);
                  }
                }}
              />
            );
          }}
        />
      </View>
    );
  }

  handleSubmit(newLabel) {
    const [key, value] = newLabel.split(':');
    if (!key || !value) {
      this.showError();
      return;
    }
    this.props.onSubmit &&
      this.props
        .onSubmit({ key, value })
        .then(() => {
          return true;
        })
        .catch(() => {
          this.showError();
        });
  }

  handleDelete(key) {
    this.props.onDelete && this.props.onDelete(key);
  }

  showError() {
    SnackbarUtils.showWarning({
      title: 'Invalid key:value pair.\nSeparate key and value with ":" (ex: foo:bar)',
    });
  }
}
