# 未押印検出アプリ

私の初めて作成したWEBアプリになります！！
このアプリは記録用紙・申請用紙などの押印欄に未押印があるか検出し、ラベル付き当該ファイルを表示します。
多量の記録や申請書の押印確認の効率化のために作成しました。
<br>
<br>

### こだわったポイント
* 学習させたYOLOモデルをONNXに変換したので、前処理・後処理を自作したこと
* 画像ファイルだけでなくPDFファイルも検出可能にしたこと
* なるべく無料枠で済むようにGCPにデプロイしたこと

<br>

## 使用技術
_バックエンド_
* Poetry 1.8.2
* Python 3.12.2
* FastAPI 0.110.0


_フロントエンド_
* React 18.2.0
* Vite 5.1.4
* Material-UI

_機械学習関係_
* YOLOv5
* labelImage (画像データのアノテーション)
* ONNX

_環境構築_
* Docker
* GCP
  * Artifact Registry
  * Cloud Run
  * Firebase

