/**
 * Hàm doGet sửa lại để hiển thị form nhập liệu thay vì lấy từ parameter
 */
function doGet(e) {
  try {
    // Nếu có parameters được truyền vào, sử dụng cách cũ
    if (e.parameter.docsId && e.parameter.docsTabId && e.parameter.sheetId) {
      return processWithParameters(e);
    }

    // Nếu không có parameters, hiển thị form
    return createFormHtml();
  } catch (error) {
    // Xử lý lỗi chung
    Logger.log("エラー: " + error.toString());
    return HtmlService.createHtmlOutput(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              text-align: center;
            }
            .error {
              color: red;
              font-weight: bold;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .btn-warning {
              background-color: #ffc107;
              color: #212529;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">❌ エラーが発生しました！</h2>
            <p>処理が正常に完了しませんでした。</p>
            <p>エラーの詳細：</p>
            <div style="text-align: left; background-color: #ffe6e6; padding: 10px; border-radius: 5px; margin-top: 10px;">
              <code>${error.toString()}</code>
            </div>
            <p>
              <a class="btn btn-secondary" href="#" onclick="window.location.href = window.location.pathname; return false;">ホームに戻る</a>
            </p>
          </div>
        </body>
      </html>
    `
    )
      .setTitle("処理エラー")
      .setFaviconUrl(
        "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
      )
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

/**
 * Hàm xử lý với parameters như cũ
 */
function processWithParameters(e) {
  const docsId = e.parameter.docsId;
  const docsTabId = e.parameter.docsTabId;
  const sheetId = e.parameter.sheetId;

  const docUrlPrefix = `https://docs.google.com/document/d/${docsId}/edit?tab=${docsTabId}#heading=`;
  const sheetUrlPrefix = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?gid=0#gid=0`;

  // Kiểm tra xem có đủ tham số không
  if (!docsId || !docsTabId || !sheetId) {
    return HtmlService.createHtmlOutput(
      `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              text-align: center;
            }
            .error {
              color: red;
              font-weight: bold;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">❌ エラー！</h2>
            <p>パラメータが不足しています。docsId、docsTabId、sheetIdをすべて指定してください。</p>
            <p>現在のパラメータ：</p>
            <ul style="list-style-type: none; padding: 0;">
              <li>docsId: ${docsId || "なし"}</li>
              <li>docsTabId: ${docsTabId || "なし"}</li>
              <li>sheetId: ${sheetId || "なし"}</li>
            </ul>
          </div>
        </body>
      </html>
    `
    )
      .setTitle("パラメータエラー")
      .setFaviconUrl(
        "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
      )
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  try {
    // Gọi hàm chính để xử lý
    extractHeadingsToSheet(docsId, docsTabId, docUrlPrefix, sheetId);

    // Tạo kết quả HTML để hiển thị
    const htmlOutput = HtmlService.createHtmlOutput(`
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              text-align: center;
            }
            .success {
              color: green;
              font-weight: bold;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .btn {
              display: inline-block;
              padding: 10px 15px;
              margin: 10px 5px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            }
            .btn-warning {
              background-color: #ffc107;
              color: #212529;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="success">✅ プロセスが正常に実行されました！</h2>
            <p>Google DocsからGoogle Sheetsにデータが抽出されました。</p>
            <p>Docs ID: ${docsId}</p>
            <p>Tab ID: ${docsTabId}</p>
            <p>Sheet ID: ${sheetId}</p>
            <p>Docs URL: <a target="_blank" href="${docUrlPrefix}">${docUrlPrefix}</a></p>
            <p>Sheet URL: <a target="_blank" href="${sheetUrlPrefix}">${sheetUrlPrefix}</a></p>
            <div>
              <a class="btn" href="${sheetUrlPrefix}" target="_blank">Google Sheetsを表示</a>
              <a class="btn btn-warning" href="${docUrlPrefix}" target="_blank">Google Docsを表示</a>
              <a class="btn btn-secondary" href="#" onclick="window.location.href = window.location.pathname; return false;">ホームに戻る</a>
            </div>
          </div>
        </body>
      </html>
    `);

    // Thiết lập các thuộc tính cần thiết và trả về
    return htmlOutput
      .setTitle("処理結果")
      .setFaviconUrl(
        "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
      )
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (processingError) {
    // Kiểm tra nếu lỗi liên quan đến dữ liệu đã tồn tại trong sheet
    if (
      processingError.message.includes("既に") &&
      processingError.message.includes("レコード")
    ) {
      // Lấy thông tin sheet từ lỗi
      const errorMessage = processingError.message;

      // Tạo HTML thông báo lỗi đặc biệt cho trường hợp sheet đã có dữ liệu
      const htmlOutput = HtmlService.createHtmlOutput(`
        <!DOCTYPE html>
        <html>
          <head>
            <base target="_top">
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
                text-align: center;
              }
              .warning {
                color: #856404;
                font-weight: bold;
              }
              .container {
                max-width: 700px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ffeeba;
                border-radius: 5px;
                background-color: #fff3cd;
              }
              .btn {
                display: inline-block;
                padding: 10px 15px;
                margin: 10px 5px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                font-weight: bold;
              }
              .btn-warning {
                background-color: #ffc107;
                color: #212529;
              }
              .btn-secondary {
                background-color: #6c757d;
                color: white;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h2 class="warning">⚠️ シートにデータが既に存在します！</h2>
              <p>${errorMessage}</p>
              <p>続行するには、次のいずれかを実行できます。</p>
              <ul style="text-align: left; display: inline-block;">
                <li>新しいシートを作成し、ヘッダーのみを保持</li>
                <li>現在のシートのデータを削除し、ヘッダーのみを保持</li>
              </ul>
              <div>
                <a class="btn" href="${sheetUrlPrefix}" target="_blank">Google Sheetsを表示</a>
                <a class="btn btn-warning" href="${docUrlPrefix}" target="_blank">Google Docsを表示</a>
                <a class="btn btn-secondary" href="#" onclick="window.location.href = window.location.pathname; return false;">ホームに戻る</a>
              </div>
            </div>
          </body>
        </html>
      `);

      return htmlOutput
        .setTitle("警告 - シートにデータが既に存在します")
        .setFaviconUrl(
          "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
        )
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    } else {
      // Các lỗi khác - sử dụng thông báo lỗi chung
      throw processingError;
    }
  }
}

/**
 * Tạo form HTML để người dùng nhập thông tin
 */
function createFormHtml() {
  const htmlOutput = HtmlService.createHtmlOutput(`
    <!DOCTYPE html>
    <html>
      <head>
        <base target="_top">
        <meta charset="UTF-8">
        <title>Google Docs から Google Sheets へのデータ抽出</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
          }
          .container {
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          h1 {
            color: #333;
            text-align: center;
          }
          .form-group {
            margin-bottom: 15px;
          }
          label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
          }
          input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
          }
          .hint {
            font-size: 12px;
            color: #666;
            margin-top: 5px;
          }
          .submit-btn {
            background-color: #4285f4;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            display: block;
            margin: 20px auto;
          }
          .submit-btn:hover {
            background-color: #3367d6;
          }
          .submit-btn:disabled {
            background-color: #b3b3b3;
            cursor: not-allowed;
          }
          .instructions {
            background-color: #e8f0fe;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .status-message {
            display: none;
            margin: 15px 0;
            padding: 10px;
            border-radius: 4px;
            text-align: center;
          }
          .status-message.processing {
            display: block;
            background-color: #e8f0fe;
            color: #174ea6;
          }
          .status-message.error {
            display: block;
            background-color: #fce8e6;
            color: #c5221f;
            border: 1px solid #fad2cf;
          }
          .status-message.success {
            display: block;
            background-color: #e6f4ea;
            color: #137333;
            border: 1px solid #ceead6;
          }
          .spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 3px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top-color: #4285f4;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Google Docs から Google Sheets へのデータ抽出</h1>
          
          <div class="instructions">
            <h3>使用方法：</h3>
            <p>Google DocsからGoogle Sheetsにヘッダーデータを抽出するには、以下の情報を入力してください。</p>
          </div>
          
          <form id="extractionForm" onsubmit="handleSubmit(event)">
            <div class="form-group">
              <label for="docsId">Google Docs ID:</label>
              <input type="text" id="docsId" name="docsId" required>
              <div class="hint">例：1A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM (URLから取得できます)</div>
            </div>
            
            <div class="form-group">
              <label for="docsTabId">Docs タブ ID:</label>
              <input type="text" id="docsTabId" name="docsTabId" required>
              <div class="hint">Google Docsのタブ識別子</div>
            </div>
            
            <div class="form-group">
              <label for="sheetId">Google Sheets ID:</label>
              <input type="text" id="sheetId" name="sheetId" required>
              <div class="hint">例：1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms (URLから取得できます)</div>
            </div>
            
            <div id="statusMessage" class="status-message">
              <div class="spinner"></div>
              <span id="statusText">データを処理中...</span>
            </div>
            
            <button type="submit" class="submit-btn">抽出を実行</button>
          </form>
          
          <div class="footer">
            <p>IDの確認方法：URLの該当部分をコピーしてください。</p>
            <p>Google Docs URL例: <code>https://docs.google.com/document/d/<strong>ここがdocsId</strong>/edit...</code></p>
            <p>Google Sheets URL例: <code>https://docs.google.com/spreadsheets/d/<strong>ここがsheetId</strong>/edit...</code></p>
          </div>
        </div>
        
        <script>
          function handleSubmit(event) {
            event.preventDefault();
            const form = document.getElementById('extractionForm');
            const docsId = form.docsId.value.trim();
            const docsTabId = form.docsTabId.value.trim();
            const sheetId = form.sheetId.value.trim();
            
            // Validate form inputs
            if (!docsId || !docsTabId || !sheetId) {
              alert('すべてのフィールドを入力してください。');
              return false;
            }
            
            // Hiển thị giá trị trong console để debug
            console.log("docsId:", docsId);
            console.log("docsTabId:", docsTabId);
            console.log("sheetId:", sheetId);
            
            // Hiện thông báo đang xử lý
            const submitButton = document.querySelector('.submit-btn');
            submitButton.innerHTML = '処理中...';
            submitButton.disabled = true;
            
            // Hiển thị thông báo trạng thái
            const statusMessage = document.getElementById('statusMessage');
            statusMessage.className = 'status-message processing';
            document.getElementById('statusText').innerText = 'Google Docsからデータを抽出中...';
            
            // Tùy chọn 1: Gửi form thông qua google.script.run
            google.script.run
              .withSuccessHandler(function(html) {
                // Cập nhật thông báo trạng thái
                statusMessage.className = 'status-message success';
                document.getElementById('statusText').innerText = '完了しました！結果ページに移動中...';
                
                // Thêm thời gian chờ nhỏ để người dùng thấy thông báo thành công
                setTimeout(function() {
                  // Thay thế toàn bộ trang bằng HTML kết quả
                  document.open();
                  document.write(html);
                  document.close();
                }, 1000);
              })
              .withFailureHandler(function(error) {
                // Cập nhật thông báo trạng thái
                statusMessage.className = 'status-message error';
                document.getElementById('statusText').innerText = 'エラーが発生しました';
                
                // Khôi phục nút submit và hiển thị lỗi
                submitButton.innerHTML = '抽出を実行';
                submitButton.disabled = false;
                alert('エラーが発生しました: ' + error);
                console.error(error);
              })
              .processForm({
                docsId: docsId,
                docsTabId: docsTabId,
                sheetId: sheetId
              });
            
            // Tùy chọn 2: Dùng redirect URL như cũ (chỉ dùng nếu cách 1 không hoạt động)
            /*
            const baseUrl = window.location.href.split('?')[0];
            const redirectUrl = baseUrl + 
              '?docsId=' + encodeURIComponent(docsId) + 
              '&docsTabId=' + encodeURIComponent(docsTabId) + 
              '&sheetId=' + encodeURIComponent(sheetId);
            
            console.log("Redirect URL:", redirectUrl);
            window.location.href = redirectUrl;
            */
            
            return false;
          }
        </script>
      </body>
    </html>
  `);

  return htmlOutput
    .setTitle("ヘッダー抽出ツール")
    .setFaviconUrl(
      "https://www.gstatic.com/images/branding/product/1x/apps_script_48dp.png"
    )
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Hàm để xử lý form sau khi submit
 */
function processForm(formObject) {
  try {
    // Lấy giá trị từ form
    const docsId = formObject.docsId;
    const docsTabId = formObject.docsTabId;
    const sheetId = formObject.sheetId;

    // Tạo một đối tượng parameter giả
    const e = {
      parameter: {
        docsId: docsId,
        docsTabId: docsTabId,
        sheetId: sheetId,
      },
    };

    // Sử dụng hàm xử lý parameter và chuyển đổi thành chuỗi HTML để trả về
    const htmlOutput = processWithParameters(e);

    // Đối với Google Apps Script client-side, cần trả về HTML dưới dạng chuỗi
    // thay vì đối tượng HtmlOutput
    return htmlOutput.getContent();
  } catch (error) {
    Logger.log("Form processing error: " + error);

    // Tạo trang HTML thông báo lỗi
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <base target="_top">
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              text-align: center;
            }
            .error {
              color: red;
              font-weight: bold;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              border: 1px solid #ccc;
              border-radius: 5px;
              background-color: #f9f9f9;
            }
            .btn {
              display: inline-block;
              padding: 10px 15px;
              margin: 10px 5px;
              background-color: #007bff;
              color: white;
              text-decoration: none;
              border-radius: 4px;
              font-weight: bold;
            }
            .btn-secondary {
              background-color: #6c757d;
              color: white;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 class="error">❌ エラーが発生しました！</h2>
            <p>処理が正常に完了しませんでした。</p>
            <p>エラーの詳細：</p>
            <div style="text-align: left; background-color: #ffe6e6; padding: 10px; border-radius: 5px; margin-top: 10px;">
              <code>${error.toString()}</code>
            </div>
            <p>
              <a class="btn btn-secondary" href="#" onclick="window.location.href = window.location.pathname; return false;">ホームに戻る</a>
            </p>
          </div>
        </body>
      </html>
    `;

    return errorHtml;
  }
}

/**
 * params
 * docsId: document id, ref: https://developers.google.com/apps-script/reference/document/document
 * docsTabId: document content tab id, ref: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
 * sheetId: spreadsheet id, ref: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
 */
function extractHeadingsToSheet(docsId, docsTabId, docUrlPrefix, sheetId) {
  const doc = DocumentApp.openById(docsId);
  const documentTab = doc.getTab(docsTabId).asDocumentTab();
  const bodyTab = documentTab.getBody();
  const paragraphsTab = bodyTab.getParagraphs();

  const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  const sheetValues = sheet.getDataRange().getValues();
  const sheetName = sheet.getName();
  const spreadsheetName = SpreadsheetApp.openById(sheetId).getName();
  const recordCount = sheetValues.length - 1; // Số lượng bản ghi (trừ header)

  // Check if sheet already has data (excluding header)
  if (sheetValues.length > 1) {
    // Sheet already has data (excluding header)
    Logger.log(
      `シートには既に${recordCount}件のレコードがあります。新しいデータの書き込みは行いません。`
    );

    // Return detailed error message
    throw new Error(
      `Google Sheet "${spreadsheetName}" （シート名：${sheetName}）には既に${recordCount}件のレコードがあります。` +
        `既存のデータを上書きすることはできません。続行するには、空のシート（ヘッダーのみ）を使用してください。`
    );
  }

  // Assume file sheet have one header row; start writing from the second row.
  let startRow = sheetValues.length + 1;
  let index = 1;

  // count index from current row (if have data before)
  if (sheetValues.length > 1) {
    index = sheetValues.length; // row 2 = index 1, row 3 = index 2, etc...
  }

  // create checkbox in column E
  const checkboxColumnE = createCheckboxToColumnE();

  // create checkbox in column H
  const checkboxColumnH = createCheckboxToColumnH();

  const regex = /.*（(修正|削除|新規)）$/; // only heading with title ending in `(修正|削除|新規)` are allowed create task

  // get heading links, use Advanced Google Services (Docs API), because Apps Script doesn't support get heading links
  // App script reference: https://developers.google.com/apps-script/reference/document/document#getHeadings
  // Docs API reference: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
  const headingLinks = getHeadingLinksUsingAdvancedDocsAPI(
    docsId,
    docsTabId,
    docUrlPrefix,
    regex
  );

  let currentParentHeading = ""; // save nearest heading

  paragraphsTab.forEach((p) => {
    const headingType = p.getHeading();
    const text = p.getText();

    if (headingType === DocumentApp.ParagraphHeading.NORMAL) return;

    // check and set currentParentHeading
    if (
      /^(Mutation|Query|アドミンの各ページ|ユーザーの各ページ|DB|CDK|RESTful)$/.test(
        text
      )
    )
      currentParentHeading = p;

    if (regex.test(text)) {
      // check if current paragraph is sub heading of currentParentHeading
      if (!isSubHeading(headingType, currentParentHeading.getHeading())) return;

      // get Japanese label
      const defaultValueH = getLabelFromType(currentParentHeading.getText());

      const prefixTitleTask = getPrefixTitleTask(
        currentParentHeading.getText()
      );

      const linkReference = headingLinks.find(
        (headingLink) => headingLink.headingName === text.trim()
      );

      console.log("リンク参照を見つける", linkReference?.url);

      sheet.getRange(startRow, 1).setValue(index); // column A: index
      sheet.getRange(startRow, 2).setValue(`${prefixTitleTask} ${text}`); // column B: heading text
      sheet.getRange(startRow, 5).setValue("未着手"); // set default value column E
      sheet.getRange(startRow, 5).setDataValidation(checkboxColumnE); // column E: dropdown
      sheet.getRange(startRow, 8).setValue(defaultValueH); // set default value column H
      sheet.getRange(startRow, 8).setDataValidation(checkboxColumnH); // column H: dropdown

      const urlStyle = createRichTextValue(linkReference?.url || docUrlPrefix);
      sheet.getRange(startRow, 9).setRichTextValue(urlStyle);

      startRow++;
      index++;
    }
  });

  // add conditional formatting for column E
  applyColorRulesToColumnE(sheet);

  // add conditional formatting for column H
  applyColorRulesToColumnH(sheet);
  Logger.log("✔ Google Sheetにデータが書き込まれました。");
}

/**
 * params
 * docsId: document id, ref: https://developers.google.com/apps-script/reference/document/document
 * docsTabId: document content tab id, ref: https://developers.google.com/workspace/docs/api/reference/rest/v1/documents/get?apix_params=%7B%22documentId%22%3A%221A1k-aa6Gvxmgxu0KVBWse18iZL6w_qkqcK5FQlFgvlM%22%2C%22includeTabsContent%22%3Atrue%7D
 * sheetId: spreadsheet id, ref: https://developers.google.com/apps-script/reference/spreadsheet/spreadsheet-app#openbyidid
 */
function getHeadingLinksUsingAdvancedDocsAPI(
  docsId,
  docsTabId,
  docUrl,
  regexTitleHeading
) {
  const doc = Docs.Documents.get(docsId, {
    includeTabsContent: true,
  });

  // find tab by tabId
  const targetTab = doc.tabs.find(
    (tab) => tab.tabProperties.tabId === docsTabId
  );

  const content =
    targetTab && targetTab.documentTab && targetTab.documentTab.body
      ? targetTab.documentTab.body.content
      : [];

  if (content.length === 0) {
    console.log("タブが見つからないか、コンテンツがありません");
    return [];
  }

  const headingLinks = [];
  for (const element of content) {
    const para = element.paragraph;
    if (!para) continue;

    const style = para.paragraphStyle;
    if (!style) continue;

    const namedStyle = style.namedStyleType;
    const headingId = style.headingId;

    if (namedStyle && namedStyle.startsWith("HEADING") && headingId) {
      // get actual text from heading
      const text = para.elements
        .map((el) => el.textRun?.content ?? "")
        .join("")
        .trim();

      if (!regexTitleHeading.test(text)) continue;
      const link = docUrl + headingId;
      headingLinks.push({ headingName: text, url: link });
    }
  }

  return headingLinks;
}

function createCheckboxToColumnE() {
  const options = [
    "未着手",
    "対応中",
    "レビューはオフショア",
    "親プルリクエストに依存",
    "レビューは日本の方",
    "完了",
  ];

  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(options)
    .setAllowInvalid(false)
    .build();

  return dataValidation;
}

function applyColorRulesToColumnE(sheet) {
  const rules = sheet.getConditionalFormatRules();

  // Rule 1: If value is "未着手" (Not Started) then fill with light gray
  const rule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("未着手")
    .setBackground("#e6e6e6")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 2: If value is "対応中" (In Progress) then fill with light pink
  const rule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("対応中")
    .setBackground("#ffcfc9")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 3: If value is "レビューはオフショア" (Review Offshore) then fill with light yellow
  const rule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("レビューはオフショア")
    .setBackground("#ffe5a0")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 4: If value is "親プルリクエストに依存" (Depends on Parent Pull Request) then fill with light blue
  const rule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("親プルリクエストに依存")
    .setBackground("#0a53a8")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 5: If value is "レビューは日本の方" (Review by Japanese) then fill with light red
  const rule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("レビューは日本の方")
    .setBackground("#b10202")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Rule 6: If value is "完了" (Completed) then fill with light green
  const rule6 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("完了")
    .setBackground("#d4edbc")
    .setRanges([sheet.getRange("E2:E")])
    .build();

  // Override all existing rules for column E
  rules.push(rule1);
  rules.push(rule2);
  rules.push(rule3);
  rules.push(rule4);
  rules.push(rule5);
  rules.push(rule6);
  sheet.setConditionalFormatRules(rules);
}

function createCheckboxToColumnH() {
  const options = ["選択", "フロントエンド", "サーバーサイド", "DB", "CDK"];
  const dataValidation = SpreadsheetApp.newDataValidation()
    .requireValueInList(options)
    .setAllowInvalid(false)
    .build();

  return dataValidation;
}

function applyColorRulesToColumnH(sheet) {
  const rules = sheet.getConditionalFormatRules();

  // Rule 1: If value is "選択" (Select) then fill with light gray
  const rule1 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("選択")
    .setBackground("#e6e6e6")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 2: If value is "フロントエンド" (Frontend) then fill with light pink
  const rule2 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("フロントエンド")
    .setBackground("#ffc8aa")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 3: If value is "サーバーサイド" (Backend) then fill with light yellow
  const rule3 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("サーバーサイド")
    .setBackground("#ffe5a0")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 4: If value is "DB" (Database) then fill with light red
  const rule4 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("DB")
    .setBackground("#b10202")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Rule 5: If value is "CDK" (CDK) then fill with light orange
  const rule5 = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("CDK")
    .setBackground("#fcaf33")
    .setRanges([sheet.getRange("H2:H")])
    .build();

  // Override all existing rules for column H
  rules.push(rule1);
  rules.push(rule2);
  rules.push(rule3);
  rules.push(rule4);
  rules.push(rule5);
  sheet.setConditionalFormatRules(rules);
}

function isSubHeading(input1, input2) {
  const headingLevels = {
    [DocumentApp.ParagraphHeading.HEADING1]: 1,
    [DocumentApp.ParagraphHeading.HEADING2]: 2,
    [DocumentApp.ParagraphHeading.HEADING3]: 3,
    [DocumentApp.ParagraphHeading.HEADING4]: 4,
    [DocumentApp.ParagraphHeading.HEADING5]: 5,
    [DocumentApp.ParagraphHeading.HEADING6]: 6,
  };

  const level1 = headingLevels[input1] || 0;
  const level2 = headingLevels[input2] || 0;

  return level1 > level2;
}

function getLabelFromType(input) {
  const labels = {
    Mutation: "サーバーサイド",
    Query: "サーバーサイド",
    アドミンの各ページ: "フロントエンド",
    ユーザーの各ページ: "フロントエンド",
    DB: "DB",
    CDK: "CDK",
    RESTful: "サーバーサイド",
  };

  return labels[input] || "選択";
}

function getPrefixTitleTask(input) {
  const labels = {
    Mutation: "[michibiku-server]",
    Query: "[michibiku-server]",
    アドミンの各ページ: "[michibiku-client]",
    ユーザーの各ページ: "[michibiku-client]",
    DB: "[michibiku-db]",
    CDK: "[michibiku-cdk]",
    RESTful: "[michibiku-server]",
  };

  return labels[input] || "[michibiku-task]";
}

function createRichTextValue(url) {
  const prefix = "- 修正方針リンク: ";
  const fullText = prefix + url;

  const builder = SpreadsheetApp.newRichTextValue()
    .setText(fullText)
    // set hyperlink for the part after (the link part)
    .setLinkUrl(prefix.length, fullText.length, url)
    .build();

  return builder;
}
