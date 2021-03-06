> **NOTE** This project is currently not under active development.

> The project is currently in a transition phase. There are known issues with Kubernetes 1.8/1.9 clusters. There is no ETA to fix those issues but we are trying to find a sustainable path. As always PR welcome. Thanks for your understanding.

# Cabin, the mobile app for [Kubernetes](https://kubernetes.io)

Cabin is a Mobile application for Kubernetes. It is loaded with features as shown in the [screenshots](##screenshots) and the [screencast](##screencast). It is a mobile native version of the Kubernetes dashboard with intuitive finger actions to manipulate Kubernetes resources. For example you can delete pods with a single left swipe. You can also add, delete labels, scale deployments with a finger scroll, access logs of your pods, run simple exec commands in containers, trigger rolling-updates by changing the image of your deployments, etc...

Currently still in dev is support for Helm charts. You can view Charts repositories and launch charts.

GKE users will enjoy the ability to create clusters directly from their phone and also add pre-existing GKE clusters to the application to view existing resources.

Cabin is made with [React Native](https://facebook.github.io/react-native/). For [development](#run-locally-using-simulators) purposes you can run the application using both iOS and Android simulators.

We would love your help to make it even cooler !

## Screenshots

Click on each picture to enlarge.

<table style="width:100%">
<tr>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/cluster-add.png">
    <p><b>Add Clusters</b></p>
    <img src="images/cluster-add.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/gke.png">
    <p><b>Create Cluster on GKE</b></p>
    <img src="images/gke.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/pods.png">
    <p><b>Pods View</b></p>
    <img src="images/pods.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/charts.png">
    <p><b>Charts View</b></p>
    <img src="images/charts.png" width="170">
    </a>
  </td>
</tr>
<tr>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/deployment-view.png">
    <p><b>Deployment Scaling</b></p>
    <img src="images/deployment-view.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/logs.png">
    <p><b>Pod Logs</b></p>
    <img src="images/logs.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/labels.png">
    <p><b>Edit Labels</b></p>
    <img src="images/labels.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/search.png">
    <p><b>Search by Label</b></p>
    <img src="images/search.png" width="170">
    </a>
  </td>
</tr>
<tr>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/yaml-view.png">
    <p><b>YAML View</b></p>
    <img src="images/yaml-view.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/ns.png">
    <p><b>Namespace Chooser</b></p>
    <img src="images/ns.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/resource-list.png">
    <p><b>Resource Listing Toggle</b></p>
    <img src="images/resource-list.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/set-image.png">
    <p><b>Set Image</b></p>
    <img src="images/set-image.png" width="170">
    </a>
  </td>
</tr>
<tr>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/services.png">
    <p><b>Service Types</b></p>
    <img src="images/services.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/open-browser.png">
    <p><b>Open Service in Browser</b></p>
    <img src="images/open-browser.png" width="170">
    </a>
  </td>
  <td>
    <a href="https://raw.githubusercontent.com/bitnami-labs/cabin/master/images/ghost.png">
    <p><b>Access Web Apps</b></p>
    <img src="images/ghost.png" width="170">
    </a>
  </td>
</tr>
</table>

## Screencast

It is full of neat features, check out the screencast below by clicking on the image:

<p align="center">
<a href="https://www.youtube.com/watch?v=z54uH2gDmso">
<img src="https://img.youtube.com/vi/z54uH2gDmso/0.jpg">
</a>
</p>

## Run Locally Using Simulators

To develop and test the application you need to setup your local environment, then run the simulator. First, install `react-native-cli` then run the _packager_ in one terminal. Then in another terminal launch the simulator with the `react-native` command. See below for more details.

First, install React Native CLI tools with:

```
npm install -g react-native-cli
```

⚠️ Follow the [Getting Started guide](http://facebook.github.io/react-native/docs/0.48/getting-started.html) to make sure you have everything ready to run a react-native app.

### Run the packager (for both iOS and Android)

Now install `yarn`. On OSX simply do `brew install yarn`.

Use `yarn` to install node dependencies:

```
yarn install
```

In one terminal session, run the packager:

```
yarn start
```

Now depending on your target platform, run the simulator using the appropriate `react-native` command:

### iOS

Install the iOS dependencies:

```
gem install cocoapods
cd iOS/ && pod install
```

Note: You may have to remove an existing `Podfile.lock` file. See [grpc/grpc#12172](https://github.com/grpc/grpc/issues/12172 ) for more information.

Run the app on iOS:
```
react-native run-ios
```

If the command above fails (See [#84](https://github.com/bitnami-labs/cabin/issues/84)), you can compile the iOS project directly from Xcode by opening the `iOS/cabin.xcworkspace`.

You may run into Xcode setup issues like [`xcrun: error: unable to find utility "instruments", not a developer   
`](https://stackoverflow.com/questions/39778607/error-running-react-native-app-from-terminal-ios)

### Android

Due to having to use a feature that was removed from React Native, we have to use a fork and thus compile it from source (See [#88](https://github.com/bitnami-labs/cabin/issues/88)). Follow the steps at [Build React Native from source](https://facebook.github.io/react-native/docs/android-building-from-source.html) to correctly set up your environment.

Run the app on Android:
```
react-native run-android
```

## Get Cabin

Install Cabin for iOS or Android on the application stores:

* [iTunes](https://itunes.apple.com/us/app/cabin-manage-kubernetes-applications/id1137054392?mt=8)
* [Play store](https://play.google.com/store/apps/details?id=com.skippbox.cabin&hl=en)

## Contributing

Check our contributing [guidelines](CONTRIBUTING.md) and send your pull requests.

## Issues

If you face any issues with Cabin, please create an [issue](https://github.com/bitnami-labs/cabin/issues)

**Note** that to preserve as much history as possible we imported a good number of issues from our private repo and the cabin-issues repository.

## Code of Conduct

Cabin abides by the Kubernetes [Code of Conduct](code-of-conduct.md)

## Sponsor

Cabin is brought to you thanks to [Bitnami](https://bitnami.com). Cabin was developed by Skippbox and joined the Bitnami portfolio of Kubernetes products after Skippbox's [acquisition](https://thenewstack.io/skippbox-enterprise-building-kubernetes-bitnami/).
