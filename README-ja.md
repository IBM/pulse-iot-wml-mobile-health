*Read this in other languages: [English](README.md).*

> **免責事項**: このアプリケーションはデモと説明のためだけに使用しているので、法規制関連のレビューは行われていません。医療アプリケーションとして使用されるよう意図されていないため、出力の正確さに関する表現はありません。これは、保証なしで提示するアプリケーションです。


**__スキルレベル__**: Intermediate (中級)
<br>**__注意__**: このリポジトリで使用されるすべてのサービスはライトプランです。もし内容が気に入りましたら、このリポジトリにStarの付与をお願いします。

## MyPulse - IoT WML Mobile Health App

このアプリケーションの背後にあるアイデアは、携帯電話のように、身近にある利用可能なデバイスで心拍数 (パルスレート) をチェックする方法を持つことです。

簡単な説明:

- 心拍数とそれに関連する派生値を含むデータセットを使用して分類モデルを作成します。モデルをデプロイし、WML (Watson Machine Learning) エンドポイントとして公開します。
- モバイルデバイス をWatson IoT Platform に登録します。
- モバイルアプリを使用して、心拍数データをライブ生成します。このデータはIoTプラットフォームに送信され、NoSQL データベースに保存されます。
- アプリからのパルスデータをリアルタイムで(またはデータベースに)ストリーミングし、WMLを使用して、デプロイされたモデルでそのデータを検証します。

## Flow

  <img src="https://raw.githubusercontent.com/IBM/pulse-iot-wml-mobile-health/master/public/img/arch-diagram-health-model-1.png" width="700" height="400" align="center">

1. ユーザーがスマートフォン上のブラウザー内で Web アプリ (MyPulse) にアクセスします。ユーザーはスマートフォンを胸にあてて脈拍数をとります。
2. IBM Cloud 上の Cloudant データベース、Watson IoT Platform、IBM Watson Studio と Watson Machine Learning サービスに、リアルタイムでデータ値が送信されます。
3. Watson Machine Learning はデプロイ済みの機械学習モデルを使用して、リアルタイムでデータの検証を行います。
4. トレーニング済みの機械学習モデルによって予測された脈拍数の値が、Web アプリ (MyPulse) に返されます。返されたデータはリアルタイムでアプリのフロント・ページ上に表示されます。ユーザー自身が値を入力して、機械学習モデルからすぐにフィードバックを受け取ることもできます。

<hr>

## チュートリアルの手順

### ステップ 1 &amp; 5. Node.js application As A Service

- [Node.js Cloudant DB Web Starter](https://console.bluemix.net/catalog/starters/nodejs-cloudant-db-web-starter) を作成する
- 名前をつける
- このサービスには Cloudant データベースが付属しています
- 実行中のアプリケーションインスタンス内に Cloudant がバインドされていることを確認してください
- あなたがアプリケーションを実行すると、Cloudantでデータベースが作成されます

**コードを IBM Cloud にデプロイする:**
- ./deploy.sh

もしくは

- deploy.sh の内容を1行ずつ実行する
- <YOUR_APP_NAME>.mybluemix.net にアクセスする

**コードをローカルPCで実行する:**
- npm install
- npm start
- localhost:3000 にアクセスする

### ステップ 2. Watson Machine Learning Service の設定

> 注意: このサービスは特定の数のAPIコールを許可します。その手数料を超えると予測値を受け取ることができなくなり、クレジットカード情報があれば請求が発生することがあります。

- [Machine Learning](https://console.bluemix.net/catalog/services/machine-learning) サービスを作成します
- 左側のパネルの `Service Credentials` をクリックし、ページの右側にある `New Credential` ボタンをクリックして、見つかった資格情報を保存します。

- `.env.template` ファイルを `.env` というファイル名にリネーム (もしくはコピー) します。

- .env ファイルに以下の資格情報を入力し保存します:

```
WML_SERVICE_PATH=https://ibm-watson-ml.mybluemix.net
WML_USERNAME=
WML_PASSWORD=
WML_INSTANCE_ID=
WML_MODEL_ID=
WML_DEPLOYMENT_ID=
```

### ステップ 3. Watson IoT Platform Service の設定

- [Internet of Things Platform](https://console.bluemix.net/catalog/services/internet-of-things-platform) を作成します (これはプラットフォームサービスだけ)
- 名前をつける
- node.js アプリ内からバインドして追加するようにします (このサービスをアプリに追加するには `+ Add A Connection` をクリックしてください)

### ステップ 4. IBM Studios

[手順](https://github.com/hovig/pulse-iot-wml-mobile-health/blob/master/IBMStudios.md) を参照してください。


<hr>

- <u>**チュートリアルの手順**</u> を実行後
- `http://<YOUR_APP_NAME>.mybluemix.net` に携帯電話のブラウザでアクセスしてみましょう

  > 私が実行中のアプリ [http://mypulse.mybluemix.net/](http://mypulse.mybluemix.net/) を試してみると、それがどのように見えるのかを知ることができます。しかし、私の機械学習サービスの許容量を上回っていますので、予測部分が<b>"undefined"</b> と表示されます。

  ><img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/plan.png" width="1200" height="250">

- [Watson IoT Platform Quickstart](https://quickstart.internetofthings.ibmcloud.com/#/) を開く
- あなたのデータのリアルタイムストリーミングビューのために、そこにあなたのデバイスIDを入れてください

  <img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/qs.png" width="250" height="150">

<hr>


  <img src="https://raw.githubusercontent.com/hovig/pulse-iot-wml-mobile-health/master/public/img/mypulse.gif" width="350" height="500" align="center">


## 重要な名称

* Bluemix aka IBM Cloud
* DSX aka Data Platform

## 参照リンク

* [IBM Cloud](https://bluemix.net/)  
* [IBM Cloud Documentation](https://www.ng.bluemix.net/docs/)  
* [IBM Cloud Developers Community](http://developer.ibm.com/bluemix)  
* [IBM Watson Internet of Things](http://www.ibm.com/internet-of-things/)  
* [IBM Watson IoT Platform](http://www.ibm.com/internet-of-things/iot-solutions/watson-iot-platform/)   
* [IBM Watson IoT Platform Developers Community](https://developer.ibm.com/iotplatform/)
* [Savitzky–Golay filter for smoothing the accelerometer data](https://en.wikipedia.org/wiki/Savitzky%E2%80%93Golay_filter)
* Thanks to Mark Watson for making the "[watson-ml-model-utils](https://www.npmjs.com/package/watson-ml-model-utils)" library
* [Optional: additional use case lookup](https://developer.ibm.com/in/2017/05/31/watson-iot-platform-based-heart-emotion-analysis-using-lyfas-device-apache-spark/)

## ライセンス
[Apache 2.0](LICENSE)
