Seal_Recognition_appのバックエンド

物体検知において、pdf2imageモジュールを使用するのでpopplerを事前にインストールする。

popplerのインストール
Ubuntu
sudo apt-get install poppler-utils


ONNX形式の推論を実施しているが、ONNXファイルはGoogle Cloud Storage経由でロードする。