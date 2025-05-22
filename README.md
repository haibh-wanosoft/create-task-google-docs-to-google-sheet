# Google Apps Script - 基本プロジェクト

このプロジェクトは、Google Sheets での自動化アプリケーションの開発を始めるための基本的な Google Apps Script プロジェクトです。

## 機能

- Google Docs のヘッダーを Google Sheets に変換する

## Requirements

- một file google docs được viết theo format sau https://docs.google.com/document/d/1ICQjxuF_C0hoSqn0GLnnD500UtypweAEKWy6oKCMYjU/edit?tab=t.0#heading=h.ogtmjtsxdbdz

  - 1 heading trong file google docs thỏa mãn điều kiện để chuyển đổi thành 1 một row trong file google sheets khi:
    - heading đó có title kết thúc bằng một trong 3 cụm sau:
      - (修正)
      - (削除)
      - (新規)
  - ví dụ
    ```
    positions（修正） -> true
    positions -> false
    positions（新規）query -> false
    ```

- tạo sẵn một file google sheet với header là các cột sau:

  - No.
  - 項目
  - Issue
  - 担当者
  - ステータス
  - コード実装
  - 普通工数（レビューとコメント修正）
  - フロント・サーバー・DB・インフラ
  - メモ
  - start-date
  - end-date

- cần lấy docsId, docsTabId, sheetId, ví dụ:

  ```
  // docsId -> lấy từ url của file google docs https://docs.google.com/document/d/1ICQjxuF_C0hoSqn0GLnnD500UtypweAEKWy6oKCMYjU/edit?tab=t.0#heading=h.ogtmjtsxdbdz

  docsId = 1ICQjxuF_C0hoSqn0GLnnD500UtypweAEKWy6oKCMYjU

  // docsTabId -> lấy từ url của file google docs https://docs.google.com/document/d/1ICQjxuF_C0hoSqn0GLnnD500UtypweAEKWy6oKCMYjU/edit?tab=t.0#heading=h.ogtmjtsxdbdz

  docsTabId = t.0

  // sheetId -> lấy từ url của file google sheet https://docs.google.com/spreadsheets/d/1ICQjxuF_C0hoSqn0GLnnD500UtypweAEKWy6oKCMYjU/edit?gid=0#gid=0

  sheetId = 1ICQjxuF_C0hoSqn0GLnnD500UtypweAEKWy6oKCMYjU
  ```

## Cách sử dụng qua url đã

- cần lấy docsId, docsTabId, sheetId

## 使用方法

#### nếu bạn muốn build từ đầu

1. truy cập Apps Script https://script.google.com/home

## プロジェクト構成

- `Code.gs`: プロジェクトのメインコード
- `appsscript.json`: プロジェクト設定

## カスタマイズ

以下の方法でプロジェクトを拡張できます：

- カスタムメニューに機能を追加
- HTML Service でユーザーインターフェースを作成
- 他の Google サービスと連携

## 発生しうるケース

このスクリプトを実行する際に、以下のケースが発生する可能性があります：

### 1. 正常に実行される場合

Google Docs から Google Sheets にデータが正常に抽出され、成功メッセージが表示されます。ユーザーは Google Sheets または Google Docs を表示するためのリンクをクリックできます。

### 2. パラメータが不足している場合

必要なパラメータ（docsId、docsTabId、または sheetId）が不足している場合、エラーメッセージが表示され、提供されていないパラメータが示されます。

### 3. シートにデータが既に存在する場合

抽出先のシートに既にデータが存在する場合（ヘッダー行以外）、警告メッセージが表示されます。ユーザーは以下のオプションがあります：

- 新しいシートを作成し、ヘッダーのみを保持
- 現在のシートのデータを削除し、ヘッダーのみを保持

### 4. Google Docs のタブが見つからない場合

指定された Google Docs のタブ ID が見つからない場合、エラーメッセージが表示されます。

### 5. その他のエラーが発生した場合

予期せぬエラーが発生した場合、一般的なエラーメッセージが表示され、エラーの詳細が示されます。
